"use client";

import { useState } from "react";
import { Order, OrderFilters, MEMBER_TYPE, ORDER_STATUS, SLA_STATUS, DELIVERY_TYPE, PAYMENT_METHOD } from "@/features/orders/types";
import { toast } from "@/components/common/toast/toast";

const MEMBER_TYPE_LABELS: Record<MEMBER_TYPE, string> = {
  [MEMBER_TYPE.GUEST]: "Misafir",
  [MEMBER_TYPE.NORMAL]: "Normal Üye",
  [MEMBER_TYPE.PREMIUM]: "Premium",
};

const STATUS_LABELS: Record<ORDER_STATUS, string> = {
  [ORDER_STATUS.PENDING]: "Bekliyor",
  [ORDER_STATUS.PROCESSING]: "İşleniyor",
  [ORDER_STATUS.COMPLETED]: "Tamamlandı",
  [ORDER_STATUS.CANCELLED]: "İptal",
  [ORDER_STATUS.REFUNDED]: "İade Edildi",
  [ORDER_STATUS.FAILED]: "Başarısız",
};

const SLA_LABELS: Record<SLA_STATUS, string> = {
  [SLA_STATUS.OK]: "Normal",
  [SLA_STATUS.AT_RISK]: "Risk Altında",
  [SLA_STATUS.BREACHED]: "İhlal Edildi",
};

const DELIVERY_LABELS: Record<DELIVERY_TYPE, string> = {
  [DELIVERY_TYPE.EPIN]: "E-Pin",
  [DELIVERY_TYPE.TOP_UP]: "Top Up",
  [DELIVERY_TYPE.ID_LOAD]: "ID Yükleme",
};

const PAYMENT_LABELS: Record<PAYMENT_METHOD, string> = {
  [PAYMENT_METHOD.CREDIT_CARD]: "Kredi Kartı",
  [PAYMENT_METHOD.BANK_TRANSFER]: "Havale/EFT",
  [PAYMENT_METHOD.WALLET]: "Cüzdan",
  [PAYMENT_METHOD.CRYPTO]: "Kripto",
};

const EXPORT_LIMIT = 50_000;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("tr-TR");
}

function ordersToRows(orders: Order[]) {
  return orders.map((o) => ({
    "Sipariş ID": o.id,
    "Kullanıcı ID": o.userId ?? "Misafir",
    "Kullanıcı Adı": o.user?.fullName ?? o.guestEmail ?? "—",
    "E-posta": o.user?.email ?? o.guestEmail ?? "—",
    "Tarih": formatDate(o.createdAt),
    "Ürün Sayısı": o.productCount,
    "Ürün İsimleri": o.products.map((p) => p.name).join(", "),
    "Teslimat Tipi": DELIVERY_LABELS[o.delivery.deliveryType],
    "Üye Tipi": MEMBER_TYPE_LABELS[o.memberType],
    "İşlem Durumu": STATUS_LABELS[o.status],
    "SLA Durumu": SLA_LABELS[o.slaStatus],
    "Toplam Tutar": o.totalAmount,
    "Para Birimi": o.currency,
    "Ödeme Yöntemi": PAYMENT_LABELS[o.payment.method],
    "Ödeme Durumu": o.payment.status === "success" ? "Başarılı" : o.payment.status === "refunded" ? "İade" : o.payment.status === "failed" ? "Başarısız" : "Bekliyor",
    "SLA İptal mi": o.isSlaCancel ? "Evet" : "Hayır",
    "İptal Nedeni": o.cancelReason ?? "—",
    "Güncellenme Tarihi": formatDate(o.updatedAt),
  }));
}

export function useOrderExport() {
  const [exporting, setExporting] = useState(false);

  const exportExcel = async (orders: Order[], filters?: OrderFilters) => {
    setExporting(true);
    try {
      if (orders.length === 0) {
        toast.error("Export", "Dışa aktarılacak sipariş bulunamadı.");
        return;
      }

      if (orders.length > EXPORT_LIMIT) {
        toast.error(
          "Export",
          `Seçili filtre çok fazla kayıt içeriyor (${orders.length.toLocaleString("tr-TR")}). Lütfen tarih aralığını daraltın.`
        );
        return;
      }

      // SheetJS dinamik import — bundle'a her zaman eklenmez
      const XLSX = await import("xlsx");

      const rows = ordersToRows(orders);
      const worksheet = XLSX.utils.json_to_sheet(rows);

      // Kolon genişlikleri
      worksheet["!cols"] = [
        { wch: 12 },  // Sipariş ID
        { wch: 12 },  // Kullanıcı ID
        { wch: 24 },  // Kullanıcı Adı
        { wch: 28 },  // E-posta
        { wch: 20 },  // Tarih
        { wch: 12 },  // Ürün Sayısı
        { wch: 40 },  // Ürün İsimleri
        { wch: 16 },  // Teslimat Tipi
        { wch: 14 },  // Üye Tipi
        { wch: 16 },  // İşlem Durumu
        { wch: 16 },  // SLA Durumu
        { wch: 14 },  // Toplam Tutar
        { wch: 10 },  // Para Birimi
        { wch: 16 },  // Ödeme Yöntemi
        { wch: 14 },  // Ödeme Durumu
        { wch: 14 },  // SLA İptal mi
        { wch: 36 },  // İptal Nedeni
        { wch: 20 },  // Güncellenme Tarihi
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Siparişler");

      const fileName = `siparisler_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      toast.success(
        "Export Tamamlandı",
        `${orders.length} sipariş Excel dosyasına aktarıldı.`
      );
    } catch (err) {
      toast.error("Hata", "Excel dosyası oluşturulamadı. Lütfen tekrar deneyin.");
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  return { exportExcel, exporting };
}