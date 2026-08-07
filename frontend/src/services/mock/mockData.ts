/**
 * ------------------------------------------------------------------
 * TEMPORARY MOCK DATA LAYER
 * ------------------------------------------------------------------
 * This module powers the frontend when the real MinistryFlow API
 * (NEXT_PUBLIC_API_URL) is not configured or is unreachable.
 *
 * It is intentionally isolated from the real service layer. When a
 * backend URL is provided, the services call the real API and this
 * file is never used. See `src/services/api.ts` for the switch.
 *
 * The shapes returned here mirror the backend response envelope:
 *   { success, message, data, pagination }
 * ------------------------------------------------------------------
 */

export const MINISTRIES = [
  "Worship",
  "Youth",
  "Children",
  "Ushering",
  "Media",
  "Prayer",
  "Outreach",
  "Choir",
  "Men's Fellowship",
  "Women's Fellowship",
];

const FIRST_NAMES = [
  "Kwame", "Ama", "Kofi", "Akosua", "Yaw", "Abena", "Kojo", "Efua", "Kwesi",
  "Adwoa", "Daniel", "Grace", "Samuel", "Esther", "Michael", "Ruth", "Emmanuel",
  "Naomi", "Joseph", "Deborah", "David", "Hannah", "Isaac", "Priscilla", "Elijah",
  "Comfort", "Nathaniel", "Gifty", "Solomon", "Mercy",
];

const LAST_NAMES = [
  "Mensah", "Owusu", "Boateng", "Asante", "Agyeman", "Danso", "Appiah", "Osei",
  "Adjei", "Ofori", "Sarpong", "Antwi", "Baffour", "Nkrumah", "Amoah", "Frimpong",
  "Gyasi", "Yeboah", "Addai", "Kusi",
];

const STATUSES = ["active", "active", "active", "new", "inactive"];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function isoDaysAhead(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

/* ----------------------------- Members ----------------------------- */

export interface MockMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  membershipStatus: string;
  ministry: string;
  gender: string;
  address: string;
  joinedAt: string;
  createdAt: string;
}

function buildMembers(count: number): MockMember[] {
  const members: MockMember[] = [];
  for (let i = 0; i < count; i++) {
    const firstName = pick(FIRST_NAMES, i * 3 + 1);
    const lastName = pick(LAST_NAMES, i * 2 + 3);
    members.push({
      _id: `mem_${i + 1}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@ministryflow.church`,
      phone: `+233 ${20 + (i % 9)} ${String(1000000 + i * 13457).slice(0, 3)} ${String(1000 + i * 7).slice(0, 4)}`,
      membershipStatus: pick(STATUSES, i),
      ministry: pick(MINISTRIES, i),
      gender: i % 2 === 0 ? "male" : "female",
      address: `${100 + i} Independence Ave, Accra`,
      joinedAt: isoDaysAgo((i + 1) * 27),
      createdAt: isoDaysAgo((i + 1) * 27),
    });
  }
  return members;
}

let members = buildMembers(34);

/* --------------------------- Attendance ---------------------------- */

export interface MockAttendance {
  _id: string;
  service: string;
  date: string;
  present: number;
  absent: number;
  firstTimers: number;
  total: number;
}

const SERVICE_NAMES = ["Sunday Service", "Midweek Service", "Prayer Meeting", "Youth Service"];

function buildAttendance(weeks: number): MockAttendance[] {
  const records: MockAttendance[] = [];
  for (let i = 0; i < weeks; i++) {
    const present = 280 + Math.round(Math.sin(i / 2) * 60) + i * 4;
    const absent = 40 + (i % 5) * 6;
    records.push({
      _id: `att_${i + 1}`,
      service: pick(SERVICE_NAMES, i),
      date: isoDaysAgo(i * 7),
      present,
      absent,
      firstTimers: 6 + (i % 7),
      total: present + absent,
    });
  }
  return records;
}

let attendance = buildAttendance(16);

const attendanceTrend = Array.from({ length: 8 }).map((_, i) => {
  const idx = 7 - i;
  return {
    label: new Date(Date.now() - idx * 7 * 86400000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    attendance: 300 + Math.round(Math.cos(idx / 2) * 70) + (8 - idx) * 6,
    firstTimers: 6 + (idx % 7),
  };
});

/* ----------------------------- Events ------------------------------ */

export interface MockEvent {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  startDate: string;
  time: string;
  attendees: number;
}

let events: MockEvent[] = [
  {
    _id: "evt_1",
    title: "Sunday Worship Service",
    description: "Weekly main worship gathering with praise, word, and communion.",
    category: "Service",
    location: "Main Auditorium",
    startDate: isoDaysAhead(2),
    time: "08:00 AM",
    attendees: 420,
  },
  {
    _id: "evt_2",
    title: "Youth Fellowship Night",
    description: "An evening of worship, games, and mentorship for the youth.",
    category: "Youth",
    location: "Youth Hall",
    startDate: isoDaysAhead(5),
    time: "06:00 PM",
    attendees: 96,
  },
  {
    _id: "evt_3",
    title: "Choir Rehearsal",
    description: "Preparation for the upcoming anniversary service.",
    category: "Music",
    location: "Choir Room",
    startDate: isoDaysAhead(6),
    time: "04:00 PM",
    attendees: 38,
  },
  {
    _id: "evt_4",
    title: "Community Outreach",
    description: "Food and clothing drive for the Nima community.",
    category: "Outreach",
    location: "Nima Community Center",
    startDate: isoDaysAhead(9),
    time: "09:00 AM",
    attendees: 64,
  },
  {
    _id: "evt_5",
    title: "Leadership Prayer Retreat",
    description: "Two-day retreat for church leaders and ministry heads.",
    category: "Prayer",
    location: "Aburi Retreat Grounds",
    startDate: isoDaysAhead(14),
    time: "07:00 AM",
    attendees: 45,
  },
  {
    _id: "evt_6",
    title: "Women's Fellowship Brunch",
    description: "Fellowship and teaching session for the women's ministry.",
    category: "Fellowship",
    location: "Fellowship Hall",
    startDate: isoDaysAhead(19),
    time: "10:00 AM",
    attendees: 72,
  },
];

/* ---------------------------- Donations ---------------------------- */

export interface MockDonation {
  _id: string;
  donor: string;
  type: string;
  method: string;
  amount: number;
  date: string;
}

const DONATION_TYPES = ["Tithe", "Offering", "Building Fund", "Missions", "Seed", "Thanksgiving"];
const DONATION_METHODS = ["Cash", "Mobile Money", "Bank Transfer", "Card"];

function buildDonations(count: number): MockDonation[] {
  const list: MockDonation[] = [];
  for (let i = 0; i < count; i++) {
    const member = pick(members, i * 2);
    list.push({
      _id: `don_${i + 1}`,
      donor: `${member.firstName} ${member.lastName}`,
      type: pick(DONATION_TYPES, i),
      method: pick(DONATION_METHODS, i),
      amount: 50 + ((i * 137) % 20) * 45,
      date: isoDaysAgo(i * 2),
    });
  }
  return list;
}

let donations = buildDonations(28);

const donationTrend = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
].map((month, i) => ({
  month,
  amount: 18000 + Math.round(Math.sin(i / 1.7) * 6000) + i * 900,
}));

/* ----------------------------- Finance ----------------------------- */

export interface MockFinance {
  _id: string;
  title: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  date: string;
}

const INCOME_CATEGORIES = ["Tithes", "Offerings", "Donations", "Pledges"];
const EXPENSE_CATEGORIES = ["Utilities", "Salaries", "Maintenance", "Outreach", "Events", "Equipment"];

function buildFinance(count: number): MockFinance[] {
  const list: MockFinance[] = [];
  for (let i = 0; i < count; i++) {
    const isIncome = i % 3 !== 0;
    list.push({
      _id: `fin_${i + 1}`,
      title: isIncome
        ? `${pick(INCOME_CATEGORIES, i)} - Week ${((i % 4) + 1)}`
        : `${pick(EXPENSE_CATEGORIES, i)} payment`,
      type: isIncome ? "income" : "expense",
      category: isIncome ? pick(INCOME_CATEGORIES, i) : pick(EXPENSE_CATEGORIES, i),
      amount: isIncome ? 4000 + (i % 6) * 1200 : 800 + (i % 5) * 700,
      date: isoDaysAgo(i * 3),
    });
  }
  return list;
}

let finance = buildFinance(24);

const financeMonthly = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
].map((month, i) => ({
  month,
  income: 22000 + Math.round(Math.sin(i / 1.5) * 5000) + i * 700,
  expense: 12000 + Math.round(Math.cos(i / 1.9) * 3000) + i * 400,
}));

/* -------------------------- Announcements -------------------------- */

export interface MockAnnouncement {
  _id: string;
  title: string;
  body: string;
  audience: string;
  status: string;
  createdAt: string;
}

let announcements: MockAnnouncement[] = [
  {
    _id: "ann_1",
    title: "Anniversary Thanksgiving Service",
    body: "Join us as we celebrate 25 years of God's faithfulness this coming Sunday. Invite a friend!",
    audience: "All Members",
    status: "published",
    createdAt: isoDaysAgo(1),
  },
  {
    _id: "ann_2",
    title: "New Members Class Starts Monday",
    body: "All first-timers and new members are encouraged to attend the 4-week foundation class.",
    audience: "New Members",
    status: "published",
    createdAt: isoDaysAgo(3),
  },
  {
    _id: "ann_3",
    title: "Choir Auditions",
    body: "The worship department is holding auditions for new choir members after each service.",
    audience: "Worship",
    status: "draft",
    createdAt: isoDaysAgo(6),
  },
  {
    _id: "ann_4",
    title: "Building Fund Update",
    body: "We have reached 68% of our building fund target. Thank you for your generous giving.",
    audience: "All Members",
    status: "published",
    createdAt: isoDaysAgo(10),
  },
];

/* -------------------------- Notifications -------------------------- */

export interface MockNotification {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

let notifications: MockNotification[] = [
  {
    _id: "not_1",
    title: "New member registered",
    message: "Ama Owusu just completed her membership registration.",
    type: "member",
    read: false,
    createdAt: isoDaysAgo(0),
  },
  {
    _id: "not_2",
    title: "Donation received",
    message: "A tithe of GHS 500 was recorded via Mobile Money.",
    type: "donation",
    read: false,
    createdAt: isoDaysAgo(0),
  },
  {
    _id: "not_3",
    title: "Event reminder",
    message: "Youth Fellowship Night is scheduled in 3 days.",
    type: "event",
    read: false,
    createdAt: isoDaysAgo(1),
  },
  {
    _id: "not_4",
    title: "Prayer request submitted",
    message: "A new prayer request needs follow-up from the prayer team.",
    type: "prayer",
    read: true,
    createdAt: isoDaysAgo(2),
  },
  {
    _id: "not_5",
    title: "Attendance recorded",
    message: "Sunday Service attendance was logged: 468 present.",
    type: "attendance",
    read: true,
    createdAt: isoDaysAgo(3),
  },
];

/* ---------------------------- Documents ---------------------------- */

export interface MockDocument {
  _id: string;
  name: string;
  category: string;
  type: string;
  size: string;
  uploadedBy: string;
  createdAt: string;
}

let documents: MockDocument[] = [
  { _id: "doc_1", name: "Church Constitution.pdf", category: "Governance", type: "pdf", size: "2.4 MB", uploadedBy: "Admin", createdAt: isoDaysAgo(40) },
  { _id: "doc_2", name: "2025 Budget.xlsx", category: "Finance", type: "spreadsheet", size: "845 KB", uploadedBy: "Finance Team", createdAt: isoDaysAgo(22) },
  { _id: "doc_3", name: "Baptism Records.pdf", category: "Records", type: "pdf", size: "1.1 MB", uploadedBy: "Pastor", createdAt: isoDaysAgo(15) },
  { _id: "doc_4", name: "Worship Setlist.docx", category: "Worship", type: "document", size: "320 KB", uploadedBy: "Worship Lead", createdAt: isoDaysAgo(5) },
  { _id: "doc_5", name: "Outreach Plan.pdf", category: "Ministry", type: "pdf", size: "980 KB", uploadedBy: "Outreach Head", createdAt: isoDaysAgo(2) },
];

/* ----------------------------- Prayers ----------------------------- */

export interface MockPrayer {
  _id: string;
  name: string;
  request: string;
  category: string;
  status: string;
  createdAt: string;
}

let prayers: MockPrayer[] = [
  { _id: "pr_1", name: "Grace Mensah", request: "Please pray for my mother's healing and quick recovery.", category: "Healing", status: "pending", createdAt: isoDaysAgo(0) },
  { _id: "pr_2", name: "Samuel Osei", request: "Thanksgiving for a new job opportunity.", category: "Thanksgiving", status: "answered", createdAt: isoDaysAgo(2) },
  { _id: "pr_3", name: "Esther Boateng", request: "Guidance concerning an important family decision.", category: "Guidance", status: "pending", createdAt: isoDaysAgo(3) },
  { _id: "pr_4", name: "Anonymous", request: "Prayer for financial breakthrough and provision.", category: "Provision", status: "praying", createdAt: isoDaysAgo(5) },
];

/* ----------------------------- Visitors ---------------------------- */

export interface MockVisitor {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  invitedBy: string;
  visitDate: string;
  followUpStatus: string;
}

let visitors: MockVisitor[] = [
  { _id: "vis_1", firstName: "Linda", lastName: "Ansah", phone: "+233 24 555 1201", invitedBy: "Grace Mensah", visitDate: isoDaysAgo(1), followUpStatus: "pending" },
  { _id: "vis_2", firstName: "Kwabena", lastName: "Darko", phone: "+233 20 555 8890", invitedBy: "Samuel Osei", visitDate: isoDaysAgo(4), followUpStatus: "contacted" },
  { _id: "vis_3", firstName: "Ophelia", lastName: "Quaye", phone: "+233 26 555 3345", invitedBy: "Website", visitDate: isoDaysAgo(8), followUpStatus: "joined" },
  { _id: "vis_4", firstName: "Michael", lastName: "Tetteh", phone: "+233 27 555 7712", invitedBy: "Youth Ministry", visitDate: isoDaysAgo(11), followUpStatus: "pending" },
];

/* ---------------------------- Ministries --------------------------- */

export interface MockMinistry {
  _id: string;
  name: string;
  leader: string;
  members: number;
  description: string;
  meetingDay: string;
}

let ministries: MockMinistry[] = MINISTRIES.map((name, i) => ({
  _id: `min_${i + 1}`,
  name,
  leader: `${pick(FIRST_NAMES, i * 4)} ${pick(LAST_NAMES, i * 3)}`,
  members: 12 + ((i * 17) % 40),
  description: `The ${name} ministry serves the church through dedicated service and outreach.`,
  meetingDay: pick(["Sunday", "Tuesday", "Wednesday", "Friday", "Saturday"], i),
}));

/* ------------------------------ Users ------------------------------ */

const mockUser = {
  _id: "usr_admin",
  firstName: "Nana",
  lastName: "Ammonoh",
  name: "Nana Ammonoh",
  email: "admin@ministryflow.church",
  role: "admin",
};

/* --------------------------- Derived stats ------------------------- */

function money(n: number) {
  return n;
}

function computeDashboard() {
  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.membershipStatus === "active").length;
  const monthlyDonations = donations
    .filter((d) => new Date(d.date).getMonth() === new Date().getMonth())
    .reduce((sum, d) => sum + d.amount, 0);
  const lastService = attendance[0];
  const attendanceRate = lastService
    ? Math.round((lastService.present / lastService.total) * 100)
    : 0;

  return {
    stats: {
      totalMembers,
      activeMembers,
      newMembers: members.filter((m) => m.membershipStatus === "new").length,
      attendanceRate,
      lastAttendance: lastService?.present ?? 0,
      monthlyDonations: money(monthlyDonations),
      upcomingEvents: events.length,
      totalMinistries: ministries.length,
    },
    attendanceTrend,
    donationTrend,
    membershipGrowth: Array.from({ length: 8 }).map((_, i) => ({
      label: new Date(Date.now() - (7 - i) * 30 * 86400000).toLocaleDateString("en-US", { month: "short" }),
      members: 240 + i * 12 + (i % 3) * 5,
    })),
    recentMembers: members.slice(0, 5),
    recentDonations: donations.slice(0, 5),
    upcomingEvents: events.slice(0, 4),
    announcements: announcements.filter((a) => a.status === "published").slice(0, 3),
    activity: [
      { _id: "ac1", type: "member", text: "Ama Owusu registered as a new member", time: isoDaysAgo(0) },
      { _id: "ac2", type: "donation", text: "GHS 500 tithe recorded via Mobile Money", time: isoDaysAgo(0) },
      { _id: "ac3", type: "event", text: "Youth Fellowship Night scheduled", time: isoDaysAgo(1) },
      { _id: "ac4", type: "attendance", text: "Sunday Service attendance logged (468)", time: isoDaysAgo(2) },
      { _id: "ac5", type: "prayer", text: "New prayer request awaiting follow-up", time: isoDaysAgo(2) },
    ],
  };
}

/* ------------------------- Helpers for CRUD ------------------------ */

function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function ok<T>(data: T, message = "OK") {
  return { success: true, message, data };
}

function paginated<T>(items: T[], key: string) {
  return {
    success: true,
    data: { [key]: items },
    pagination: { total: items.length, page: 1, limit: items.length, pages: 1 },
  };
}

export const mockStore = {
  get members() {
    return members;
  },
  get donations() {
    return donations;
  },
};

/* --------------------------- Mock router --------------------------- */

interface MockOptions {
  params?: Record<string, unknown>;
  data?: unknown;
}

export function resolveMock(method: string, rawUrl: string, opts: MockOptions = {}): unknown {
  const url = rawUrl.split("?")[0].replace(/\/$/, "");
  const m = method.toUpperCase();
  const body = (opts.data ?? {}) as Record<string, unknown>;

  // ---- Auth ----
  if (url === "/auth/login" && m === "POST") {
    const email = String(body.email ?? mockUser.email);
    return { data: { accessToken: "mock-access-token", refreshToken: "mock-refresh-token", user: { ...mockUser, email } } };
  }
  if (url === "/auth/register" && m === "POST") {
    const user = { ...mockUser, ...body, role: (body.role as string) ?? "member" };
    return { data: { accessToken: "mock-access-token", refreshToken: "mock-refresh-token", user } };
  }
  if (url === "/auth/me") {
    return { data: { user: mockUser } };
  }

  // ---- Dashboard ----
  if (url === "/dashboard") {
    return ok(computeDashboard());
  }

  // ---- Members ----
  if (url === "/members" && m === "GET") return paginated(members, "members");
  if (url === "/members" && m === "POST") {
    const record = { _id: newId("mem"), membershipStatus: "active", ministry: "", createdAt: new Date().toISOString(), joinedAt: new Date().toISOString(), ...body } as MockMember;
    members = [record, ...members];
    return ok(record, "Member created");
  }
  if (url.startsWith("/members/")) {
    const id = url.split("/")[2];
    if (m === "GET") return ok(members.find((x) => x._id === id) ?? null);
    if (m === "PUT" || m === "PATCH") {
      members = members.map((x) => (x._id === id ? { ...x, ...body } : x));
      return ok(members.find((x) => x._id === id));
    }
    if (m === "DELETE") {
      members = members.filter((x) => x._id !== id);
      return ok({ _id: id }, "Member deleted");
    }
  }

  // ---- Attendance ----
  if (url === "/attendance" && m === "GET") return paginated(attendance, "records");
  if (url === "/attendance/stats") {
    const latest = attendance[0];
    return ok({
      latest: latest?.present ?? 0,
      averageWeekly: Math.round(attendance.reduce((s, a) => s + a.present, 0) / attendance.length),
      firstTimers: attendance.reduce((s, a) => s + a.firstTimers, 0),
      rate: latest ? Math.round((latest.present / latest.total) * 100) : 0,
      trend: attendanceTrend,
    });
  }
  if (url === "/attendance" && m === "POST") {
    const total = Number(body.present ?? 0) + Number(body.absent ?? 0);
    const record = { _id: newId("att"), firstTimers: 0, date: new Date().toISOString(), total, ...body } as MockAttendance;
    attendance = [record, ...attendance];
    return ok(record, "Attendance recorded");
  }
  if (url.startsWith("/attendance/") && (m === "PUT" || m === "PATCH")) {
    const id = url.split("/")[2];
    attendance = attendance.map((x) => (x._id === id ? { ...x, ...body } : x));
    return ok(attendance.find((x) => x._id === id));
  }

  // ---- Events ----
  if (url === "/events" && m === "GET") return paginated(events, "events");
  if (url === "/events" && m === "POST") {
    const record = { _id: newId("evt"), attendees: 0, category: "Service", location: "", time: "", description: "", ...body } as MockEvent;
    events = [record, ...events];
    return ok(record, "Event created");
  }
  if (url.startsWith("/events/")) {
    const id = url.split("/")[2];
    if (m === "GET") return ok(events.find((x) => x._id === id) ?? null);
    if (m === "PUT" || m === "PATCH") {
      events = events.map((x) => (x._id === id ? { ...x, ...body } : x));
      return ok(events.find((x) => x._id === id));
    }
    if (m === "DELETE") {
      events = events.filter((x) => x._id !== id);
      return ok({ _id: id }, "Event deleted");
    }
  }

  // ---- Donations ----
  if (url === "/donations" && m === "GET") return paginated(donations, "donations");
  if (url === "/donations/summary") {
    const total = donations.reduce((s, d) => s + d.amount, 0);
    const thisMonth = donations
      .filter((d) => new Date(d.date).getMonth() === new Date().getMonth())
      .reduce((s, d) => s + d.amount, 0);
    const byType = DONATION_TYPES.map((type) => ({
      type,
      amount: donations.filter((d) => d.type === type).reduce((s, d) => s + d.amount, 0),
    }));
    return ok({ total, thisMonth, count: donations.length, average: Math.round(total / donations.length), byType });
  }
  if (url === "/donations/monthly-trend") return ok({ trend: donationTrend });
  if (url === "/donations" && m === "POST") {
    const record = { _id: newId("don"), method: "Cash", type: "Offering", date: new Date().toISOString(), ...body } as MockDonation;
    donations = [record, ...donations];
    return ok(record, "Donation recorded");
  }
  if (url.startsWith("/donations/")) {
    const id = url.split("/")[2];
    if (m === "PUT" || m === "PATCH") {
      donations = donations.map((x) => (x._id === id ? { ...x, ...body } : x));
      return ok(donations.find((x) => x._id === id));
    }
    if (m === "DELETE") {
      donations = donations.filter((x) => x._id !== id);
      return ok({ _id: id }, "Donation deleted");
    }
  }

  // ---- Finance ----
  if (url === "/finance" && m === "GET") return paginated(finance, "transactions");
  if (url === "/finance/summary") {
    const income = finance.filter((f) => f.type === "income").reduce((s, f) => s + f.amount, 0);
    const expense = finance.filter((f) => f.type === "expense").reduce((s, f) => s + f.amount, 0);
    return ok({ income, expense, balance: income - expense, monthly: financeMonthly });
  }
  if (url === "/finance/monthly") return ok({ monthly: financeMonthly });
  if (url === "/finance" && m === "POST") {
    const record = { _id: newId("fin"), type: "income", category: "Offerings", date: new Date().toISOString(), ...body } as MockFinance;
    finance = [record, ...finance];
    return ok(record, "Transaction recorded");
  }
  if (url.startsWith("/finance/")) {
    const id = url.split("/")[2];
    if (m === "PUT" || m === "PATCH") {
      finance = finance.map((x) => (x._id === id ? { ...x, ...body } : x));
      return ok(finance.find((x) => x._id === id));
    }
    if (m === "DELETE") {
      finance = finance.filter((x) => x._id !== id);
      return ok({ _id: id }, "Transaction deleted");
    }
  }

  // ---- Announcements ----
  if (url === "/announcements" && m === "GET") return paginated(announcements, "announcements");
  if (url === "/announcements" && m === "POST") {
    const record = { _id: newId("ann"), audience: "All Members", status: "draft", createdAt: new Date().toISOString(), ...body } as MockAnnouncement;
    announcements = [record, ...announcements];
    return ok(record, "Announcement created");
  }
  if (url.startsWith("/announcements/")) {
    const id = url.split("/")[2];
    if (m === "PUT" || m === "PATCH") {
      announcements = announcements.map((x) => (x._id === id ? { ...x, ...body } : x));
      return ok(announcements.find((x) => x._id === id));
    }
    if (m === "DELETE") {
      announcements = announcements.filter((x) => x._id !== id);
      return ok({ _id: id }, "Announcement deleted");
    }
  }

  // ---- Notifications ----
  if (url === "/notifications" && m === "GET") return paginated(notifications, "notifications");
  if (url === "/notifications/read-all" && m === "PATCH") {
    notifications = notifications.map((n) => ({ ...n, read: true }));
    return ok(notifications, "All marked as read");
  }
  if (url === "/notifications/clear" && m === "DELETE") {
    notifications = [];
    return ok([], "Cleared");
  }
  if (url === "/notifications/send" && m === "POST") {
    const record = { _id: newId("not"), type: "general", read: false, createdAt: new Date().toISOString(), ...body } as MockNotification;
    notifications = [record, ...notifications];
    return ok(record, "Notification sent");
  }
  if (url.startsWith("/notifications/") && url.endsWith("/read") && m === "PATCH") {
    const id = url.split("/")[2];
    notifications = notifications.map((n) => (n._id === id ? { ...n, read: true } : n));
    return ok(notifications.find((n) => n._id === id));
  }

  // ---- Documents ----
  if (url === "/documents" && m === "GET") return paginated(documents, "documents");
  if (url === "/documents" && m === "POST") {
    const payload = body as Record<string, unknown>;
    const record: MockDocument = {
      _id: newId("doc"),
      name: String(payload.name ?? "Untitled document"),
      category: String(payload.category ?? "General"),
      type: String(payload.type ?? "file"),
      size: String(payload.size ?? "—"),
      uploadedBy: "Admin",
      createdAt: new Date().toISOString(),
    };
    documents = [record, ...documents];
    return ok(record, "Document uploaded");
  }
  if (url.startsWith("/documents/")) {
    const id = url.split("/")[2];
    if (m === "GET") return ok(documents.find((x) => x._id === id) ?? null);
    if (url.endsWith("/archive")) return ok({ _id: id }, "Archived");
    if (m === "PUT" || m === "PATCH") {
      documents = documents.map((x) => (x._id === id ? { ...x, ...body } : x));
      return ok(documents.find((x) => x._id === id));
    }
    if (m === "DELETE") {
      documents = documents.filter((x) => x._id !== id);
      return ok({ _id: id }, "Document deleted");
    }
  }

  // ---- Prayers ----
  if (url === "/prayers" && m === "GET") return paginated(prayers, "prayers");
  if (url === "/prayers" && m === "POST") {
    const record = { _id: newId("pr"), category: "General", status: "pending", createdAt: new Date().toISOString(), name: "Anonymous", ...body } as MockPrayer;
    prayers = [record, ...prayers];
    return ok(record, "Prayer request submitted");
  }
  if (url.startsWith("/prayers/")) {
    const id = url.split("/")[2];
    if (m === "PUT" || m === "PATCH") {
      prayers = prayers.map((x) => (x._id === id ? { ...x, ...body } : x));
      return ok(prayers.find((x) => x._id === id));
    }
    if (m === "DELETE") {
      prayers = prayers.filter((x) => x._id !== id);
      return ok({ _id: id }, "Prayer deleted");
    }
  }

  // ---- Visitors ----
  if (url === "/visitors" && m === "GET") return paginated(visitors, "visitors");
  if (url === "/visitors/stats") {
    return ok({
      total: visitors.length,
      pending: visitors.filter((v) => v.followUpStatus === "pending").length,
      joined: visitors.filter((v) => v.followUpStatus === "joined").length,
      thisMonth: visitors.length,
    });
  }
  if (url === "/visitors" && m === "POST") {
    const record = { _id: newId("vis"), invitedBy: "—", visitDate: new Date().toISOString(), followUpStatus: "pending", ...body } as MockVisitor;
    visitors = [record, ...visitors];
    return ok(record, "Visitor added");
  }
  if (url.startsWith("/visitors/")) {
    const id = url.split("/")[2];
    if (url.endsWith("/follow-up") && m === "PATCH") {
      visitors = visitors.map((x) => (x._id === id ? { ...x, ...body } : x));
      return ok(visitors.find((x) => x._id === id));
    }
    if (m === "DELETE") {
      visitors = visitors.filter((x) => x._id !== id);
      return ok({ _id: id }, "Visitor deleted");
    }
  }

  // ---- Ministries ----
  if (url === "/ministries" && m === "GET") return paginated(ministries, "ministries");
  if (url === "/ministries" && m === "POST") {
    const record = { _id: newId("min"), leader: "—", members: 0, description: "", meetingDay: "Sunday", ...body } as MockMinistry;
    ministries = [record, ...ministries];
    return ok(record, "Ministry created");
  }
  if (url.startsWith("/ministries/")) {
    const id = url.split("/")[2];
    if (m === "PUT" || m === "PATCH") {
      ministries = ministries.map((x) => (x._id === id ? { ...x, ...body } : x));
      return ok(ministries.find((x) => x._id === id));
    }
    if (m === "DELETE") {
      ministries = ministries.filter((x) => x._id !== id);
      return ok({ _id: id }, "Ministry deleted");
    }
  }

  // ---- Reports ----
  if (url === "/reports" || url.startsWith("/reports/")) {
    return ok({
      members: members.length,
      attendanceAverage: Math.round(attendance.reduce((s, a) => s + a.present, 0) / attendance.length),
      donationsTotal: donations.reduce((s, d) => s + d.amount, 0),
      events: events.length,
      attendanceTrend,
      donationTrend,
      financeMonthly,
    });
  }

  // ---- Fallback ----
  return ok(null, "No mock handler");
}
