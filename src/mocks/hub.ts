import {
  Users,
  ShoppingCart,
  Store,
  LayoutGrid,
  List,
  CreditCard,
  Gift,
  Newspaper,
  ArrowLeftRight,
  Gamepad,
  type LucideIcon,
} from "lucide-react";

export interface HubCard {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  color?: string;
}

export interface HubPage {
  title: string;
  description: string;
  cards: HubCard[];
}

export const HUB_PAGES: Record<string, HubPage> = {
  // ADMIN
  "admin/users": {
    title: "Kullanıcı Yönetimi",
    description: "Kullanıcı yönetimi ve kimlik doğrulama işlemleri.",
    cards: [
      {
        title: "Kullanıcı Listesi & Detaylar",
        description: "Tüm kullanıcıları görüntüle, filtrele ve yönet.",
        href: "/users",
        icon: Users,
        color: "#00C6A2",
      },
    ],
  },

  "admin/policy": {
    title: "Konum & Policy Yönetimi",
    description: "Ülke bazlı görünürlük ve policy yönetimi.",
    cards: [
      {
        title: "Ödeme Yöntemi Görünürlüğü",
        description: "Ülke bazlı ödeme yöntemi ayarları.",
        href: "/payment",
        icon: CreditCard,
        color: "#0085FF",
      },
    ],
  },

  "admin/cms": {
    title: "İçerik ve SEO Yönetimi",
    description: "Blog, yönlendirmeler ve yasal sayfa yönetimi.",
    cards: [
      {
        title: "Blog Yönetimi",
        description: "Blog yazılarını oluştur, düzenle ve yayınla.",
        href: "/blog",
        icon: Newspaper,
        color: "#00C6A2",
      },
      {
        title: "Yönlendirmeler",
        description: "URL yönlendirmelerini yönet.",
        href: "/admin/cms/redirects",
        icon: ArrowLeftRight,
        color: "#0085FF",
      },
      {
        title: "Yasal Sayfalar",
        description: "Yasal sayfaları yönet.",
        href: "/admin/cms/legal",
        icon: Newspaper,
        color: "#FFB400",
      },
    ],
  },

  // EPINPAY
  "epinpay/sales": {
    title: "Satış Operasyonları",
    description: "Sipariş ve mağaza operasyonlarını yönet.",
    cards: [
      {
        title: "Siparişler",
        description: "Tüm siparişleri görüntüle ve yönet.",
        href: "/epinpay/orders",
        icon: ShoppingCart,
        color: "#00C6A2",
      },
      {
        title: "Epinpay Mağazaları",
        description: "Mağazaları görüntüle ve yönet.",
        href: "/store",
        icon: Store,
        color: "#0085FF",
      },
    ],
  },

  "epinpay/products": {
    title: "Ürün & Katalog Yönetimi",
    description: "Ürün kataloğunu ve kategorileri yönet.",
    cards: [
      {
        title: "Ürünler",
        description: "Tüm ürünleri yönet.",
        href: "/epinpay/products",
        icon: List,
        color: "#00C6A2",
      },
      {
        title: "Kategoriler",
        description: "Kategori yönetimi.",
        href: "/epinpay/categories",
        icon: LayoutGrid,
        color: "#0085FF",
      },
    ],
  },

  "epinpay/marketing": {
    title: "Pazarlama & Kampanya Yönetimi",
    description: "Kampanya, çekiliş ve yayıncı yönetimi.",
    cards: [
      {
        title: "Çekilişler",
        description: "Çekiliş oluştur ve yönet.",
        href: "/epinpay/raffles",
        icon: Gift,
        color: "#00C6A2",
      },
      {
        title: "Yayıncılar",
        description: "Yayıncıları yönet.",
        href: "/streamers",
        icon: Gamepad,
        color: "#0085FF",
      },
    ],
  },
};
