import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ArrowLeft, Bot, Send, Sparkles, Mic, FileText, Activity, HelpCircle, FileSearch } from "lucide-react";

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export default function ToolkitPage() {
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: "Hello! I am your RTI AI Agent. I have full knowledge of the RTI Act 2005, recent rulings, and the public archive. How can I assist you today?" }
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
    
    // Add user message
    setChatMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputValue("");
    setIsTyping(true);

    // Mock AI response delay
    setTimeout(() => {
      let aiResponse = "I'm checking the RTI Act and recent public archives... Based on the guidelines, you have the right to request this information. Let me know if you want me to draft the exact application for you.";
      
      const lowerText = text.toLowerCase();
      if (lowerText.includes("appeal")) {
        aiResponse = "I can help you draft a First Appeal. I will need the original RTI you filed and the incomplete reply you received from the PIO. I will identify the legal gaps and write a strong appeal for the First Appellate Authority. Would you like to proceed?";
      } else if (lowerText.includes("analyse") || lowerText.includes("analyze") || lowerText.includes("reply")) {
        aiResponse = "Sure! Paste the official government reply you received, and I'll run an AI analysis to see if they dodged your question, cited an incorrect exemption clause, or provided complete information.";
      } else if (lowerText.includes("bpl") || lowerText.includes("fee")) {
        aiResponse = "Citizens holding a Below Poverty Line (BPL) card are fully exempt from the ₹10 RTI application fee, as well as any document copying charges. Our platform automatically verifies your BPL status via DigiLocker.";
      }

      setChatMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  const QUICK_ACTIONS = [
    { label: "Draft an Appeal", icon: FileText, query: "I want to draft a First Appeal against a rejected RTI." },
    { label: "Analyze Govt Reply", icon: Activity, query: "Can you analyze a government reply I received?" },
    { label: "Check BPL Rules", icon: HelpCircle, query: "What are the BPL fee exemption rules for RTI?" },
    { label: "Search Archives", icon: FileSearch, query: "Search the public archive for road repair RTIs." }
  ];

  const handleMicClick = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setInputValue("How many days does the government have to reply?");
    }, 2000);
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center py-4 px-4 h-[calc(100vh-4rem)]">
        <div className="w-full max-w-3xl flex flex-col h-full bg-white/95 border-2 border-gray-300 rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-700 to-indigo-800 px-6 py-4 flex items-center justify-between text-white shadow-sm z-10 shrink-0">
            <div className="flex items-center gap-4">
              <Link to="/home" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-all duration-200">
                <ArrowLeft size={22} />
              </Link>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                <Bot size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl leading-tight tracking-tight">RTI AI Agent</h3>
                <p className="text-purple-100 text-xs font-medium">Voice + Chat • Legal Assistant</p>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 flex flex-col gap-6" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            {chatMessages.length === 1 && (
              <div className="grid grid-cols-2 gap-3 mb-4 mt-2">
                {QUICK_ACTIONS.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(action.query)}
                    className="flex flex-col items-center justify-center gap-2 bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 p-4 rounded-xl transition-all shadow-sm group"
                  >
                    <action.icon size={24} className="text-purple-600 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-gray-700 text-center">{action.label}</span>
                  </button>
                ))}
              </div>
            )}

            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm mt-auto ${
                  msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                }`}>
                  {msg.role === 'user' ? <div className="font-bold text-xs">U</div> : <Bot size={16} />}
                </div>

                <div className={`px-4 py-3 max-w-[85%] sm:max-w-[75%] shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm' 
                    : 'bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 flex-row">
                <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm mt-auto bg-purple-600 text-white">
                  <Sparkles size={14} />
                </div>
                <div className="px-5 py-4 bg-white border border-gray-100 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5 w-16">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200 shrink-0">
            <div className="flex items-center gap-2 max-w-4xl mx-auto">
              <button 
                onClick={handleMicClick}
                className={`w-12 h-12 flex items-center justify-center rounded-full transition-all shrink-0 shadow-sm ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse shadow-red-200 ring-4 ring-red-100' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-purple-600'
                }`}
              >
                <Mic size={20} className={isListening ? "animate-bounce" : ""} />
              </button>
              
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isListening ? "Listening..." : "Ask the RTI AI Agent..."}
                  disabled={isListening}
                  className="w-full pl-5 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-full text-sm focus:outline-none focus:border-purple-400 focus:bg-white transition-all disabled:opacity-70"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isListening}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-full flex items-center justify-center transition-all shadow-sm"
                >
                  <Send size={16} className="ml-[-2px] mt-[2px]" />
                </button>
              </div>
            </div>
            <div className="text-center mt-2">
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">AI can make mistakes. Verify legal deadlines.</p>
            </div>
          </div>
          
        </div>
      </div>
    </ProtectedRoute>
  );
}
