import { NextRequest, NextResponse } from "next/server";
import { mockOrders } from "@/mocks/orders";
import { Order } from "@/features/orders/types";

/**
 * Filtreleme mantığını tek bir yerde topluyoruz.
 * Hem GET (liste) hem POST (export) için kullanılabilir.
 */
function applyFilters(orders: Order[], searchParams: URLSearchParams): Order[] {
  let result = [...orders];

  // Parametreleri alıyoruz
  const id = searchParams.get("id");
  const userEmail = searchParams.get("userEmail")?.toLowerCase();
  const search = searchParams.get("search")?.toLowerCase();
  const status = searchParams.get("status");
  const memberType = searchParams.get("memberType");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const userId = searchParams.get("userId");

  // 1. Sipariş ID Filtresi
  if (id) {
    result = result.filter((o) => String(o.id).includes(id));
  }

  // 2. Kullanıcı / Email Filtresi (userEmail alanı için)
  if (userEmail) {
    result = result.filter((o) => 
      o.user?.fullName.toLowerCase().includes(userEmail) || 
      o.guestEmail?.toLowerCase().includes(userEmail)
    );
  }

  // 3. Genel Arama (search alanı için)
  if (search) {
    result = result.filter((o) => 
      String(o.id).includes(search) ||
      o.user?.fullName.toLowerCase().includes(search) ||
      o.guestEmail?.toLowerCase().includes(search)
    );
  }

  // 4. Durum Filtresi
  if (status && status !== "all") {
    result = result.filter((o) => o.status === status);
  }

  // 5. Üye Tipi Filtresi
  if (memberType && memberType !== "all") {
    result = result.filter((o) => o.memberType === memberType);
  }

  // 6. Tarih Filtreleri
  if (dateFrom) {
    result = result.filter((o) => new Date(o.createdAt) >= new Date(dateFrom));
  }
  if (dateTo) {
    result = result.filter((o) => new Date(o.createdAt) <= new Date(dateTo));
  }

  // 7. Kullanıcı ID Filtresi
  if (userId) {
    result = result.filter((o) => o.userId === Number(userId));
  }

  // Sıralama: En yeni en üstte
  return result.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// --- HANDLERS ---

export async function GET(req: NextRequest) {
  const filtered = applyFilters(mockOrders, req.nextUrl.searchParams);
  return NextResponse.json<Order[]>(filtered);
}

export async function POST(req: NextRequest) {
  const isExport = req.nextUrl.pathname.endsWith("/export");

  if (isExport) {
    // Export isteğinde filtreler hem URL'den hem body'den gelebilir.
    // Senin servis dosyan URL'e yazdığı için searchParams kullanıyoruz.
    const filtered = applyFilters(mockOrders, req.nextUrl.searchParams);

    // Gerçek senaryoda burada Excel Blob oluşturulur. 
    // Mock yapıda veriyi dönüyoruz.
    return NextResponse.json(
      { 
        message: "Export başarılı.", 
        count: filtered.length, 
        data: filtered 
      }, 
      { status: 200 }
    );
  }

  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}