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
  Wallet,
  HandCoins,
  Handshake,
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
        href: "/admin/users",
        icon: Users,
        color: "#00C6A2",
      },
    ],
  },
  "admin/finance": {
    title: "Ödeme & Finans Ayarları",
    description: "Ödeme yöntemleri, limitler ve finans politikaları.",
    cards: [
      {
        title: "Ödeme Yöntemleri",
        description: "Ödeme yöntemlerini ve limit politikalarını yönet.",
        href: "/admin/finance/payment-methods",
        icon: CreditCard,
        color: "#00C6A2",
      },
      {
        title: "Para Birimi & Limitler",
        description: "KYC limitleri ve para birimi politikalarını yönet.",
        href: "/admin/finance/limits",
        icon: Wallet,
        color: "#0085FF",
      },
    ],
  },
  "admin/policy": {
    title: "Konum & Policy Yönetimi",
    description: "Ülke bazlı görünürlük ve policy yönetimi.",
    cards: [
      {
        title: "Ürün Görünürlüğü",
        description: "Ülke bazlı ürün görünürlük ayarları.",
        href: "/admin/policy/products",
        icon: Package,
        color: "#00C6A2",
      },
      {
        title: "Ödeme Yöntemi Görünürlüğü",
        description: "Ülke bazlı ödeme yöntemi ayarları.",
        href: "/admin/policy/payments",
        icon: CreditCard,
        color: "#0085FF",
      },
      {
        title: "Feature Görünürlüğü",
        description: "Çark, Premium ve diğer feature ayarları.",
        href: "/admin/policy/features",
        icon: Globe,
        color: "#FFB400",
      },
      {
        title: "Emergency Override",
        description: "Acil durum kapatma işlemleri.",
        href: "/admin/policy/emergency",
        icon: Globe,
        color: "#FF5050",
      },
    ],
  },
  "admin/cms": {
    title: "İçerik ve SEO Yönetimi",
    description: "Blog, yönlendirmeler ve yasal sayfa yönetimi.",
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
        href: "/admin/cms/redirects",
        icon: ArrowLeftRight,
        color: "#0085FF",
      },
      {
        title: "Yasal Sayfalar",
        description: "Yasal uyarı sayfalarını ve meta verilerini yönet.",
        href: "/admin/cms/legal",
        icon: ScrollText,
        color: "#FFB400",
      },
    ],
  },

  // EPINPAY
  "epinpay/sales": {
    title: "Satış Operasyonları",
    description: "Sipariş ve teslimat operasyonlarını yönet.",
    cards: [
      {
        title: "Siparişler",
        description: "Tüm siparişleri görüntüle ve yönet.",
        href: "/epinpay/sales/orders",
        icon: ShoppingCart,
        badge: 12,
        color: "#00C6A2",
      },
      {
        title: "Teslimat Logları",
        description: "Teslimat durumlarını ve logları takip et.",
        href: "/epinpay/sales/delivery",
        icon: HandCoins,
        color: "#0085FF",
      },
      {
        title: "Problemli Siparişler",
        description: "İptal edilen ve problemli siparişleri yönet.",
        href: "/epinpay/sales/issues",
        icon: HeadphonesIcon,
        badge: 5,
        color: "#FF5050",
      },
    ],
  },
  "epinpay/store": {
    title: "Mağaza Yönetimi",
    description: "Satıcı mağazalarını ve performanslarını yönet.",
    cards: [
      {
        title: "Mağaza Listesi",
        description: "Tüm mağazaları görüntüle ve yönet.",
        href: "/epinpay/store/list",
        icon: Store,
        color: "#00C6A2",
      },
      {
        title: "Mağaza Seviyeleri",
        description: "Mağaza seviye ve komisyon oranlarını yönet.",
        href: "/epinpay/store/levels",
        icon: Handshake,
        color: "#0085FF",
      },
    ],
  },
  "epinpay/offers": {
    title: "Teklif & Stok Yönetimi",
    description: "Teklif ve stok izleme, müdahale işlemleri.",
    cards: [
      {
        title: "Teklif Listesi",
        description: "Tüm teklifleri görüntüle ve yönet.",
        href: "/epinpay/offers/list",
        icon: Handshake,
        color: "#00C6A2",
      },
      {
        title: "Stok İzleme",
        description: "Stok durumlarını takip et ve müdahale et.",
        href: "/epinpay/offers/stock",
        icon: Package,
        color: "#0085FF",
      },
    ],
  },
  "epinpay/products": {
    title: "Ürün & Katalog Yönetimi",
    description: "Ürün kataloğunu ve kategorileri yönet.",
    cards: [
      {
        title: "Ürün Listesi & Detaylar",
        description: "Tüm ürünleri görüntüle, filtrele ve yönet.",
        href: "/epinpay/products",
        icon: Package,
        color: "#00C6A2",
      },
      {
        title: "Kategoriler",
        description: "Ürün kategorilerini ve tag'leri yönet.",
        href: "/epinpay/products/categories",
        icon: Tag,
        color: "#0085FF",
      },
    ],
  },
  "epinpay/marketing": {
    title: "Pazarlama & Kampanya Yönetimi",
    description: "Referans kodları, kazançlar ve yayıncı paketleri.",
    cards: [
      {
        title: "Referans Kodları",
        description: "Referans kodlarını ve kurallarını yönet.",
        href: "/epinpay/streamers/referral",
        icon: Gift,
        color: "#00C6A2",
      },
      {
        title: "Kazançlar & Çekim",
        description: "Kazanç görüntüleme ve çekim taleplerini yönet.",
        href: "/epinpay/streamers/earnings",
        icon: HandCoins,
        color: "#0085FF",
      },
      {
        title: "Yayıncı Paketleri",
        description: "Paket şablonları ve talepleri yönet.",
        href: "/epinpay/streamers/packages",
        icon: Package,
        color: "#FFB400",
      },
      {
        title: "Çekilişler",
        description: "Çekiliş oluştur ve yönet.",
        href: "/epinpay/raffle/list",
        icon: Gift,
        color: "#00C6A2",
      },
      {
        title: "İndirim Kodları",
        description: "İndirim kodlarını ve kuponları yönet.",
        href: "/epinpay/raffle/campaigns",
        icon: Megaphone,
        color: "#0085FF",
      },
    ],
  },  
  "epinpay/support": {
    title: "Destek & İletişim Yönetimi",
    description: "Destek talepleri, mesajlaşma ve yorum yönetimi.",
    cards: [
      {
        title: "Destek Talepleri",
        description: "Kullanıcı destek taleplerini görüntüle ve yanıtla.",
        href: "/epinpay/support/tickets",
        icon: HeadphonesIcon,
        badge: 5,
        color: "#00C6A2",
      },
      {
        title: "Mesajlaşma",
        description: "Kullanıcılarla doğrudan mesajlaşma.",
        href: "/epinpay/support/messages",
        icon: MessageSquare,
        color: "#0085FF",
      },
      {
        title: "Yorumlar",
        description: "Ürün yorumlarını onayla, reddet veya düzenle.",
        href: "/epinpay/support/reviews",
        icon: Star,
        badge: 8,
        color: "#FFB400",
      },
    ],
  },
};