import fs from 'fs';
import path from 'path';

const localesDir = path.join(process.cwd(), 'public', 'locales');

const newTranslations = {
  en: {
    dashboard: {
      welcome: "Welcome",
      whatWouldYouLike: "What would you like to do today?",
      fileNewReq: "FILE NEW REQUEST",
      viewTrack: "VIEW / TRACK EXISTING REPORTS",
      docConnect: "DOCUMENT VAULT",
      knowRules: "KNOW RTI RULES",
      rtiToolkit: "RTI TOOLKIT",
      signOut: "Sign out securely",
      fee: "Fee"
    }
  },
  hi: {
    dashboard: {
      welcome: "स्वागत है",
      whatWouldYouLike: "आज आप क्या करना चाहेंगे?",
      fileNewReq: "नया अनुरोध दर्ज करें",
      viewTrack: "मौजूदा रिपोर्ट देखें / ट्रैक करें",
      docConnect: "दस्तावेज़ कनेक्ट",
      knowRules: "RTI नियम जानें",
      rtiToolkit: "RTI टूलकिट",
      signOut: "सुरक्षित रूप से लॉग आउट करें",
      fee: "शुल्क"
    }
  },
  bn: {
    dashboard: {
      welcome: "স্বাগতম",
      whatWouldYouLike: "আজ আপনি কী করতে চান?",
      fileNewReq: "নতুন অনুরোধ জমা দিন",
      viewTrack: "বিদ্যমান রিপোর্টগুলি দেখুন / ট্র্যাক করুন",
      docConnect: "ডকুমেন্ট কানেক্ট",
      knowRules: "আরটিআই নিয়মগুলি জানুন",
      rtiToolkit: "আরটিআই টুলকিট",
      signOut: "নিরাপদে সাইন আউট করুন",
      fee: "ফি"
    }
  },
  ta: {
    dashboard: {
      welcome: "வரவேற்கிறோம்",
      whatWouldYouLike: "இன்று நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?",
      fileNewReq: "புதிய கோரிக்கையை தாக்கல் செய்",
      viewTrack: "உள்ள அறிக்கைகளைக் காண்க / கண்காணிக்கவும்",
      docConnect: "ஆவண இணைப்பு",
      knowRules: "RTI விதிகளை அறியுங்கள்",
      rtiToolkit: "RTI கருவித்தொகுதி",
      signOut: "பாதுகாப்பாக வெளியேறு",
      fee: "கட்டணம்"
    }
  }
};

for (const lang of ['en', 'hi', 'bn', 'ta']) {
  const filePath = path.join(localesDir, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.dashboard = { ...data.dashboard, ...newTranslations[lang].dashboard };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${lang}.json`);
  }
}
