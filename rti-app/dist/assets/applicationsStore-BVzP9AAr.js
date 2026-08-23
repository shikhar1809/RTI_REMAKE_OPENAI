import{a as e,i as t}from"./ProtectedRoute-BFuKXADP.js";var n=[{id:`rti-001`,subject:`Status of Ration Card Application — 6 months pending`,authority:`Food and Civil Supplies Department, UP`,stateId:`up`,filedDate:new Date(Date.now()-1296e6).toISOString(),deadlineDate:new Date(Date.now()+1296e6).toISOString(),status:`pending`,problemSummary:`Applied for ration card 6 months ago. No status update received. Office staff not cooperating.`},{id:`rti-002`,subject:`Road Repair Work — Budget & Contractor Details`,authority:`Municipal Corporation, Kerala`,stateId:`kerala`,filedDate:new Date(Date.now()-27648e5).toISOString(),deadlineDate:new Date(Date.now()-1728e5).toISOString(),status:`replied`,problemSummary:`Pothole on main street unrepaired for 8 months despite multiple complaints.`,hasReply:!0,replyScore:35,replyText:`Reference: MC/RTI/2025/4821
Date: [Two weeks ago]

Dear Applicant,

Your RTI application dated [filing date] has been received and noted.

In response to your queries:

The Municipal Corporation undertakes road maintenance works as per the annual maintenance calendar. Works are scheduled based on priority and availability of funds.

For further details, you may visit our office during working hours (10 AM to 5 PM, Monday to Friday).

Yours faithfully,
Assistant Engineer,
Municipal Corporation`},{id:`rti-003`,subject:`Old Age Pension Application — Status Inquiry`,authority:`Social Welfare Department, Rajasthan`,stateId:`rajasthan`,filedDate:new Date(Date.now()-5616e6).toISOString(),deadlineDate:new Date(Date.now()-3024e6).toISOString(),status:`appealed`,problemSummary:`Mother applied for old age pension 2 years ago. Multiple visits to office with no result.`,hasReply:!0,replyScore:20},{id:`rti-004`,subject:`Land Mutation Status — Survey No. 234`,authority:`Revenue Department, Himachal Pradesh`,stateId:`hp`,filedDate:new Date(Date.now()-7776e6).toISOString(),deadlineDate:new Date(Date.now()-5184e6).toISOString(),status:`resolved`,problemSummary:`Land mutation pending for 18 months after purchase.`,hasReply:!0,replyScore:85}];function r(e){let t=new Date(e),n=new Date;return Math.ceil((t.getTime()-n.getTime())/864e5)}var i=e()(t(e=>({applications:n,addApplication:t=>e(e=>({applications:[t,...e.applications]}))}),{name:`rti-applications`}));export{r as n,i as t};