"use client";

import * as React from "react";
import { Trash2, Loader2, Search, RefreshCw } from "lucide-react";
import { offerService } from "../services/offer.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Stock {
  id: number;
  key: string;
  status: string;
  created_at: string;
}

interface StockManagerProps {
  offerId: string;
  offerType: string;
}

export function StockManager({ offerId, offerType }: StockManagerProps) {
  const [stocks, setStocks] = React.useState<Stock[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const fetchStocks = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await offerService.getStocks({ offerId, pageSize: 100 });
      if (response.success && response.data) {
        setStocks(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch stocks:", err);
      toast.error("Stoklar yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [offerId]);

  React.useEffect(() => {
    if (offerType === "NORMAL") {
      fetchStocks();
    }
  }, [offerId, offerType, fetchStocks]);

  const handleDelete = async (stockId: number) => {
    if (!confirm("Bu stok kaydını silmek istediğinize emin misiniz?")) return;

    setDeletingId(stockId);
    try {
      const response = await offerService.deleteStock(stockId);
      if (response.success) {
        toast.success("Stok başarıyla silindi.");
        setStocks((prev) => prev.filter((s) => s.id !== stockId));
      }
    } catch (err) {
      console.error("Failed to delete stock:", err);
      toast.error("Stok silinirken bir hata oluştu.");
    } finally {
      setDeletingId(null);
    }
  };

  if (offerType !== "NORMAL") return null;

  return (
    <div 
      className="mt-8 rounded-2xl border overflow-hidden"
      style={{ background: "var(--background-card)", borderColor: "var(--border)" }}
    >
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
        <div>
          <h3 className="text-lg font-bold">Stok Yönetimi (E-pinler)</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Toplam {stocks.length} stok kaydı bulunuyor.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchStocks} disabled={loading}>
          <RefreshCw size={14} className={loading ? "animate-spin mr-2" : "mr-2"} />
          Yenile
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30">
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">ID</th>
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">E-pin Kodu</th>
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Durum</th>
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Tarih</th>
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && stocks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <Loader2 className="animate-spin mx-auto mb-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Yükleniyor...</span>
                </td>
              </tr>
            ) : stocks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-muted-foreground">
                  Henüz stok girişi yapılmamış.
                </td>
              </tr>
            ) : (
              stocks.map((stock) => (
                <tr key={stock.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-3 text-xs font-mono">#{stock.id}</td>
                  <td className="px-6 py-3 text-sm font-medium">{stock.key}</td>
                  <td className="px-6 py-3">
                    <Badge 
                      variant={stock.status === "AVAILABLE" ? "default" : "secondary"}
                      className="text-[10px]"
                    >
                      {stock.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-3 text-xs text-muted-foreground">
                    {new Date(stock.created_at).toLocaleString("tr-TR")}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      onClick={() => handleDelete(stock.id)}
                      disabled={deletingId === stock.id || stock.status === "SOLD"}
                      title={stock.status === "SOLD" ? "Satılmış stok silinemez" : "Sil"}
                    >
                      {deletingId === stock.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
