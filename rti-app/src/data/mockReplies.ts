// Mock Reply Quality Analyzer
// Decision D-007: Mocked AI scoring logic

export interface ReplyAnalysis {
  score: number; // 0–100
  verdict: "strong" | "weak";
  issues: string[];
  appealSubject: string;
  appealBody: string;
}

// Patterns that signal a weak/evasive reply
const WEAK_SIGNALS = [
  { pattern: /visit.*office|contact.*office/i, issue: "Deflects to in-person visit instead of providing information" },
  { pattern: /not available|information not available/i, issue: "Claims information is 'not available' without citing a legal exemption" },
  { pattern: /under examination|under process|being processed/i, issue: "Vague 'under process' reply without timeline or status details" },
  { pattern: /third party|third-party/i, issue: "Incorrectly invokes third-party exemption without citing Section 8(1)(j)" },
  { pattern: /confidential|secret/i, issue: "Uses 'confidential' label without citing the specific Section 8 exemption" },
  { pattern: /no such records|no records/i, issue: "Claims no records exist without confirming a proper records search was conducted" },
  { pattern: /not within.*jurisdiction|not.*our department/i, issue: "Transfers without forwarding — violates Section 6(3) duty to transfer" },
];

// Patterns that signal a substantive reply
const STRONG_SIGNALS = [
  /enclosed.*certified copy|certified copy.*enclosed/i,
  /document.*attached|attached.*document/i,
  /file number|reference number|registration number/i,
  /section \d+|under.*act/i,
  /approved|sanctioned|rejected.*reason/i,
];

export function analyzeReply(replyText: string, originalSubject?: string): ReplyAnalysis {
  const issues: string[] = [];
  let score = 70; // start with neutral-good

  // Check for weak signals
  for (const { pattern, issue } of WEAK_SIGNALS) {
    if (pattern.test(replyText)) {
      issues.push(issue);
      score -= 20;
    }
  }

  // Check for strong signals (add back)
  let strongCount = 0;
  for (const pattern of STRONG_SIGNALS) {
    if (pattern.test(replyText)) strongCount++;
  }
  score += strongCount * 8;

  // Length check — very short replies are usually weak
  if (replyText.trim().split(/\s+/).length < 50) {
    issues.push("Reply is too brief to have meaningfully addressed the RTI request");
    score -= 15;
  }

  // Clamp score
  score = Math.max(5, Math.min(100, score));

  const verdict: "strong" | "weak" = score >= 60 ? "strong" : "weak";

  const issuesList = issues.length > 0 ? issues : [];

  const appealSubject = `First Appeal under Section 19(1) of the RTI Act, 2005 — ${originalSubject ?? "RTI Application"}`;

  const appealBody = generateAppealBody(replyText, issues, score, originalSubject);

  return { score, verdict, issues: issuesList, appealSubject, appealBody };
}

function generateAppealBody(
  replyText: string,
  issues: string[],
  score: number,
  originalSubject?: string
): string {
  const issuesText =
    issues.length > 0
      ? issues.map((i, idx) => `${idx + 1}. ${i}`).join("\n")
      : "1. The reply does not specifically address the information sought in the original RTI application.";

  return `To,
The First Appellate Authority,
[Name of the Department]
[Address]

Sub: First Appeal under Section 19(1) of the Right to Information Act, 2005
Ref: RTI Application — ${originalSubject ?? "As filed"}

Sir/Madam,

I, the undersigned, am filing this First Appeal under Section 19(1) of the Right to Information Act, 2005 against the reply received from the Public Information Officer (PIO) of your department.

GROUNDS FOR APPEAL:

The reply received from the PIO is deficient and does not satisfy the requirement of Section 7 of the RTI Act for the following reasons:

${issuesText}

The RTI Act, 2005 obliges the PIO to provide complete, specific, and accurate information within 30 days. A vague or partial reply is treated as a deemed refusal under Section 7(2) and is appealable under Section 19(1).

RELIEF SOUGHT:

1. Direct the PIO to provide complete and specific answers to each of the original queries raised.
2. Provide certified copies of all relevant documents as requested.
3. Impose penalty on the PIO under Section 20(1) of the RTI Act for providing an inadequate reply.

I request that this appeal be disposed of within 30 days as mandated by Section 19(6) of the RTI Act.

Yours sincerely,
[Your Name]
[Your Address]
[Mobile Number]
[Date]

Enclosures:
1. Copy of original RTI application
2. Copy of PIO's reply
3. Any other supporting documents`;
}
