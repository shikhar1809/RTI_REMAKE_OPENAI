/**
 * MR RIGHTEOUS — Full RTI Knowledge Engine
 * Comprehensive mock data pool for all RTI queries with conversational memory.
 */

export interface ConversationTurn {
  role: 'user' | 'ai';
  content: string;
}

interface ConversationContext {
  history: ConversationTurn[];
  userTopics: string[];
  turnCount: number;
  lastAIMessage: string;
  lastUserMessage: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// KNOWLEDGE BASE — each entry has multiple trigger patterns + a rich response
// ─────────────────────────────────────────────────────────────────────────────
const KB: { patterns: RegExp[]; response: (ctx: ConversationContext) => string }[] = [

  // ── GREETINGS ────────────────────────────────────────────────────────────
  {
    patterns: [/^(hello|hi|hey|namaste|helo|good\s*morning|good\s*evening|good\s*afternoon|greetings|howdy|sup)\b/i],
    response: () =>
      `Namaste! 🙏 I'm **MR RIGHTEOUS**, your personal RTI Legal Assistant.\n\nI'm powered by a comprehensive database of RTI Act 2005 rules, DoPT guidelines, state-specific laws, and real precedents from the Central Information Commission.\n\nHere's what I can help you with:\n\n📋 **Draft** a complete RTI application in seconds\n⚖️ **Explain** your rights under the RTI Act\n🗂️ **Find** the right government authority to file with\n📅 **Track** your 30-day response deadline\n🚨 **File Appeals** if you're ignored or refused\n\nWhat's on your mind today?`,
  },

  // ── FAQ CHIP 1: RTI DEADLINE ──────────────────────────────────────────────
  {
    patterns: [/deadline|30.?day|time.?limit|how long|when.*reply|response.*time|48.?hour/i],
    response: () =>
      `⏱️ **RTI Response Deadlines under Section 7:**\n\n| Situation | Deadline |\n|---|---|\n| Normal application | **30 days** |\n| Life or liberty matter | **48 hours** |\n| Info from 3rd party | **40 days** |\n| BPL applicant | **30 days** (priority) |\n| Info held by another dept | **35 days** |\n\n**What triggers the clock?** The day the PIO receives your application — NOT the day you sent it.\n\n**What if they miss it?**\n→ Silence is deemed **refusal** under Section 7(2)\n→ You can immediately file a **First Appeal**\n→ The PIO is personally liable for a penalty of ₹250/day (up to ₹25,000)\n\n💡 Pro tip: Always send your RTI via **Speed Post with acknowledgement** so you have proof of delivery with the exact date.\n\nWould you like help drafting an application or a First Appeal?`,
  },

  // ── FAQ CHIP 2: FIRST & SECOND APPEAL ────────────────────────────────────
  {
    patterns: [/first.?appeal|second.?appeal|how.*appeal|file.*appeal|appeal.*process|cic|sic|information.?commission|appellate/i],
    response: () =>
      `⚖️ **The RTI Appeals Ladder — Step by Step:**\n\n**STEP 1 — First Appeal (Section 19(1))**\n→ File within **30 days** of: PIO's deadline passing OR unsatisfactory reply\n→ Address to: First Appellate Authority (FAA) — a senior officer in the same department\n→ FAA must decide within **30 days** (extendable to 45 days with reason)\n→ No fee required for First Appeal\n\n**STEP 2 — Second Appeal / Complaint (Section 19(3))**\n→ File within **90 days** of FAA's order (or FAA's deadline passing)\n→ For Central Govt → **Central Information Commission (CIC)**\n→ For State Govt → **State Information Commission (SIC)**\n→ CIC/SIC can order disclosure, impose penalty up to ₹25,000, and recommend disciplinary action\n\n**STEP 3 — High Court / Supreme Court**\n→ If CIC/SIC order is also unsatisfactory, you can challenge it in the relevant High Court under Article 226.\n\n📌 **Key grounds for appeal:**\n- Non-response within 30 days\n- Incomplete, vague, or misleading information\n- Unjustified rejection citing Section 8 exemptions\n- Charging excess fees\n\nWant me to draft an appeal notice for your specific case?`,
  },

  // ── FAQ CHIP 3: BPL / FEE EXEMPTION ──────────────────────────────────────
  {
    patterns: [/bpl|below.?poverty|ration.*card|free.*rti|rti.*free|fee.*exempt|no.*fee|waiv.*fee|poor.*citizen/i],
    response: () =>
      `💚 **RTI is FREE for BPL Citizens!**\n\nUnder Rule 4 of the Right to Information (Regulation of Fee and Cost) Rules, 2005:\n\n✅ **Completely waived for BPL cardholders:**\n- Application fee (₹10)\n- Document inspection charges\n- Certified copy charges (₹2/page)\n- Postal/delivery charges\n- Diskette/floppy charges\n\n📄 **How to claim exemption:**\n1. Attach a self-attested copy of your BPL/AAY Ration Card\n2. Mention in your application: *"I am a BPL cardholder and hereby claim exemption from RTI fees as per Rule 4 of the RTI Fee Rules, 2005"*\n3. Our DigiLocker integration auto-fetches and verifies your BPL certificate — no manual upload needed!\n\n⚠️ **Important:** If the PIO demands a fee from a BPL applicant, this is a violation. You can report it in your First Appeal and seek penalty action under Section 20.\n\nDo you want to file a fee-exempt RTI right now?`,
  },

  // ── FAQ CHIP 4: ONLINE FILING ─────────────────────────────────────────────
  {
    patterns: [/online|rtionline|portal|website|app.*file|file.*app|digital.*rti|e.?rti|how.*file|where.*file|submit.*rti/i],
    response: () =>
      `🌐 **How to File RTI Online:**\n\n**Central Government Portal:**\n🔗 [rtionline.gov.in](https://rtionline.gov.in)\n- Covers: All 90+ Central Ministries & Departments\n- Payment: Online via credit/debit card, UPI, net banking\n- Fee: ₹10 (BPL: Free)\n- Track status online with your Registration Number\n\n**State-Wise Online Portals:**\n| State | Portal |\n|---|---|\n| Maharashtra | mahaonline.gov.in/RTI |\n| Karnataka | rti.kar.nic.in |\n| Delhi | rti.delhi.gov.in |\n| UP | rtionline.up.gov.in |\n| Kerala | rti.kerala.gov.in |\n| Tamil Nadu | rtionline.tn.gov.in |\n| Gujarat | rtionline.gujarat.gov.in |\n| Rajasthan | rti.rajasthan.gov.in |\n\n**Via This App (Recommended!):**\n→ Uses our 9-step AI wizard\n→ Auto-identifies the right PIO\n→ AI drafts the legal text for you\n→ Handles BPL fee verification automatically\n→ Tracks your deadline and sends reminders\n\nWant me to start the filing wizard now?`,
  },

  // ── FAQ CHIP 5: NO REPLY IN 30 DAYS ──────────────────────────────────────
  {
    patterns: [/no.?reply|didn.*reply|silence|no.*response|missed.*deadline|overdue|ignored|not.*respond/i],
    response: () =>
      `🚨 **If You Got No Reply in 30 Days — Here's Exactly What to Do:**\n\n**Under Section 7(2) of the RTI Act — silence = refusal.** You have immediate legal recourse:\n\n**Option 1: First Appeal (Fastest)**\n→ File to the First Appellate Authority (FAA) in the same department\n→ Ground: *"Non-receipt of information within the statutory 30-day period under Section 7(1) of the RTI Act, 2005"*\n→ Attach: Copy of original RTI + proof of submission (postal receipt/acknowledgement)\n→ Timeline to file: Within 30 days of the PIO's deadline\n→ FAA must respond within 30-45 days\n\n**Option 2: Complaint to CIC/SIC (Stronger)**\n→ Under Section 18, you can directly file a complaint to the Information Commission\n→ This is separate from an appeal and can run simultaneously\n→ Useful when you suspect willful denial or corruption\n\n**Penalty the PIO Faces:**\n→ ₹250 per day of delay (up to ₹25,000 maximum)\n→ Disciplinary action under their service rules\n→ The penalty comes from the PIO's own salary — not the department budget\n\n📋 **Draft First Appeal — Key Phrases to Include:**\n- "The PIO failed to respond within the mandatory 30-day period"\n- "This silence constitutes deemed refusal under Section 7(2)"\n- "I request an order directing disclosure of the requested information"\n- "I request imposition of penalty under Section 19(8) read with Section 20"\n\nWant me to draft the complete First Appeal notice for you?`,
  },

  // ── FAQ CHIP 6: WHICH AUTHORITY ───────────────────────────────────────────
  {
    patterns: [/which.?authority|which.?department|which.?ministry|who.*contact|where.*send|right.*department|correct.*pio|find.*pio|identify.*authority/i],
    response: () =>
      `🏛️ **Finding the Right Authority — Complete Guide:**\n\n**RULE 1: Central vs. State**\n- Central Govt bodies (Railways, Income Tax, EPFO, Passports, Banks) → File with that Ministry's PIO\n- State Govt bodies (Police, Schools, Ration, Panchayat) → File with that State Department's PIO\n- Local bodies (Municipality, Corporation) → File with the local body's designated PIO\n\n**RULE 2: Common Departments & Their PIO Contacts**\n\n| Issue | Authority |\n|---|---|\n| Ration card, PDS | State Food & Civil Supplies Dept |\n| Pension (Central Govt) | Ministry of Finance / EPFO |\n| Land records, mutation | State Revenue Dept |\n| Road, pothole repairs | State PWD / Municipal Corporation |\n| Police FIR, complaint | State Home Dept / District SP office |\n| Income tax, PAN | Income Tax Dept, CBDT |\n| Bank account/loan issue | RBI (if PSU bank) |\n| Passport delay | Regional Passport Office |\n| Railway ticket refund | Zonal Railway HQ |\n| School fees, grants | State Education Dept |\n| Hospital negligence | State Health Dept |\n| MNREGA wages | State Rural Development Dept |\n| Scholarship status | State Social Welfare / Minority Affairs |\n| Contractor/Tender info | Relevant Ministry / State PWD |\n\n**RULE 3: When Unsure**\n→ File with the **nodal Ministry** that oversees the subject\n→ Under Section 6(3), the PIO is **legally bound** to transfer your application to the right department within 5 days — so even a wrong filing gets rerouted!\n\nJust tell me your specific problem and I'll instantly identify the exact PIO + department.`,
  },

  // ── DRAFTING ──────────────────────────────────────────────────────────────
  {
    patterns: [/draft|write.*application|help.*write|create.*rti|generate.*rti|compose.*rti|sample.*rti|format.*rti|template/i],
    response: (ctx) => {
      const topic = ctx.userTopics.length > 0 ? ctx.userTopics[ctx.userTopics.length - 1] : 'the matter in question';
      return `📝 **RTI Application Draft — Ready to Use:**\n\n---\n**To,**\nThe Public Information Officer,\n[Department Name], [Office Address]\n\n**Subject:** Application under the Right to Information Act, 2005 — Seeking information regarding *${topic}*\n\n**Sir/Madam,**\n\nI, [Your Full Name], a citizen of India, residing at [Your Address], hereby request the following information under Section 6(1) of the Right to Information Act, 2005:\n\n1. Complete details and current status regarding *${topic}*\n2. Copies of all relevant orders, files, and correspondence pertaining to this matter\n3. Name and designation of the officer(s) responsible for the decision/action\n4. The date on which the decision was taken and reasons thereto\n5. Any rules, regulations, or policies under which the decision was made\n\nI am enclosing the prescribed application fee of ₹10/- [or: I am a BPL cardholder; copy of BPL card enclosed, fee exempted under Rule 4].\n\nPlease provide the information within the stipulated period of 30 days as mandated under Section 7(1) of the RTI Act, 2005.\n\n**Yours faithfully,**\n[Your Name]\n[Phone Number]\n[Date]\n\n---\n\n💡 **Attach:** Postal Order/DD of ₹10, or BPL card copy if exempt.\n\nShall I tailor any specific point further? Just tell me more about your case!`;
    },
  },

  // ── FEE STRUCTURE ─────────────────────────────────────────────────────────
  {
    patterns: [/fee|cost|charge|₹10|rupee|payment|how much|pricing|price/i],
    response: () =>
      `💰 **Complete RTI Fee Structure:**\n\n**Application Fee (Central Govt):**\n→ ₹10 per application\n→ Mode: Indian Postal Order (IPO), Demand Draft, Banker's Cheque, or online payment\n→ Cash accepted at some offices\n\n**Additional Charges if Info is Provided:**\n| Type | Rate |\n|---|---|\n| Certified copy (A4) | ₹2 per page |\n| Certified copy (larger size) | Actual cost |\n| Soft copy (CD/Pendrive) | ₹50 per CD |\n| Sample/model | Actual cost |\n| Record inspection | Free for 1st hour, ₹5 per subsequent hour |\n\n**State-Wise Application Fees:**\n| State | Fee |\n|---|---|\n| Most states | ₹10 |\n| Maharashtra (online) | ₹20 |\n| Karnataka | ₹10 |\n| West Bengal | ₹10 |\n| J&K | ₹50 |\n\n**Free for BPL Citizens:** All fees waived — application + copies + inspection.\n\n**Appeals:** NO fee for First or Second Appeal.\n\nWant to know if you qualify for the BPL fee waiver?`,
  },

  // ── PENALTY / OFFICER LIABILITY ───────────────────────────────────────────
  {
    patterns: [/penalty|fine|punish|officer.*liable|action.*pio|pio.*penalty|compensation|₹250|25000/i],
    response: () =>
      `⚖️ **PIO Liability & Penalties Under RTI Act:**\n\n**Section 20 — Penalty on PIO:**\n→ ₹250 per day of delay/non-compliance\n→ Maximum penalty: ₹25,000\n→ Deducted from the PIO's personal salary\n→ Awarded by the Information Commission (CIC/SIC)\n\n**Grounds for imposing penalty:**\n- Not responding within 30 days\n- Refusing to accept RTI application\n- Giving knowingly incorrect or misleading information\n- Destroying information to thwart RTI\n- Obstructing access to information\n\n**Section 20(2) — Disciplinary Action:**\n→ Beyond the monetary penalty, CIC/SIC can recommend disciplinary proceedings\n→ This goes on the PIO's service record\n→ Can affect promotions, career advancement\n\n**Section 19(8) — Compensation to Complainant:**\n→ CIC/SIC can award reasonable compensation to the applicant for detriment suffered due to non-disclosure\n\n**How to claim penalty:**\n→ Mention penalty request explicitly in your Second Appeal\n→ Example language: *"I request the Hon'ble Commission to impose maximum penalty of ₹25,000 on the respondent PIO under Section 20(1) of the RTI Act for willful failure to furnish information within the stipulated period."*\n\nWant me to include a penalty claim in your appeal draft?`,
  },

  // ── REJECTION / SECTION 8 EXEMPTIONS ─────────────────────────────────────
  {
    patterns: [/reject|refuse|denied|exemption|section 8|section 9|section 24|cannot.*disclose|confidential|classified/i],
    response: () =>
      `🚫 **RTI Rejections — Know Your Rights:**\n\n**Section 8 — Legitimate Exemptions (PIO can refuse):**\n| Clause | What's Protected |\n|---|---|\n| 8(1)(a) | National security, sovereignty, integrity |\n| 8(1)(b) | Info forbidden by courts |\n| 8(1)(c) | Parliamentary privilege |\n| 8(1)(d) | Trade secrets, IP, competitive info |\n| 8(1)(e) | Fiduciary relationship |\n| 8(1)(f) | Info received in confidence from foreign govt |\n| 8(1)(g) | Endangered person's safety/identity |\n| 8(1)(h) | Ongoing investigation, prosecution |\n| 8(1)(i) | Cabinet papers, Council of Ministers deliberations |\n| 8(1)(j) | Personal info with no public interest |\n\n**BUT — Important Overrides:**\n→ Even Section 8 exemptions can be **overridden** if public interest outweighs harm (Section 8(2))\n→ Info that **cannot be denied to Parliament** cannot be denied to citizens (Section 8(1) proviso)\n→ Exemptions are **time-limited** — 20-year-old info must be disclosed (Section 8(3))\n→ Section 24 exempts intelligence agencies (IB, RAW) but NOT for corruption and human rights violations\n\n**If Your RTI Was Wrongly Rejected:**\n1. Check if the PIO cited a specific clause\n2. If no valid exemption → File First Appeal immediately\n3. Argue: "The rejection does not fall under any of the ten exemptions listed under Section 8"\n4. Request partial disclosure — even if some info is exempt, the rest must be provided (Section 10)\n\nWant help drafting an appeal against a specific rejection?`,
  },

  // ── WHAT IS RTI ───────────────────────────────────────────────────────────
  {
    patterns: [/what.*rti|explain.*rti|about.*rti|meaning.*rti|right to information|rti act|rti act 2005/i],
    response: () =>
      `📜 **Right to Information (RTI) Act, 2005 — Complete Overview:**\n\n**What is it?**\nThe RTI Act gives every Indian citizen the legal right to request information from any government authority. It's one of the most powerful tools for government accountability and citizen empowerment.\n\n**Who can file?**\n→ Any Indian citizen\n→ No need to explain WHY you want the information (Section 6(2))\n→ Even anonymously (though providing contact info is recommended for follow-up)\n\n**What does it cover?**\n→ All Central and State government ministries\n→ Panchayats, municipalities, corporations\n→ Government-owned companies\n→ Bodies receiving substantial government funding\n→ NGOs substantially funded by government\n\n**What's NOT covered?**\n→ J&K had a separate law (now merged post-2019)\n→ Intelligence agencies (IB, RAW, etc.) — except corruption/HR violations\n→ Courts (though judicial administration is covered)\n\n**Key Sections:**\n| Section | Purpose |\n|---|---|\n| Section 2 | Definitions |\n| Section 4 | Proactive disclosure duty |\n| Section 6 | How to file RTI |\n| Section 7 | Deadline & response duty |\n| Section 8 | Exemptions |\n| Section 19 | Appeal process |\n| Section 20 | Penalties |\n\n**Impact:** Since 2005, over 6 crore RTI applications have been filed in India, exposing corruption worth thousands of crores. It's your legal weapon — use it!\n\nWhat would you like to know more about?`,
  },

  // ── SPECIFIC DEPARTMENTS ──────────────────────────────────────────────────
  {
    patterns: [/ration|pds|food.*supply|fair.*price.*shop|fci|civil.*supplies/i],
    response: (ctx) => {
      ctx.userTopics.push('ration/PDS');
      return `🛒 **Filing RTI for Ration/PDS Issues:**\n\n**Authority to file with:**\n→ **Central:** Food Corporation of India (FCI), Ministry of Consumer Affairs\n→ **State:** State Civil Supplies Department / District Supply Officer\n→ **Local:** Fair Price Shop Supervisor / Block Supply Officer\n\n**What you can ask for via RTI:**\n- Status of your ration card application\n- List of beneficiaries in your area\n- Monthly allocation vs actual distribution data\n- Names of Fair Price Shop owners and their license details\n- Inspection reports of local FPS\n- Action taken on ration complaints\n\n**Common issues people expose via RTI:**\n- Ghost beneficiaries drawing ration\n- Ration being sold in black market\n- Delayed or reduced grain allocation\n- Corrupt FPS dealers\n\n**Fee:** ₹10 (Free for BPL — which you likely are if you have a ration issue!)\n\nWant me to draft a ration-related RTI application right now?`;
    },
  },
  {
    patterns: [/land|property|mutation|survey|patwari|registry|jamabandi|khasra|khatauni/i],
    response: (ctx) => {
      ctx.userTopics.push('land records');
      return `🏗️ **Filing RTI for Land Record Issues:**\n\n**Authority to file with:**\n→ State Revenue Department\n→ District Collector / Tehsildar Office\n→ Sub-Registrar Office (for property registration)\n\n**What you can RTI for:**\n- Status of land mutation/transfer application\n- Copy of Khasra-Khatauni / Jamabandi records\n- Details of government land in your area\n- Encumbrances on a property\n- Demolition/acquisition orders\n- Compensation amounts for land acquisition\n- List of beneficiaries under PM Awas Yojana in your area\n\n**Key RTI requests that work well:**\n1. "Please provide a copy of the current mutation record (Khasra/Khatauni) for Survey No. [XXX], Village [YYY], Tehsil [ZZZ]"\n2. "Please provide the status of mutation application bearing no. [XXX] filed on [date]"\n3. "Please provide copies of all orders/notices issued regarding the aforesaid land in the past 5 years"\n\n**Pro tip:** Also request the name and designation of the Patwari/Lekhpal responsible — it makes them personally accountable.\n\nShall I draft this RTI for you?`;
    },
  },
  {
    patterns: [/pension|epf|epfo|provident.?fund|retirement|pf.*withdrawal|gratuity/i],
    response: (ctx) => {
      ctx.userTopics.push('pension/EPFO');
      return `👴 **Filing RTI for Pension / EPFO Issues:**\n\n**Authority to file with:**\n→ **EPFO:** Regional PF Commissioner of your district EPFO office\n→ **Central Govt Pension:** Principal Controller of Defence Accounts / Pay & Accounts Office\n→ **State Govt Pension:** State Finance Dept / Treasury Officer\n→ **Railway Pension:** Zonal Railway PF Commissioner\n\n**What you can RTI for:**\n- Status of PF/EPS withdrawal application\n- Contribution statement for a specific period\n- Details of employer's deposit history\n- Status of pension settlement\n- Calculation method used for pension amount\n- Details of delays in payment and reasons\n\n**Sample RTI request:**\n*"Please provide the current status of EPF withdrawal claim bearing Claim ID [XXX] submitted on [date], name of the officer processing it, and reasons for delay if any."*\n\n**EPFO RTI Address:**\nThe CPIO, EPFO Regional Office, [City]\nOr file online at: **epfindia.gov.in** (then RTI section)\n\n**Typical response time:** 25–28 days. If no reply → immediate First Appeal works very effectively with EPFO.\n\nWant the full draft?`;
    },
  },
  {
    patterns: [/police|fir|complaint.*police|arrest|custody|case.*status|police.*report|chargesheet/i],
    response: (ctx) => {
      ctx.userTopics.push('police records');
      return `👮 **Filing RTI for Police-Related Matters:**\n\n**Authority to file with:**\n→ **FIR/Case info:** CPIO of the concerned Police Station / District SP Office\n→ **State-level:** State Home Department\n→ **Central forces (CRPF, BSF, etc.):** Ministry of Home Affairs\n\n**What you can RTI for:**\n- Copy of FIR (you're legally entitled to a free copy anyway under CrPC, but RTI speeds it up)\n- Status of complaint / investigation\n- Action taken on a complaint\n- Chargesheet filed or not, and date\n- Details of bail orders, arrest memo\n- Senior officer inspections of a case\n\n**⚠️ Limitation:** Under Section 8(1)(h), ongoing investigation details can be withheld. But once a chargesheet is filed, most info becomes accessible.\n\n**What RTI has exposed in police matters:**\n- Cases being closed without investigation (\"untraced\")\n- Delayed FIR registration\n- Non-filing of chargesheets (leading to bail by default)\n- Custodial death cover-ups\n\n**Practical tip:** If police refuse to register your FIR, send a written complaint to the SP. Then file RTI on the action taken on that complaint. This often triggers immediate action.\n\nShall I draft a police-related RTI for you?`;
    },
  },
  {
    patterns: [/road|pothole|bridge|construction|pwd|infrastructure|repair|contractor.*road/i],
    response: (ctx) => {
      ctx.userTopics.push('infrastructure/road');
      return `🚧 **Filing RTI for Road/Infrastructure Issues:**\n\n**Authority to file with:**\n→ **National Highways:** NHAI / Ministry of Road Transport & Highways\n→ **State Roads:** State Public Works Department (PWD)\n→ **City Roads:** Municipal Corporation / Nagar Panchayat\n→ **Village Roads (PMGSY):** District PMGSY office / State Rural Roads Agency\n\n**What to ask for in your RTI:**\n1. Details of the contractor awarded work on [Road Name/Section]\n2. Contract value and scope of work\n3. Date of work completion as per contract\n4. Quality inspection reports and results\n5. Complaint log and action taken\n6. Details of maintenance responsibility and schedule\n\n**This RTI has proven powerful for:**\n- Exposing shoddy construction and re-tendering scams\n- Holding contractors accountable by making their names public\n- Getting pothole repairs done — since officials know you're watching\n\n**Sample text:**\n*"Please provide copies of all contracts awarded for road construction/repair on [Name of Road] in the period [Year-Year], along with contractor details, amounts paid, and quality inspection reports."*\n\nWant me to generate the full RTI application?`;
    },
  },
  {
    patterns: [/scholarship|student|education|school|college|university|fees.*school|admission/i],
    response: (ctx) => {
      ctx.userTopics.push('education/scholarship');
      return `🎓 **Filing RTI for Education/Scholarship Issues:**\n\n**Authority to file with:**\n→ **Central Scholarships (NSP):** Ministry of Education / Dept of Empowerment\n→ **State Scholarships:** State Social Welfare / Minority Affairs / Education Dept\n→ **School fees/grants:** District Education Officer (DEO)\n→ **University admissions:** Respective University's Registrar\n\n**What you can RTI for:**\n- Status of scholarship application (NSP portal ID)\n- Amount sanctioned vs. amount disbursed\n- List of scholarship awardees in your district/school\n- Reasons for rejection of application\n- Criteria used for selection\n- Pending audit reports for the school\n\n**Sample scholarship RTI:**\n*"Please provide the status of scholarship application bearing Registration No. [XXX] on the National Scholarship Portal, the amount sanctioned, date of disbursement, and reasons if not yet processed."*\n\n**It works!** Many students have recovered withheld scholarships after a single RTI to the state nodal department.\n\nWant the full draft for your specific scholarship issue?`;
    },
  },
  {
    patterns: [/hospital|health|doctor|medical.*negligence|ayushman|pmjay|health.*scheme/i],
    response: (ctx) => {
      ctx.userTopics.push('health/hospital');
      return `🏥 **Filing RTI for Health / Hospital Issues:**\n\n**Authority to file with:**\n→ **Government hospitals:** State Health & Family Welfare Dept\n→ **AIIMS/Central hospitals:** Ministry of Health & Family Welfare\n→ **Ayushman Bharat/PMJAY:** National Health Authority or State Health Agency\n→ **Drug quality issues:** CDSCO / State Drug Controller\n\n**What you can RTI for:**\n- Status of complaint filed against a doctor/hospital\n- Ayushman Bharat claim status and amount\n- Medicine procurement prices (to expose corruption)\n- Doctor attendance records at government hospitals\n- Functioning status of PHC/CHC equipment\n- Inspection reports of a specific hospital\n\n**Powerful RTI findings in health sector:**\n- Ghost doctors on payroll\n- Medicine procured at 10x market rate\n- Non-functional ambulances billed as operational\n- Beds shown as occupied when empty (insurance fraud)\n\n**Sample text:**\n*"Please provide the current status of grievance/complaint filed bearing No. [XXX] on [date] regarding medical negligence at [Hospital Name], along with the name of the enquiry officer and action taken."*\n\nShall I draft this for you?`;
    },
  },

  // ── SECTION 4 — PROACTIVE DISCLOSURE ─────────────────────────────────────
  {
    patterns: [/section 4|proactive.*disclosure|suo.?motu|self.*publish|suo motu/i],
    response: () =>
      `📢 **Section 4 — Mandatory Proactive Disclosure:**\n\nEvery government authority is **legally required** to proactively publish 17 categories of information on their website (Section 4(1)(b)):\n\n1. Organisation, functions, and duties\n2. Powers and duties of officers\n3. Decision-making procedures\n4. Work norms/standards\n5. Rules, regulations, manuals used\n6. Categories of documents held\n7. Consultative bodies\n8. Boards, councils, committees\n9. Directory of officers and employees\n10. **Salaries of all officials**\n11. Budget allocation and expenditure\n12. Subsidy programme details and beneficiaries\n13. Recipients of concessions/permits/authorisations\n14. Details of information available in electronic form\n15. Facilities for citizens to obtain information\n16. Public Information Officers' names and contacts\n17. Any other information as prescribed\n\n**Practical use:** Before filing an RTI, check the department's Section 4 disclosures — you might already find the info you need! If they haven't published Section 4 info, THAT itself is an RTI/complaint ground.\n\nWould you like help finding a specific department's Section 4 page?`,
  },

  // ── SECTION 6 — HOW TO WRITE ─────────────────────────────────────────────
  {
    patterns: [/how.*write|tips.*rti|good.*rti|effective.*rti|best.*practice|what.*include|important.*points/i],
    response: () =>
      `✍️ **How to Write a Powerful RTI Application — 10 Tips:**\n\n**1. Be specific** — Vague questions get vague answers. Instead of "give me all info about roads," ask "provide contract details for road repair tender No. XXX."\n\n**2. Ask for records, not opinions** — PIOs must provide records, not their interpretations.\n\n**3. Number your questions** — Makes it harder for the PIO to "miss" any question.\n\n**4. Request certified copies** — Always say "certified copies of all relevant records" — it makes the info legally usable.\n\n**5. Include a specific time period** — "...in the period from April 2022 to March 2024"\n\n**6. Ask for the responsible officer's name** — Makes officials personally accountable.\n\n**7. Avoid emotional language** — Keep it formal, factual, legal.\n\n**8. File in the correct language** — You can file in Hindi or the official language of your state.\n\n**9. Keep a copy** — Always keep a copy of what you sent.\n\n**10. Use Speed Post** — Get acknowledgement with date — this is your proof that the 30-day clock has started.\n\n**Bonus:** Under Section 6(2), you don't have to explain WHY you want the information. Don't include your reasons — it can be used against you.\n\nWant me to review or draft an application based on these principles?`,
  },

  // ── THANK YOU / POSITIVE ─────────────────────────────────────────────────
  {
    patterns: [/thank|thanks|great|awesome|perfect|excellent|helpful|nice|wonderful|superb|brilliant/i],
    response: () =>
      `You're most welcome! 🙏\n\n**Remember:** Information is a fundamental right, not a privilege. The RTI Act exists because citizens fought for transparency — don't hesitate to use it whenever you feel the government owes you an answer.\n\n**Quick Reference:**\n- 📋 File RTI → rtionline.gov.in (Central) or your State portal\n- ⏱️ 30-day response deadline\n- 🆓 Free for BPL cardholders\n- ⚖️ First Appeal → within 30 days of no reply\n- 🏛️ Second Appeal → CIC/SIC within 90 days\n\nIs there anything else I can help you with? I can draft applications, explain specific sections, or help identify the right authority.`,
  },

  // ── YES / CONFIRMATION ────────────────────────────────────────────────────
  {
    patterns: [/^(yes|yep|yeah|sure|okay|ok|please|go ahead|do it|alright|haan|ji|bilkul)\b/i],
    response: (ctx) => {
      if (/draft|appeal|application/i.test(ctx.lastAIMessage)) {
        return `Perfect! To draft the most targeted RTI for you, I need just a few details:\n\n1. **Which department/authority** is this for? (e.g., EPFO, Municipal Corporation, State Revenue Dept)\n2. **Which state** are you in?\n3. **What specific information** are you looking for? (e.g., status of application No. XXX, copy of order dated YYY)\n4. **When** did the issue start or when did you last file/apply?\n\nThe more specific you are, the stronger your RTI will be. Go ahead!`;
      }
      if (/file.*now|start.*filing|filing.*wizard/i.test(ctx.lastAIMessage)) {
        return `Great! Head back to the home screen and tap **"FILE A NEW RTI"**. Our 9-step AI wizard will:\n\n✅ Auto-fill your profile details\n✅ Help describe your problem\n✅ Identify the exact PIO/Authority\n✅ Generate a legally strong draft\n✅ Process BPL fee exemption (if applicable)\n✅ Submit and give you a tracking number\n\nIt takes about 5 minutes. Let me know if you have any questions along the way!`;
      }
      return `Absolutely! Let's proceed. Could you give me a bit more context about your specific situation so I can give you the most accurate and useful guidance?`;
    },
  },

  // ── NO / DECLINE ──────────────────────────────────────────────────────────
  {
    patterns: [/^(no|nope|not now|later|maybe later|nahi|nahi chahiye|not interested)\b/i],
    response: () =>
      `No problem at all! 😊 I'm here whenever you're ready.\n\nIn the meantime, here are some things to explore:\n- 📋 **File a new RTI** from the home screen\n- 📁 **Track existing** applications under Manage Reports\n- 📚 **Public Archive** — see RTIs filed by others for inspiration\n\nCome back anytime you have a question!`,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TOPIC EXTRACTOR
// ─────────────────────────────────────────────────────────────────────────────
function extractTopics(text: string): string[] {
  const topics: string[] = [];
  if (/pension|retirement|epfo|provident/i.test(text)) topics.push('pension/EPFO status');
  if (/ration|pds|food|fair.*price/i.test(text)) topics.push('ration/PDS supply');
  if (/road|pothole|bridge|infrastructure/i.test(text)) topics.push('road repair and infrastructure');
  if (/land|property|mutation|survey|khasra/i.test(text)) topics.push('land records and mutation');
  if (/school|education|college|scholarship/i.test(text)) topics.push('education and scholarship');
  if (/hospital|health|medical|doctor/i.test(text)) topics.push('health and hospital services');
  if (/police|fir|arrest|custody/i.test(text)) topics.push('police complaints and FIR');
  if (/salary|payment|contractor|tender/i.test(text)) topics.push('payment and contractor records');
  if (/corruption|misuse|fraud|scam/i.test(text)) topics.push('corruption and misuse of funds');
  if (/water|sewage|drainage|borewell/i.test(text)) topics.push('water supply and drainage');
  if (/electricity|power|bill|meter/i.test(text)) topics.push('electricity supply and billing');
  if (/employment|job|nrega|mnrega|wages/i.test(text)) topics.push('employment and MNREGA wages');
  return topics;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXTUAL FOLLOW-UP POOL (when no pattern matches, use conversation context)
// ─────────────────────────────────────────────────────────────────────────────
const FOLLOW_UPS = [
  (ctx: ConversationContext) =>
    `Based on what we've discussed${ctx.userTopics.length > 0 ? ` about **${ctx.userTopics[ctx.userTopics.length - 1]}**` : ''}, the next logical step is to identify the specific PIO at the right department. Shall I help you find the exact authority to file with?`,
  (ctx: ConversationContext) =>
    `That's a good point${ctx.userTopics.length > 0 ? ` related to **${ctx.userTopics[ctx.userTopics.length - 1]}**` : ''}. One powerful strategy is to also ask for the **internal file notings** along with the main order — these show the reasoning chain and are often more revealing than the final document. Want me to include that in a draft?`,
  () =>
    `To strengthen your case, I'd also suggest requesting the **inspection report** and the **compliance certificate** if any work or service is involved — officials are often more forthcoming when they realize you know exactly what records exist. Shall I add these to your RTI?`,
  () =>
    `Remember — under **Section 10** of the RTI Act, even if some parts of a document are exempt, the rest must be provided with the exempt portion redacted. So never let a PIO reject your whole request because one part might be sensitive. Would you like to include this legal note in your application?`,
  () =>
    `One tactic that works very well: file RTI and simultaneously send a copy as a **public grievance on pgportal.gov.in**. Both channels together create accountability from two different departments, dramatically speeding up resolution. Want guidance on both?`,
  () =>
    `I cross-referenced your query against CIC orders and DoPT guidelines. Under established RTI precedent, information of this nature is typically **disclosable** unless specifically exempted under Section 8. A well-worded RTI with the right framing has a high success rate here. Want me to draft it?`,
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN RESPONSE ENGINE
// ─────────────────────────────────────────────────────────────────────────────
export function generateMRRighteousResponse(
  userMessage: string,
  history: ConversationTurn[]
): string {
  const newTopics = extractTopics(userMessage);
  const existingTopics = history
    .filter(h => h.role === 'user')
    .flatMap(h => extractTopics(h.content));

  const ctx: ConversationContext = {
    history,
    userTopics: [...existingTopics, ...newTopics],
    turnCount: history.length,
    lastAIMessage: [...history].reverse().find(h => h.role === 'ai')?.content || '',
    lastUserMessage: [...history].reverse().find(h => h.role === 'user')?.content || '',
  };

  // 1. Match against knowledge base
  for (const entry of KB) {
    if (entry.patterns.some(p => p.test(userMessage))) {
      return entry.response(ctx);
    }
  }

  // 2. Use contextual follow-up if we have conversation history
  if (history.length > 0) {
    const followUp = FOLLOW_UPS[ctx.turnCount % FOLLOW_UPS.length];
    return followUp(ctx);
  }

  // 3. Smart fallback
  return `I'm cross-referencing the RTI Act 2005, DoPT circulars, and CIC precedent orders for your query...\n\nTo give you the most precise guidance, could you tell me:\n\n1. 🏛️ **Which government department** or authority is involved?\n2. 📍 **Which state** are you in?\n3. 📋 **What specific information** are you looking to obtain?\n4. ⏳ **Has there been a previous filing** or communication?\n\nWith these details, I can identify the exact PIO, draft your application, and estimate your success odds. Go ahead!`;
}
