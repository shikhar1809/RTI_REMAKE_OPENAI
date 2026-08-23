import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ArrowLeft, Send, Mic, FileText, Activity, HelpCircle, FileSearch } from "lucide-react";

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

// Reactive Avatar Component
const AgentAvatar = ({ state, size = "normal" }: { state: 'idle' | 'typing' | 'listening', size?: "normal" | "small" }) => {
  const isSmall = size === "small";
  const containerClass = isSmall ? "w-8 h-8" : "w-14 h-14";
  
  // Base colors
  let bgClass = "bg-gradient-to-tr from-indigo-500 to-purple-500";
  let animateClass = "animate-pulse shadow-indigo-300/50";
  let innerDotClass = "bg-white/80";

  if (state === 'typing') {
    bgClass = "bg-gradient-to-tr from-emerald-400 to-teal-500";
    animateClass = "animate-spin shadow-teal-300/50";
    innerDotClass = "bg-white";
  } else if (state === 'listening') {
    bgClass = "bg-gradient-to-tr from-rose-400 to-red-500";
    animateClass = "animate-bounce shadow-red-300/50";
    innerDotClass = "bg-white animate-ping";
  }

  return (
    <div className={`relative flex items-center justify-center rounded-[40%] transition-all duration-700 ease-in-out shadow-lg ${containerClass} ${bgClass} ${animateClass}`}
         style={{ borderRadius: state === 'idle' ? '40% 60% 70% 30% / 40% 50% 60% 50%' : state === 'listening' ? '50%' : '30% 70% 50% 50% / 50% 50% 70% 50%' }}>
      <div className={`${isSmall ? 'w-2 h-2' : 'w-4 h-4'} rounded-full transition-all duration-300 ${innerDotClass}`}></div>
    </div>
  );
};

export default function ToolkitPage() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: "Hi, I'm Nyaya, your RTI AI Agent. I hold the complete knowledge of the RTI Act 2005 and millions of public archives. How can I assist your filing today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSend = (text: string = inputValue) => {
    if (!text.trim()) return;
    
    setChatMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = "I am cross-referencing your query with the RTI Act guidelines and public archives. It appears you have strong grounds to request this. Shall I prepare a formal application draft for you?";
      
      const lowerText = text.toLowerCase();
      if (lowerText.includes("appeal")) {
        aiResponse = "I can definitely help draft your First Appeal. Please provide the original RTI application and the PIO's rejection reason. I will identify the exact legal loopholes and draft a compelling appeal.";
      } else if (lowerText.includes("analyze") || lowerText.includes("analyse") || lowerText.includes("reply")) {
        aiResponse = "I'm ready to analyze the response. Just paste the PIO's reply here. I'll evaluate if they used valid exemption clauses (like Section 8) or if they gave an incomplete, evasive answer.";
      } else if (lowerText.includes("bpl") || lowerText.includes("fee")) {
        aiResponse = "According to RTI rules, citizens with a valid BPL card are completely exempt from the ₹10 application fee and any subsequent document copying charges. I can auto-verify this for you via DigiLocker.";
      }

      setChatMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
      setIsTyping(false);
    }, 2000);
  };

  const QUICK_ACTIONS = [
    { label: "Draft Appeal", desc: "Against rejected RTIs", icon: FileText, query: "I need to draft a First Appeal against a rejected RTI." },
    { label: "Analyze Reply", desc: "Grade PIO responses", icon: Activity, query: "Can you analyze a government reply I received?" },
    { label: "BPL Exemption", desc: "Check fee rules", icon: HelpCircle, query: "Explain the BPL fee exemption rules for RTI." },
    { label: "Archive Search", desc: "Find precedents", icon: FileSearch, query: "Search the public archive for road repair precedents." }
  ];

  const handleMicClick = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setInputValue("How many days does the government have to reply to my RTI?");
    }, 2500);
  };

  const agentState = isListening ? 'listening' : isTyping ? 'typing' : 'idle';

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center py-0 sm:py-6 px-0 sm:px-4 h-[calc(100vh-4rem)] bg-[#FDFDFD]">
        <div className="w-full max-w-4xl flex flex-col h-full bg-white sm:border border-gray-200 sm:rounded-3xl sm:shadow-2xl overflow-hidden relative">
          
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-xl z-20 shrink-0 absolute top-0 w-full">
            <div className="flex items-center gap-4">
              <Link to="/home" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-all duration-200">
                <ArrowLeft size={22} />
              </Link>
              <div className="flex items-center gap-3">
                <AgentAvatar state={agentState} />
                <div>
                  <h3 className="font-extrabold text-lg text-gray-900 tracking-tight">Nyaya AI</h3>
                  <p className="text-gray-400 text-xs font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Ready to assist
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto pt-24 p-4 sm:p-8 flex flex-col gap-8 scroll-smooth pb-32">
            
            {/* Quick Actions (Only on first load) */}
            {chatMessages.length === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 max-w-2xl mx-auto w-full mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {QUICK_ACTIONS.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(action.query)}
                    className="flex items-center gap-4 bg-white border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 p-4 rounded-2xl transition-all shadow-sm hover:shadow-md group text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-indigo-100 flex items-center justify-center transition-colors shrink-0">
                      <action.icon size={20} className="text-gray-500 group-hover:text-indigo-600 transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 group-hover:text-indigo-900">{action.label}</h4>
                      <p className="text-xs text-gray-500">{action.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 max-w-3xl mx-auto w-full ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="shrink-0 mt-auto mb-1">
                  {msg.role === 'user' ? (
                    <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center shadow-md">
                      <span className="text-white text-xs font-bold">U</span>
                    </div>
                  ) : (
                    <AgentAvatar state="idle" size="small" />
                  )}
                </div>

                <div className={`px-5 py-4 max-w-[85%] sm:max-w-[75%] leading-relaxed text-[15px] shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-gray-900 text-white rounded-3xl rounded-br-sm' 
                    : 'bg-white text-gray-800 rounded-3xl rounded-bl-sm border border-gray-100'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4 max-w-3xl mx-auto w-full flex-row animate-in fade-in duration-300">
                <div className="shrink-0 mt-auto mb-1">
                  <AgentAvatar state="typing" size="small" />
                </div>
                <div className="px-5 py-5 bg-white border border-gray-100 rounded-3xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>

          {/* Input Area */}
          <div className="absolute bottom-0 w-full p-4 sm:p-6 bg-gradient-to-t from-white via-white to-transparent pt-12">
            <div className="flex items-center gap-3 max-w-3xl mx-auto bg-white border border-gray-200 shadow-xl shadow-gray-200/50 rounded-full p-2 pl-6 transition-all focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-100">
              
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? "Listening..." : "Ask Nyaya anything..."}
                disabled={isListening}
                className="flex-1 bg-transparent border-none text-[15px] focus:outline-none focus:ring-0 disabled:opacity-70 text-gray-800 placeholder:text-gray-400 py-2"
              />
              
              <button 
                onClick={handleMicClick}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all shrink-0 ${
                  isListening 
                    ? 'bg-rose-100 text-rose-600 animate-pulse' 
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-indigo-600'
                }`}
              >
                <Mic size={18} />
              </button>

              <button 
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isListening}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
                  inputValue.trim() && !isListening
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send size={16} className="ml-[-2px] mt-[2px]" />
              </button>
            </div>
            <div className="text-center mt-3">
              <p className="text-[11px] text-gray-400 font-medium">Nyaya AI can make mistakes. Always verify RTI deadlines.</p>
            </div>
          </div>
          
        </div>
      </div>
    </ProtectedRoute>
  );
}
