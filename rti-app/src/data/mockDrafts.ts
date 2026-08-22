// Mock RTI Drafts — realistic AI-generated RTI requests
// Decision D-007: Hardcoded realistic mocks (no live API)
// These mimic what an LLM would produce — specific statutory references, named documents, exact dates

export interface RTIDraft {
  subject: string;
  body: string;
  stateId: string;
}

// Keyword → mock draft mapping
const DRAFT_TEMPLATES: Array<{
  keywords: string[];
  draft: Omit<RTIDraft, "stateId">;
}> = [
  {
    keywords: ["ration", "ration card", "pds", "food"],
    draft: {
      subject: "Request for Information Under RTI Act 2005 — Status of Ration Card Application",
      body: `To,
The Public Information Officer,
Food and Civil Supplies Department

Sub: Application under Section 6 of the Right to Information Act, 2005

Sir/Madam,

I, the undersigned, hereby request the following information under Section 6(1) of the Right to Information Act, 2005:

1. The current status of my ration card application submitted to your office, including whether it has been approved, rejected, or is pending.
2. The date on which my application was received and registered, along with the registration/acknowledgement number assigned.
3. The reasons, if any, for delay or rejection, citing the specific rule or provision under which action was taken.
4. The name and designation of the officer currently responsible for processing my application.
5. A certified copy of any notings, correspondence, or internal communications related to my application file.

The information is sought under Section 6(1) of the RTI Act, 2005. A fee of ₹10 is enclosed/deposited herewith.

I request that the information be provided within the statutory period of 30 days as mandated under Section 7(1) of the RTI Act.

Thanking you,
[Your Name]
[Your Address]
[Your Mobile Number]
[Date]`,
    },
  },
  {
    keywords: ["road", "pothole", "street", "footpath", "drainage"],
    draft: {
      subject: "Request for Information Under RTI Act 2005 — Road Repair / Infrastructure Works",
      body: `To,
The Public Information Officer,
Municipal Corporation / Public Works Department

Sub: Application under Section 6 of the Right to Information Act, 2005

Sir/Madam,

I request the following information under Section 6(1) of the RTI Act, 2005:

1. The sanctioned budget and actual expenditure for road repair/maintenance works in [your area/ward] for the financial year 2023-24 and 2024-25.
2. The tender documents, work orders, and contractor details for any road repair work contracted in the above locality in the past 24 months.
3. The dates of inspection, completion certificates, and quality test reports for the said road works.
4. Any complaints received regarding the condition of the road at [location] and the action taken thereon, including file notings.
5. The name and designation of the officer responsible for approving and supervising the above-mentioned works.

Please provide certified copies of all documents as specified above.

A fee of ₹10 is enclosed herewith.

Yours faithfully,
[Your Name]
[Your Address]
[Date]`,
    },
  },
  {
    keywords: ["pension", "old age", "disability", "widow"],
    draft: {
      subject: "Request for Information Under RTI Act 2005 — Social Security Pension Application Status",
      body: `To,
The Public Information Officer,
Social Welfare / District Collector's Office

Sub: Application under Section 6 of the Right to Information Act, 2005

Sir/Madam,

I request the following information under Section 6(1) of the RTI Act, 2005:

1. The current status of my social security pension application, including whether it has been approved, rejected, forwarded, or is pending at which level.
2. The date of receipt of my application, registration number, and the officer to whom it was assigned.
3. The eligibility criteria applied, and whether my application meets or fails those criteria — with documentary basis.
4. If rejected or pending: the specific reasons, citing the exact rule/circular/government order under which action was taken.
5. The name, designation, and office address of the current dealing official.
6. Certified copies of any file notings, orders, or communications regarding my application.

A fee of ₹10 is enclosed.

Yours sincerely,
[Your Name]
[Your Address]
[Date]`,
    },
  },
  {
    keywords: ["school", "education", "scholarship", "college", "university"],
    draft: {
      subject: "Request for Information Under RTI Act 2005 — Educational Institution / Scholarship",
      body: `To,
The Public Information Officer,
Department of Education / Concerned Institution

Sub: Application under Section 6 of the Right to Information Act, 2005

Sir/Madam,

I request the following information under Section 6(1) of the RTI Act, 2005:

1. The current status of my scholarship/admission application, including the date of receipt and processing stage.
2. The selection criteria, merit list, and allocation procedure applied for the relevant academic year.
3. The number of seats available and number of applications received for the category under which I applied.
4. Reasons for non-selection or delay, with reference to the relevant rules or government orders.
5. The name and designation of the officer responsible for the selection/scholarship process.
6. Certified copies of any communications or file notings relating to my application.

Fee of ₹10 enclosed.

Yours faithfully,
[Your Name]
[Your Address]
[Date]`,
    },
  },
  {
    keywords: ["land", "property", "registration", "mutation", "patawari", "revenue"],
    draft: {
      subject: "Request for Information Under RTI Act 2005 — Land Records / Property Mutation",
      body: `To,
The Public Information Officer,
Revenue Department / Sub-Registrar Office

Sub: Application under Section 6 of the Right to Information Act, 2005

Sir/Madam,

I request the following information under Section 6(1) of the RTI Act, 2005:

1. Certified copy of the land record (khata/khatauni/7-12 extract) for Survey No. [your survey number], Village [your village], Tehsil [your tehsil].
2. The current owner(s) of record and history of mutations (name changes) for the above land parcel over the past 10 years.
3. Whether any lien, charge, encumbrance, government acquisition notice, or court order is registered against the above parcel.
4. Status of mutation application submitted by me, including file number, date of receipt, and current stage.
5. Reasons for any delay, with the relevant rule under which the mutation is being processed.

Fee of ₹10 enclosed. Certified copies requested for all documents.

Yours sincerely,
[Your Name]
[Your Address]
[Date]`,
    },
  },
];

// Default / generic draft for unrecognized problem types
const DEFAULT_DRAFT: Omit<RTIDraft, "stateId"> = {
  subject: "Request for Information Under RTI Act 2005",
  body: `To,
The Public Information Officer,
[Concerned Department / Ministry]

Sub: Application under Section 6 of the Right to Information Act, 2005

Sir/Madam,

I request the following information under Section 6(1) of the RTI Act, 2005:

1. Please provide complete details, records, and file notings related to [the specific matter described below].
2. The names and designations of all officers who have dealt with or made decisions on this matter.
3. Certified copies of all relevant orders, communications, and documents pertaining to the above.
4. The current status of the matter and the expected timeline for resolution.

Description of the matter:
[The issue described in plain language will appear here, along with specific dates and reference numbers.]

A fee of ₹10 is enclosed/deposited herewith.

I request the information be provided within 30 days as per Section 7(1) of the RTI Act, 2005.

Yours sincerely,
[Your Name]
[Your Address]
[Mobile Number]
[Date]`,
};

export function generateMockDraft(problem: string, stateId: string, isBpl: boolean = false): RTIDraft {
  const p = problem.toLowerCase();
  
  let draft = DRAFT_TEMPLATES.find((t) =>
    t.keywords.some((k) => p.includes(k))
  )?.draft;

  if (!draft) {
    draft = DEFAULT_DRAFT;
  }
  
  let body = draft!.body;
  if (isBpl) {
    body += `\n\nNote: I belong to the BPL category (BPL Card details attached). I request you to exempt the application fee as per section 7(5) of the Right to Information Act, 2005.`;
  } else {
    body += `\n\nI have affixed/attached the required RTI fee of Rs 10/- via Postal Order / Online Payment.`;
  }

  return {
    subject: draft!.subject,
    body: body,
    stateId,
  };
}

export function translateDraft(draft: RTIDraft, lang: string): RTIDraft {
  if (lang === "en") return draft;
  
  if (lang === "hi") {
    return {
      ...draft,
      subject: "सूचना का अधिकार अधिनियम 2005 के तहत सूचना के लिए अनुरोध",
      body: "प्रति,\nजन सूचना अधिकारी,\n\nविषय: सूचना का अधिकार अधिनियम, 2005 की धारा 6 के तहत आवेदन\n\nमहोदय,\n" + 
            "कृपया मुझे निम्नलिखित जानकारी प्रदान करें:\n" + 
            "(The rest of the draft is dynamically translated to Hindi...)\n\n" +
            "धन्यवाद,\nनागरिक",
    };
  }
  
  return draft;
}
