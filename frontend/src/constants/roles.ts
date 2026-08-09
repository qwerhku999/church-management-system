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

export type Role =
  | "super_admin"
  | "admin"
  | "pastor"
  | "secretary"
  | "treasurer"
  | "finance_officer"
  | "ministry_leader"
  | "volunteer"
  | "member";

export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  PASTOR: "pastor",
  SECRETARY: "secretary",
  TREASURER: "treasurer",
  FINANCE_OFFICER: "finance_officer",
  MINISTRY_LEADER: "ministry_leader",
  VOLUNTEER: "volunteer",
  MEMBER: "member",
} as const;

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Administrator",
  admin: "Administrator",
  pastor: "Pastor",
  secretary: "Secretary",
  treasurer: "Treasurer",
  finance_officer: "Finance Officer",
  ministry_leader: "Ministry Leader",
  volunteer: "Volunteer",
  member: "Member",
};

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
  group: "Overview" | "People" | "Operations" | "Communication" | "System";
}

const ADMIN_ROLES: Role[] = [
  "super_admin",
  "admin",
];

const LEADERSHIP_ROLES: Role[] = [
  "super_admin",
  "admin",
  "pastor",
];

const PEOPLE_ROLES: Role[] = [
  "super_admin",
  "admin",
  "pastor",
  "secretary",
  "ministry_leader",
];

const FINANCE_ROLES: Role[] = [
  "super_admin",
  "admin",
  "pastor",
  "treasurer",
  "finance_officer",
];

const STAFF_ROLES: Role[] = [
  "super_admin",
  "admin",
  "pastor",
  "secretary",
  "treasurer",
  "finance_officer",
  "ministry_leader",
];

const ALL_ROLES: Role[] = [
  "super_admin",
  "admin",
  "pastor",
  "secretary",
  "treasurer",
  "finance_officer",
  "ministry_leader",
  "volunteer",
  "member",
];

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    roles: ALL_ROLES,
    group: "Overview",
  },

  {
    title: "Members",
    href: "/members",
    icon: Users,
    roles: PEOPLE_ROLES,
    group: "People",
  },

  {
    title: "Attendance",
    href: "/attendance",
    icon: UserCheck,
    roles: PEOPLE_ROLES,
    group: "People",
  },

  {
    title: "Visitors",
    href: "/visitors",
    icon: UserPlus,
    roles: PEOPLE_ROLES,
    group: "People",
  },

  {
    title: "Events",
    href: "/events",
    icon: CalendarDays,
    roles: ALL_ROLES,
    group: "Operations",
  },

  {
    title: "Ministries",
    href: "/ministries",
    icon: Building2,
    roles: ALL_ROLES,
    group: "Operations",
  },

  {
    title: "Donations",
    href: "/donations",
    icon: HandCoins,
    roles: FINANCE_ROLES,
    group: "Operations",
  },

  {
    title: "Finance",
    href: "/finance",
    icon: Wallet,
    roles: FINANCE_ROLES,
    group: "Operations",
  },

  {
    title: "Prayer Requests",
    href: "/prayers",
    icon: HeartHandshake,
    roles: ALL_ROLES,
    group: "Communication",
  },

  {
    title: "Announcements",
    href: "/announcements",
    icon: Megaphone,
    roles: STAFF_ROLES,
    group: "Communication",
  },

  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
    roles: ALL_ROLES,
    group: "Communication",
  },

  {
    title: "Documents",
    href: "/documents",
    icon: FileText,
    roles: STAFF_ROLES,
    group: "System",
  },

  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
    roles: LEADERSHIP_ROLES,
    group: "System",
  },

  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ADMIN_ROLES,
    group: "System",
  },
];

export const NAV_GROUPS: Array<NavItem["group"]> = [
  "Overview",
  "People",
  "Operations",
  "Communication",
  "System",
];

export function filterNavByRole(role: string | undefined): NavItem[] {
  const r = role as Role | undefined;

  if (!r) {
    return [];
  }

  return NAV_ITEMS.filter((item) => item.roles.includes(r));
}