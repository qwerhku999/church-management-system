import {
  LayoutDashboard,
  Users,
  UserCheck,
  CalendarDays,
  Building2,
  Wallet,
  HandCoins,
  HeartHandshake,
  UserPlus,
  Megaphone,
  FileText,
  Bell,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type Role = "admin" | "pastor" | "staff" | "member";

export const ROLES: Record<string, Role> = {
  ADMIN: "admin",
  PASTOR: "pastor",
  STAFF: "staff",
  MEMBER: "member",
};

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrator",
  pastor: "Pastor",
  staff: "Staff",
  member: "Member",
};

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
  group: "Overview" | "People" | "Operations" | "Communication" | "System";
}

const ALL: Role[] = ["admin", "pastor", "staff", "member"];

export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard, roles: ALL, group: "Overview" },
  { title: "Members", href: "/members", icon: Users, roles: ["admin", "pastor", "staff"], group: "People" },
  { title: "Attendance", href: "/attendance", icon: UserCheck, roles: ["admin", "pastor", "staff"], group: "People" },
  { title: "Visitors", href: "/visitors", icon: UserPlus, roles: ["admin", "pastor", "staff"], group: "People" },
  { title: "Events", href: "/events", icon: CalendarDays, roles: ALL, group: "Operations" },
  { title: "Ministries", href: "/ministries", icon: Building2, roles: ALL, group: "Operations" },
  { title: "Donations", href: "/donations", icon: HandCoins, roles: ["admin", "pastor"], group: "Operations" },
  { title: "Finance", href: "/finance", icon: Wallet, roles: ["admin", "pastor"], group: "Operations" },
  { title: "Prayer Requests", href: "/prayers", icon: HeartHandshake, roles: ALL, group: "Communication" },
  { title: "Announcements", href: "/announcements", icon: Megaphone, roles: ["admin", "pastor", "staff"], group: "Communication" },
  { title: "Notifications", href: "/notifications", icon: Bell, roles: ALL, group: "Communication" },
  { title: "Documents", href: "/documents", icon: FileText, roles: ["admin", "pastor", "staff"], group: "System" },
  { title: "Reports", href: "/reports", icon: BarChart3, roles: ["admin", "pastor"], group: "System" },
  { title: "Settings", href: "/settings", icon: Settings, roles: ["admin"], group: "System" },
];

export const NAV_GROUPS: Array<NavItem["group"]> = [
  "Overview",
  "People",
  "Operations",
  "Communication",
  "System",
];

export function filterNavByRole(role: string | undefined): NavItem[] {
  const r = (role as Role) ?? "member";
  return NAV_ITEMS.filter((item) => item.roles.includes(r));
}
