import {
  LayoutDashboard,
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
  Settings,
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
        href: "/hub/users",
        label: "Kullanıcılar",
        icon: Users,
        children: [
          { href: "/users/list", label: "Kullanıcı Listesi", icon: Users },
          { href: "/orders", label: "Siparişler", icon: ShoppingCart },
        ],
      },
      {
        href: "/hub/store",
        label: "Mağaza & Ürün",
        icon: Store,
        children: [
          { href: "/stores", label: "Mağazalar", icon: Store },
          { href: "/offers", label: "Teklifler & Stok", icon: Package },
          { href: "/categories", label: "Kategoriler", icon: Tag },
          { href: "/products", label: "Ürünler", icon: Package },
        ],
      },
      {
        href: "/hub/finance",
        label: "Finans",
        icon: Wallet,
        children: [
          { href: "/payment-methods", label: "Ödeme Yöntemleri", icon: CreditCard },
          { href: "/referral", label: "Referans & Yayıncı", icon: Gift },
          { href: "/campaigns", label: "Çekiliş & Kampanya", icon: Megaphone },
        ],
      },
      {
        href: "/hub/communication",
        label: "İletişim",
        icon: MessageSquare,
        children: [
          { href: "/support", label: "Destek Talepleri", icon: HeadphonesIcon },
          { href: "/messages", label: "Mesajlaşma", icon: MessageSquare },
          { href: "/reviews", label: "Yorumlar", icon: Star },
        ],
      },
      {
        href: "/hub/system",
        label: "Sistem",
        icon: Settings,
        children: [
          { href: "/blog", label: "Blog & Makaleler", icon: FileText },
          { href: "/redirects", label: "Yönlendirmeler", icon: ArrowLeftRight },
          { href: "/legal", label: "Yasal Sayfalar", icon: ScrollText },
          { href: "/policy", label: "Konum & Policy", icon: Globe },
        ],
      },
    ],
  },
];