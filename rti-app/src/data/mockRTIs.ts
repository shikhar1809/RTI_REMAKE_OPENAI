// Mock RTI Applications for the tracking dashboard
// Simulates what saved applications look like after filing

export type RTIStatus = "pending" | "replied" | "appealed" | "second_appeal" | "resolved";

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
  isPublic?: boolean;
}

export const MOCK_PUBLIC_RTIS: RTIApplication[] = [
  {
    id: "pub-001",
    subject: "Details of Expenditure on City Beautification (G20 Summit)",
    authority: "Municipal Corporation, Delhi",
    stateId: "delhi",
    filedDate: "2024-11-10T10:00:00Z",
    deadlineDate: "2024-12-10T10:00:00Z",
    status: "resolved",
    problemSummary: "Seeking breakdown of funds spent on painting walls and installing statues during the summit.",
    hasReply: true,
    isPublic: true,
  },
  {
    id: "pub-002",
    subject: "Environmental Clearance for Coastal Road Project",
    authority: "Ministry of Environment, Forest and Climate Change, Maharashtra",
    stateId: "maharashtra",
    filedDate: "2025-01-05T09:30:00Z",
    deadlineDate: "2025-02-05T09:30:00Z",
    status: "pending",
    problemSummary: "Seeking copy of the latest environmental clearance report and public consultation minutes.",
    isPublic: true,
  },
  {
    id: "pub-003",
    subject: "Pothole Repair Contracts - Ward 15",
    authority: "Bruhat Bengaluru Mahanagara Palike (BBMP), Karnataka",
    stateId: "karnataka",
    filedDate: "2025-02-15T14:20:00Z",
    deadlineDate: "2025-03-15T14:20:00Z",
    status: "replied",
    problemSummary: "Requesting copies of work orders and contractor names for road repair in Ward 15.",
    hasReply: true,
    isPublic: true,
  },
  {
    id: "pub-004",
    subject: "Water Supply Contamination Reports",
    authority: "Water Supply and Sewerage Board, Punjab",
    stateId: "punjab",
    filedDate: "2025-03-01T11:00:00Z",
    deadlineDate: "2025-03-31T11:00:00Z",
    status: "pending",
    problemSummary: "Seeking lab testing results for water samples collected from Sector 42 over the last 3 months.",
    isPublic: true,
  }
];

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
