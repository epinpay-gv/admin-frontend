export interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}