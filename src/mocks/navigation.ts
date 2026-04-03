import {
  LayoutDashboard,
  Users,
  Store,
  Globe,
  Wallet,
  PersonStanding,
  HandCoins,
  Handshake,
  Package,
  TrendingUp,
  Gift,
  MessageSquare,
  Newspaper,
  List,
  LayoutGrid,
  ShoppingCart,
  Gamepad,
  CreditCard,
  ArrowLeftRight,
} from "lucide-react";
import { NavGroup } from "@/features/navigation/types";

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Genel",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Yönetim",
    items: [
      {
        href: "/hub/admin/users",
        label: "Kullanıcı Yönetimi",
        icon: Users,
        children: [
          {
            href: "/users",
            label: "Kullanıcı Listesi & Detaylar",
            icon: Users,
          },
        ],
      },
      // {
      //   href: "/hub/admin/finance",
      //   label: "Ödeme & Finans Ayarları",
      //   icon: Wallet,
      //   children: [
      //   ],
      // },
      {
        href: "/hub/admin/policy",
        label: "Konum & Policy Yönetimi",
        icon: Globe,
        children: [
          {
            href: "/users",
            label: "Ödeme Yöntemi Görünürlüğü",
            icon: CreditCard,
          },
        ],
      },
      {
        href: "/hub/admin/cms",
        label: "İçerik ve SEO Yönetimi",
        icon: PersonStanding,
        children: [
          { href: "/blog", label: "Blog Yönetimi", icon: Newspaper },
          { href: "/admin/cms/redirects", label: "Yönlendirmeler", icon: ArrowLeftRight }, // TODO 
          { href: "/admin/cms/legal", label: "Yasal Sayfalar", icon: Newspaper }, // TODO 
        ],
      },
      {
        href: "/store",
        label: "Epinpay Mağazaları",
        icon: Store,
      },
    ],
  },
  {
    title: "Epinpay",
    items: [
      {
        href: "/hub/epinpay/sales",
        label: "Satış Operasyonları",
        icon: HandCoins,
        children: [
          {
            href: "/epinpay/orders",
            label: "Sipariş Listesi & Detaylar",
            icon: ShoppingCart,
          },
        ],
      },
      // {
      //   href: "/hub/epinpay/store",
      //   label: "Mağaza Yönetimi",
      //   icon: Store,
      //   children: [
      //   ]
      // },
      // {
      //   href: "/hub/epinpay/offers",
      //   label: "Teklif & Stok Yönetimi",
      //   icon: Handshake,
      //   children: [
      //   ]
      // },
      {
        href: "/hub/epinpay/products",
        label: "Ürün & Katalog Yönetimi",
        icon: Package,
        children: [
          {
            href: "/epinpay/products",
            label: "Ürün Listesi & Detaylar",
            icon: List,
          },
          {
            href: "/epinpay/categories",
            label: "Kategori Listesi & Detaylar",
            icon: LayoutGrid,
          },
        ],
      },
      {
        href: "/hub/epinpay/marketing",
        label: "Pazarlama & Kampanya Yönetimi",
        icon: TrendingUp,
        children: [
          {
            href: "/epinpay/raffles",
            label: "Çekiliş Listesi & Detaylar",
            icon: Gift,
          },
        ],
      },
      // {
      //   href: "/hub/epinpay/support",
      //   label: "Destek & İletişim Yönetimi",
      //   icon: MessageSquare,
      //   children: [
      //   ]
      // },
      {
        href: "/streamers",
        label: "Yayıncılar",
        icon: Gamepad,
      },
    ],
  },
];
