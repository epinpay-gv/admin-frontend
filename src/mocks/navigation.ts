import {
  LayoutDashboard,
  Bell,
  ArrowLeftRight,
  Wallet,
  CreditCard,
  Users,
  BarChart3,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { NavGroup } from "@/features/navigation/types";

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Genel",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { label: "Bildirimler", icon: Bell, href: "/notifications", badge: 4 },
    ],
  },
  {
    title: "Finans",
    items: [
      { label: "İşlemler", icon: ArrowLeftRight, href: "/transactions" },
      { label: "Cüzdanlar", icon: Wallet, href: "/wallets" },
      { label: "Kartlar", icon: CreditCard, href: "/cards" },
    ],
  },
  {
    title: "Yönetim",
    items: [
      { label: "Kullanıcılar", icon: Users, href: "/users" },
      { label: "Raporlar", icon: BarChart3, href: "/reports" },
      { label: "Güvenlik", icon: ShieldCheck, href: "/security" },
      { label: "Ayarlar", icon: Settings, href: "/settings" },
    ],
  },
];