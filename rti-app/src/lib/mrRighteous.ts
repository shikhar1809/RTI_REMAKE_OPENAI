/**
 * MR RIGHTEOUS - Conversational AI Brain
 * Stateful mock AI engine with context memory for the RTI toolkit.
 * Maintains a conversation history and generates contextually aware replies.
 */

export interface ConversationTurn {
  role: 'user' | 'ai';
  content: string;
}

// ─── RTI Knowledge Base ───────────────────────────────────────────────────────
const RTI_KB: { patterns: RegExp[]; response: (ctx: ConversationContext) => string }[] = [
  {
    patterns: [/deadline|30.?day|48.?hour|time.?limit|how long|when.*reply/i],
    response: () =>
      `Under the RTI Act 2005, the Public Information Officer (PIO) must reply within **30 days** of receiving your application. For matters concerning **life or liberty** (e.g., medical emergency, police custody), the deadline is just **48 hours**.\n\nIf they miss the deadline, silence is treated as a refusal — you can immediately file a First Appeal. Want me to help you draft one?`,
  },
  {
    patterns: [/first.?appeal|second.?appeal|appeal.*process|how.*appeal|cic|sic|information.?commission/i],
    response: () =>
      `Here's how the RTI appeals ladder works:\n\n**1st Appeal (within 30 days of PIO's deadline)**\n→ Filed to the First Appellate Authority (FAA) in the same department. They must decide within 30 days (extendable to 45 days).\n\n**2nd Appeal (within 90 days of FAA order)**\n→ Escalated to the Central Information Commission (CIC) for Central Govt RTIs, or the State Information Commission (SIC) for state RTIs. This is the final authority.\n\nShall I draft an appeal notice for you based on your current application?`,
  },
  {
    patterns: [/bpl|below.?poverty|poor|free.*fee|fee.*waiv|exempt/i],
    response: () =>
      `Yes — **BPL (Below Poverty Line) cardholders** are completely exempt from:\n- The ₹10 RTI application fee\n- All document copying charges\n- Postal charges\n\nYou just need a valid BPL certificate. Our DigiLocker integration automatically fetches and verifies it when you file — no manual submission needed. Are you filing an RTI right now?`,
  },
  {
    patterns: [/online|portal|website|rtionline|how.*file|where.*file|submit/i],
    response: () =>
      `You can file RTIs online at:\n\n**Central Government:** [rtionline.gov.in](https://rtionline.gov.in)\n**Maharashtra:** [mahaonline.gov.in/RTI](https://mahaonline.gov.in)\n**Karnataka, UP, Kerala:** have dedicated state portals.\n\nOr better — use **this app**. Just tap "File a New RTI" and our AI wizard guides you through every step, auto-selects the right authority, and even drafts the legal text for you.\n\nDo you want to start filing right now?`,
  },
  {
    patterns: [/no.?reply|didn.*reply|silence|no.*response|missed.*deadline|overdue/i],
    response: () =>
      `If the PIO hasn't replied within **30 days**, here's exactly what to do:\n\n1. **File a First Appeal immediately** — silence is deemed refusal under Section 7(2) of the RTI Act.\n2. Cite "Non-receipt of information within the statutory period" as your ground.\n3. Attach your original application copy and proof of submission.\n\nIf even the First Appellate Authority fails you, go to the **CIC/SIC** for a Second Appeal.\n\nWant me to draft a First Appeal notice for your specific case?`,
  },
  {
    patterns: [/which.?authority|which.?department|which.?ministry|who.*contact|where.*send|right.*department/i],
    response: () =>
      `Finding the right authority is critical. Here's the rule:\n\n- **Central Govt matters** (passports, income tax, railways, EPFO) → file with the respective Central Ministry's PIO\n- **State Govt matters** (ration card, land records, police, local body) → file with the State Department's PIO\n- **Local bodies** (municipality, panchayat) → file with the local body's designated PIO\n\nIf you're unsure, just describe your issue to me and I'll identify the exact department and officer for you. What's your problem about?`,
  },
  {
    patterns: [/fee|cost|charge|₹10|rupee|payment|how much/i],
    response: () =>
      `The RTI fee structure:\n\n- **Central Government:** ₹10 per application (IPO/DD/online payment)\n- **State Governments:** Varies — most charge ₹10, some charge ₹20 (Maharashtra online)\n- **BPL citizens:** Completely **FREE** — all fees waived with valid BPL certificate\n- **Document copies:** ₹2 per A4 page (Central Govt)\n- **Inspection of records:** Free for 1st hour, ₹5 per subsequent hour\n\nDo you want to know if you qualify for the BPL fee exemption?`,
  },
  {
    patterns: [/draft|write.*application|help.*write|create.*rti|generate|compose/i],
    response: (ctx) => {
      const topic = ctx.userTopics.join(', ') || 'your issue';
      return `I can draft a professional RTI application for you right now. Based on our conversation about **${topic}**, here's a template:\n\n---\n**To:** The Public Information Officer\n[Department Name], [State/Central]\n\n**Subject:** Application under RTI Act 2005 — Information Regarding ${topic.charAt(0).toUpperCase() + topic.slice(1)}\n\nI, [Your Name], wish to obtain information under Section 6(1) of the RTI Act 2005 regarding: ${topic}.\n\nPlease provide:\n1. Complete details and status of the matter\n2. Copies of relevant records/orders\n3. Name and designation of the responsible officer\n\nI am enclosing ₹10 as the prescribed fee.\n\n[Your Signature]\n---\n\nShall I tailor this further? Just tell me more details about your case.`;
    },
  },
  {
    patterns: [/rejection|refused|rejected|denied|section 8|exempt.*information/i],
    response: () =>
      `If your RTI was rejected, the PIO must cite specific exemptions under **Section 8** or **Section 9** of the RTI Act. Common grounds:\n\n- **8(1)(a):** National security/sovereignty\n- **8(1)(e):** Fiduciary relationship\n- **8(1)(j):** Personal information with no public interest\n\n**What you can do:**\n1. If the rejection cites no valid legal ground — file a First Appeal. The burden of proof is on the PIO.\n2. If the exemption is bogus — file a Second Appeal to CIC/SIC and request penalty against the PIO.\n\nWould you like help challenging a specific rejection?`,
  },
  {
    patterns: [/penalty|fine|punish|officer.*liable|action.*pio/i],
    response: () =>
      `The Information Commission can impose a **penalty of ₹250 per day** (up to ₹25,000) on a PIO for:\n- Not responding within the deadline\n- Giving false or misleading information\n- Obstructing the information flow\n\nThe PIO can also face **disciplinary action** under their service rules. This is one of the strongest teeth of the RTI Act.\n\nDo you want to include a penalty clause in your appeal?`,
  },
  {
    patterns: [/hello|hi|hey|good\s+morning|good\s+evening|namaste|helo/i],
    response: () =>
      `Namaste! I'm **MR RIGHTEOUS**, your personal RTI legal assistant. 🙏\n\nI can help you:\n- Understand your RTI rights\n- Draft RTI applications and appeals\n- Find the right government authority\n- Track your deadlines\n- Fight unjust rejections\n\nWhat's your RTI question today?`,
  },
  {
    patterns: [/thank|thanks|great|awesome|perfect|excellent|helpful/i],
    response: () =>
      `You're welcome! Remember — **information is power**, and RTI is your legal weapon to wield it. 💪\n\nIs there anything else I can help you with — a draft, appeal guidance, or authority lookup?`,
  },
  {
    patterns: [/what.*rti|explain.*rti|what is right to information|about rti/i],
    response: () =>
      `The **Right to Information (RTI) Act, 2005** is a landmark Indian law that gives every citizen the legal right to request information from any government authority.\n\n**Key facts:**\n- Filed under Section 6(1) of the Act\n- Government must respond within **30 days**\n- Fee: Just ₹10 (free for BPL citizens)\n- Covers all Central & State government bodies\n- Excludes only specific exemptions under Section 8\n\nIt's one of the most powerful tools for government accountability. What would you like to know more about?`,
  },
];

// ─── Conversational Context ───────────────────────────────────────────────────
interface ConversationContext {
  history: ConversationTurn[];
  userTopics: string[];
  turnCount: number;
}

// ─── Topic Extractor ──────────────────────────────────────────────────────────
function extractTopics(text: string): string[] {
  const topics: string[] = [];
  if (/pension|retirement/i.test(text)) topics.push('pension status');
  if (/ration|food|pds/i.test(text)) topics.push('ration card');
  if (/road|pothole|infrastructure/i.test(text)) topics.push('infrastructure repair');
  if (/land|property|mutation|survey/i.test(text)) topics.push('land records');
  if (/school|education|college/i.test(text)) topics.push('education department');
  if (/water|sewage|drainage/i.test(text)) topics.push('water supply');
  if (/hospital|health|medical/i.test(text)) topics.push('health department');
  if (/police|fir|crime/i.test(text)) topics.push('police records');
  if (/salary|payment|contractor/i.test(text)) topics.push('payment records');
  if (/corruption|misuse|fraud/i.test(text)) topics.push('corruption investigation');
  return topics;
}

// ─── Follow-up Contextual Responses ──────────────────────────────────────────
function getFollowUpResponse(ctx: ConversationContext, userMessage: string): string {
  const lastAIMsg = [...ctx.history].reverse().find(h => h.role === 'ai')?.content || '';
  const lastUserMsg = [...ctx.history].reverse().find(h => h.role === 'user')?.content || '';

  // If they replied "yes" or "sure" to draft offer
  if (/^(yes|sure|ok|please|yeah|yep|go ahead|do it)/i.test(userMessage.trim())) {
    if (/draft|appeal|application/i.test(lastAIMsg)) {
      return `Great! Let me tailor it for you. To write the most accurate application, could you tell me:\n\n1. **What department** is this for? (e.g., Municipal Corporation, EPFO, Railways)\n2. **Which state** are you in?\n3. **What specific information** are you requesting?\n\nThe more details you share, the stronger your RTI will be.`;
    }
    if (/file.*now|start.*filing/i.test(lastAIMsg)) {
      return `Excellent! Head to the **"File a New RTI"** section from the home screen. Our 9-step wizard will take you through everything — personal details, authority selection, AI-drafted text, and payment. It takes about 5 minutes. Want me to explain any step?`;
    }
  }

  // If they replied "no" 
  if (/^(no|nope|not now|later|maybe later)/i.test(userMessage.trim())) {
    return `No problem at all! I'm here whenever you need me. You can always ask me about RTI deadlines, how to appeal, which authority to approach, or get a draft ready.\n\nIs there anything else on your mind?`;
  }

  // Follow up based on conversation context - if we know the topic
  if (ctx.userTopics.length > 0 && ctx.turnCount > 2) {
    const topic = ctx.userTopics[ctx.userTopics.length - 1];
    const followUps = [
      `Based on your interest in **${topic}**, I'd recommend filing this under the relevant State/Central department. The 30-day deadline starts from the day they receive your application. Should I identify the exact PIO for ${topic}?`,
      `For a matter concerning **${topic}**, you'll want to be very specific in your RTI — list the exact records you need (file numbers, order dates, officer names). Vague RTIs can be rejected under Section 8(1)(j). Want me to draft a precise query?`,
      `If this is about **${topic}**, I'd suggest also requesting information about who the responsible officer is and their official actions taken — this often leads to faster resolution as the officer becomes personally accountable. Shall I incorporate that into a draft?`,
    ];
    return followUps[ctx.turnCount % followUps.length];
  }

  // Generic contextual follow-ups based on conversation length
  const genericFollowUps = [
    `That's a great question. Based on our conversation so far, I'd also suggest checking if this falls under the jurisdiction of a Central or State authority — it makes a big difference in where you file. What department does this involve?`,
    `I can help you take this further. Would you like me to draft a complete RTI application based on what we've discussed? I can also estimate your chances of getting a timely response based on the type of information you're seeking.`,
    `Good point. One more thing worth knowing — if you feel the PIO is stalling, you can also file a **complaint** (not just an appeal) directly to the Information Commission under Section 18. This is often faster for clear violations. Want to explore this route?`,
    `Exactly. And remember — RTI applies not just to government ministries but also to **private bodies that receive substantial government funding** (like grant-aided schools, NGOs with government contracts). Could this be relevant to your case?`,
  ];

  return genericFollowUps[ctx.turnCount % genericFollowUps.length];
}

// ─── Main AI Response Generator ───────────────────────────────────────────────
export function generateMRRighteousResponse(
  userMessage: string,
  history: ConversationTurn[]
): string {
  const ctx: ConversationContext = {
    history,
    userTopics: history
      .filter(h => h.role === 'user')
      .flatMap(h => extractTopics(h.content)),
    turnCount: history.length,
  };

  // Also extract from current message
  const currentTopics = extractTopics(userMessage);
  ctx.userTopics = [...ctx.userTopics, ...currentTopics];

  // 1. Try to match against knowledge base
  for (const entry of RTI_KB) {
    if (entry.patterns.some(p => p.test(userMessage))) {
      return entry.response(ctx);
    }
  }

  // 2. Try follow-up contextual response
  if (history.length > 0) {
    return getFollowUpResponse(ctx, userMessage);
  }

  // 3. Fallback
  return `I'm cross-referencing the RTI Act 2005 and DoPT guidelines for your query...\n\nBased on established legal precedent, your question touches on the right to government information. Could you tell me more specifically:\n- Which government department or authority is involved?\n- What type of information are you seeking?\n- Has there been any previous communication or application?\n\nWith those details, I can give you a precise legal path forward.`;
}
