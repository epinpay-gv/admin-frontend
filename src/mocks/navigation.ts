import {
  LayoutDashboard,
  Users,
  Store,
  Globe,
  PersonStanding,
  HandCoins,
  Package,
  TrendingUp,
  Gift,
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
      {
        href: "/hub/admin/policy",
        label: "Konum & Policy Yönetimi",
        icon: Globe,
        children: [
          {
            href: "/admin/payment-policy",
            label: "Ödeme Yöntemi Görünürlüğü",
            icon: CreditCard,
          },
        ],
      },
      {
        href: "/hub/admin/cms",
        label: "İçerik ve SEO",
        icon: PersonStanding,
        children: [
          { href: "/blog", label: "Blog Yönetimi", icon: Newspaper },
          {
            href: "/admin/cms/redirects",
            label: "Yönlendirmeler",
            icon: ArrowLeftRight,
          }, 
          {
            href: "/admin/cms/legal",
            label: "Yasal Sayfalar",
            icon: Newspaper,
          }, 
        ],
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
            label: "Siparişler",
            icon: ShoppingCart,
          },
          {
            href: "/store",
            label: "Epinpay Mağazaları",
            icon: Store,
          },
        ],
      },
      {
        href: "/hub/epinpay/products",
        label: "Ürün & Katalog",
        icon: Package,
        children: [
          {
            href: "/epinpay/products",
            label: "Ürünler",
            icon: List,
          },
          {
            href: "/epinpay/categories",
            label: "Kategoriler",
            icon: LayoutGrid,
          },
        ],
      },
      {
        href: "/hub/epinpay/marketing",
        label: "Pazarlama & Kampanya",
        icon: TrendingUp,
        children: [
          {
            href: "/epinpay/raffles",
            label: "Çekilişler",
            icon: Gift,
          },
          {
            href: "/streamers",
            label: "Yayıncılar",
            icon: Gamepad,
          },
        ],
      },
    ],
  },
];
