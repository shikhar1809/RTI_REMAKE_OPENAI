// Mock RTI Applications for the tracking dashboard
// Simulates what saved applications look like after filing

export type RTIStatus = "pending" | "replied" | "appealed" | "resolved";

export interface RTIApplication {
  id: string;
  subject: string;
  authority: string;
  stateId: string;
  filedDate: string; // ISO date string
  deadlineDate: string; // 30 days from filedDate
  status: RTIStatus;
  problemSummary: string;
  hasReply?: boolean;
  replyScore?: number; // 0-100
  replyText?: string;
}

export const MOCK_APPLICATIONS: RTIApplication[] = [
  {
    id: "rti-001",
    subject: "Status of Ration Card Application — 6 months pending",
    authority: "Food and Civil Supplies Department, UP",
    stateId: "up",
    filedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    deadlineDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    status: "pending",
    problemSummary:
      "Applied for ration card 6 months ago. No status update received. Office staff not cooperating.",
  },
  {
    id: "rti-002",
    subject: "Road Repair Work — Budget & Contractor Details",
    authority: "Municipal Corporation, Kerala",
    stateId: "kerala",
    filedDate: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(), // 32 days ago
    deadlineDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days overdue
    status: "replied",
    problemSummary: "Pothole on main street unrepaired for 8 months despite multiple complaints.",
    hasReply: true,
    replyScore: 35,
    replyText: `Reference: MC/RTI/2025/4821
Date: [Two weeks ago]

Dear Applicant,

Your RTI application dated [filing date] has been received and noted.

In response to your queries:

The Municipal Corporation undertakes road maintenance works as per the annual maintenance calendar. Works are scheduled based on priority and availability of funds.

For further details, you may visit our office during working hours (10 AM to 5 PM, Monday to Friday).

Yours faithfully,
Assistant Engineer,
Municipal Corporation`,
  },
  {
    id: "rti-003",
    subject: "Old Age Pension Application — Status Inquiry",
    authority: "Social Welfare Department, Rajasthan",
    stateId: "rajasthan",
    filedDate: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
    deadlineDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    status: "appealed",
    problemSummary:
      "Mother applied for old age pension 2 years ago. Multiple visits to office with no result.",
    hasReply: true,
    replyScore: 20,
  },
  {
    id: "rti-004",
    subject: "Land Mutation Status — Survey No. 234",
    authority: "Revenue Department, Himachal Pradesh",
    stateId: "hp",
    filedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    deadlineDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    status: "resolved",
    problemSummary: "Land mutation pending for 18 months after purchase.",
    hasReply: true,
    replyScore: 85,
  },
];

export function getApplicationById(id: string): RTIApplication | undefined {
  return MOCK_APPLICATIONS.find((app) => app.id === id);
}

export function getDaysRemaining(deadlineDate: string): number {
  const deadline = new Date(deadlineDate);
  const now = new Date();
  const diff = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}
