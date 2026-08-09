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

export const ROLES: Record<string, Role> = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  PASTOR: "pastor",
  SECRETARY: "secretary",
  TREASURER: "treasurer",
  FINANCE_OFFICER: "finance_officer",
  MINISTRY_LEADER: "ministry_leader",
  VOLUNTEER: "volunteer",
  MEMBER: "member",
};

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
  group:
  | "Overview"
  | "People"
  | "Operations"
  | "Communication"
  | "System";
}

const ALL: Role[] = [
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
    roles: ALL,
    group: "Overview",
  },

  {
    title: "Members",
    href: "/members",
    icon: Users,
    roles: [
      "super_admin",
      "admin",
      "pastor",
      "secretary",
      "ministry_leader",
    ],
    group: "People",
  },

  {
    title: "Attendance",
    href: "/attendance",
    icon: UserCheck,
    roles: [
      "super_admin",
      "admin",
      "pastor",
      "secretary",
      "ministry_leader",
      "volunteer",
    ],
    group: "People",
  },

  {
    title: "Visitors",
    href: "/visitors",
    icon: UserPlus,
    roles: [
      "super_admin",
      "admin",
      "pastor",
      "secretary",
      "ministry_leader",
      "volunteer",
    ],
    group: "People",
  },

  {
    title: "Events",
    href: "/events",
    icon: CalendarDays,
    roles: [
      "super_admin",
      "admin",
      "pastor",
      "secretary",
      "ministry_leader",
      "volunteer",
      "member",
    ],
    group: "Operations",
  },

  {
    title: "Ministries",
    href: "/ministries",
    icon: Building2,
    roles: [
      "super_admin",
      "admin",
      "pastor",
      "ministry_leader",
      "volunteer",
      "member",
    ],
    group: "Operations",
  },

  {
    title: "Donations",
    href: "/donations",
    icon: HandCoins,
    roles: [
      "super_admin",
      "admin",
      "pastor",
      "treasurer",
      "finance_officer",
    ],
    group: "Operations",
  },

  {
    title: "Finance",
    href: "/finance",
    icon: Wallet,
    roles: [
      "super_admin",
      "admin",
      "pastor",
      "treasurer",
      "finance_officer",
    ],
    group: "Operations",
  },

  {
    title: "Prayer Requests",
    href: "/prayers",
    icon: HeartHandshake,
    roles: ALL,
    group: "Communication",
  },

  {
    title: "Announcements",
    href: "/announcements",
    icon: Megaphone,
    roles: [
      "super_admin",
      "admin",
      "pastor",
      "secretary",
      "ministry_leader",
    ],
    group: "Communication",
  },

  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
    roles: ALL,
    group: "Communication",
  },

  {
    title: "Documents",
    href: "/documents",
    icon: FileText,
    roles: [
      "super_admin",
      "admin",
      "pastor",
      "secretary",
      "treasurer",
      "finance_officer",
      "ministry_leader",
    ],
    group: "System",
  },

  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
    roles: [
      "super_admin",
      "admin",
      "pastor",
      "treasurer",
      "finance_officer",
    ],
    group: "System",
  },

  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["super_admin", "admin"],
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
  const r = role as Role;

  return NAV_ITEMS.filter((item) => item.roles.includes(r));
}