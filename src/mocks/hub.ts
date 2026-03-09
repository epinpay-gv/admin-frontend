import {
  Users,
  ShoppingCart,
  Store,
  Package,
  Tag,
  CreditCard,
  Gift,
  Megaphone,
  HeadphonesIcon,
  MessageSquare,
  Star,
  FileText,
  ArrowLeftRight,
  ScrollText,
  Globe,
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
  users: {
    title: "Kullanıcılar",
    description: "Kullanıcı yönetimi ve kimlik doğrulama işlemleri.",
    cards: [
      {
        title: "Kullanıcı Listesi",
        description: "Tüm kullanıcıları görüntüle, filtrele ve yönet.",
        href: "/users/list",
        icon: Users,
        color: "#00C6A2",
      },
      {
        title: "Siparişler",
        description: "Sipariş ve teslimat operasyonlarını yönet.",
        href: "/orders",
        icon: ShoppingCart,
        badge: 12,
        color: "#0085FF",
      },
    ],
  },
  store: {
    title: "Mağaza & Ürün",
    description: "Mağaza, ürün ve katalog yönetimi.",
    cards: [
      {
        title: "Mağazalar",
        description: "Satıcı mağazalarını görüntüle ve yönet.",
        href: "/stores",
        icon: Store,
        color: "#00C6A2",
      },
      {
        title: "Teklifler & Stok",
        description: "Teklif ve stok izleme, müdahale işlemleri.",
        href: "/offers",
        icon: Package,
        color: "#0085FF",
      },
      {
        title: "Kategoriler",
        description: "Ürün kategorilerini ve tag'leri yönet.",
        href: "/categories",
        icon: Tag,
        color: "#FFB400",
      },
      {
        title: "Ürünler",
        description: "Ürün kataloğunu görüntüle ve düzenle.",
        href: "/products",
        icon: Package,
        color: "#FF5050",
      },
    ],
  },
  finance: {
    title: "Finans",
    description: "Ödeme yöntemleri, referans ve kampanya yönetimi.",
    cards: [
      {
        title: "Ödeme Yöntemleri",
        description: "Ödeme yöntemlerini ve limit politikalarını yönet.",
        href: "/payment-methods",
        icon: CreditCard,
        color: "#00C6A2",
      },
      {
        title: "Referans & Yayıncı",
        description: "Referans kodları, kazançlar ve yayıncı paketleri.",
        href: "/referral",
        icon: Gift,
        color: "#0085FF",
      },
      {
        title: "Çekiliş & Kampanya",
        description: "Çekiliş yönetimi ve indirim kodları.",
        href: "/campaigns",
        icon: Megaphone,
        color: "#FFB400",
      },
    ],
  },
  communication: {
    title: "İletişim",
    description: "Destek talepleri, mesajlaşma ve yorum yönetimi.",
    cards: [
      {
        title: "Destek Talepleri",
        description: "Kullanıcı destek taleplerini görüntüle ve yanıtla.",
        href: "/support",
        icon: HeadphonesIcon,
        badge: 5,
        color: "#00C6A2",
      },
      {
        title: "Mesajlaşma",
        description: "Kullanıcılarla doğrudan mesajlaşma.",
        href: "/messages",
        icon: MessageSquare,
        color: "#0085FF",
      },
      {
        title: "Yorumlar",
        description: "Ürün yorumlarını onayla, reddet veya düzenle.",
        href: "/reviews",
        icon: Star,
        badge: 8,
        color: "#FFB400",
      },
    ],
  },
  system: {
    title: "Sistem",
    description: "İçerik yönetimi ve sistem politikaları.",
    cards: [
      {
        title: "Blog & Makaleler",
        description: "Blog yazılarını oluştur, düzenle ve yayınla.",
        href: "/blog",
        icon: FileText,
        color: "#00C6A2",
      },
      {
        title: "Yönlendirmeler",
        description: "URL yönlendirmelerini tekli veya toplu yönet.",
        href: "/redirects",
        icon: ArrowLeftRight,
        color: "#0085FF",
      },
      {
        title: "Yasal Sayfalar",
        description: "Yasal uyarı sayfalarını ve meta verilerini yönet.",
        href: "/legal",
        icon: ScrollText,
        color: "#FFB400",
      },
      {
        title: "Konum & Policy",
        description: "Ülke bazlı görünürlük ve policy yönetimi.",
        href: "/policy",
        icon: Globe,
        color: "#FF5050",
      },
    ],
  },
};