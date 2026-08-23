import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ArrowLeft, Send, Mic, Paperclip, Globe, Smile, FolderOpen } from "lucide-react";

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

// Nyaya reactive avatar - Claude-style organic blob
const NyayaAvatar = ({ state }: { state: 'idle' | 'typing' | 'listening' }) => {
  const configs = {
    idle:      { bg: "from-green-400 to-emerald-600", border: "40% 60% 70% 30% / 40% 50% 60% 50%", glow: "shadow-green-400/30",  dot: "bg-white/90" },
    typing:    { bg: "from-emerald-400 to-teal-500",  border: "30% 70% 50% 50% / 50% 50% 70% 50%", glow: "shadow-teal-400/40",   dot: "bg-white animate-ping" },
    listening: { bg: "from-rose-400 to-red-500",      border: "50% 50% 50% 50%",                    glow: "shadow-red-400/40",    dot: "bg-white animate-bounce" },
  };
  const c = configs[state];
  return (
    <div className={`relative w-12 h-12 bg-gradient-to-tr ${c.bg} flex items-center justify-center shadow-xl ${c.glow} transition-all duration-700`}
         style={{ borderRadius: c.border }}>
      <div className={`w-3 h-3 rounded-full ${c.dot} transition-all duration-300`} />
    </div>
  );
};

const FAQ_CHIPS = [
  "What is the RTI deadline?",
  "How to file a First Appeal?",
  "Is RTI free for BPL citizens?",
  "Can RTI be filed online?",
  "What if no reply in 30 days?",
  "Which authority to contact?",
];

const MOCK_RESPONSES: Record<string, string> = {
  "What is the RTI deadline?": "Under the RTI Act 2005, the Public Information Officer (PIO) must respond within **30 days** of receiving your application. For matters involving life or liberty, the deadline is **48 hours**.",
  "How to file a First Appeal?": "If unsatisfied with the PIO's response (or no response), you can file a First Appeal with the **First Appellate Authority** within **30 days** of receiving the reply. I can draft this appeal for you — just say the word.",
  "Is RTI free for BPL citizens?": "Yes! Citizens holding a valid **BPL (Below Poverty Line) card** are completely exempt from the ₹10 application fee and all document copying charges. Your DigiLocker vault auto-verifies this.",
  "Can RTI be filed online?": "Absolutely. You can file Central Government RTIs at **rtionline.gov.in**. Many state portals also support online filing. Our app guides you through the exact process step by step.",
  "What if no reply in 30 days?": "Silence is deemed a **refusal** under the RTI Act. You can immediately file a First Appeal citing non-response, and even escalate to the Central Information Commission (CIC) for a Second Appeal.",
  "Which authority to contact?": "Our AI routing engine analyzes your problem and identifies the exact **Ministry and Public Information Officer (PIO)**. Just describe your issue and hit 'File RTI' — we'll figure out the right desk.",
};

export default function ToolkitPage() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSend = (text: string = inputValue) => {
    if (!text.trim()) return;
    setHasStarted(true);
    setChatMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const response = MOCK_RESPONSES[text] ??
        "I'm cross-referencing the RTI Act and public archives... Based on established guidelines, you have strong grounds here. Want me to draft the exact application for you?";
      setChatMessages(prev => [...prev, { role: 'ai', content: response }]);
      setIsTyping(false);
    }, 1800);
  };

  const agentState = isListening ? 'listening' : isTyping ? 'typing' : 'idle';

  const handleMicClick = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setInputValue("What happens if the PIO doesn't reply in 30 days?");
    }, 2200);
  };

  return (
    <ProtectedRoute>
      {/* Full-page gradient bg like the screenshot */}
      <div className="relative flex flex-col items-center h-[calc(100vh-4rem)] overflow-hidden bg-white"
           >

        {/* Soft glow blobs */}

        {/* Back arrow — top left */}
        <div className="absolute top-4 left-4 z-30">
          <Link to="/home" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-md text-gray-600 hover:bg-white shadow-sm transition-all">
            <ArrowLeft size={20} />
          </Link>
        </div>

        {/* ─── EMPTY STATE (before first message) ─── */}
        {!hasStarted && (
          <div className="flex flex-col items-center justify-center flex-1 px-4 pb-48 gap-8 w-full">
            {/* Avatar + name */}
            <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <NyayaAvatar state={agentState} />
              <div className="text-center">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Nyaya AI</h1>
                <p className="text-sm text-gray-500 mt-1">Your RTI Legal Assistant · Voice + Chat</p>
              </div>
            </div>

            {/* FAQ chips */}
            <div className="flex flex-wrap gap-2 justify-center max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              {FAQ_CHIPS.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(chip)}
                  className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-green-200 hover:border-green-400 hover:bg-white text-gray-700 text-sm font-medium rounded-full shadow-sm transition-all hover:shadow-md"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── CHAT MESSAGES ─── */}
        {hasStarted && (
          <div className="flex-1 w-full max-w-2xl overflow-y-auto px-4 pt-16 pb-40 flex flex-col gap-6 scroll-smooth">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="shrink-0 mt-auto mb-1">
                  {msg.role === 'user' ? (
                    <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center shadow">
                      <span className="text-white text-xs font-bold">U</span>
                    </div>
                  ) : (
                    <NyayaAvatar state="idle" />
                  )}
                </div>
                <div className={`px-5 py-3.5 max-w-[80%] text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-gray-900 text-white rounded-3xl rounded-br-sm'
                    : 'bg-white/90 backdrop-blur-sm text-gray-800 rounded-3xl rounded-bl-sm border border-green-100'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 flex-row animate-in fade-in duration-300">
                <NyayaAvatar state="typing" />
                <div className="px-5 py-4 bg-white/90 backdrop-blur-sm border border-green-100 rounded-3xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>
        )}

        {/* ─── FLOATING DARK INPUT BAR (screenshot style) ─── */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center px-4 z-20">
          <div className="w-full max-w-2xl bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
            {/* Text input row */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "Listening..." : "Type your message here..."}
              disabled={isListening}
              className="w-full bg-transparent text-white placeholder:text-gray-400 text-[15px] px-5 pt-4 pb-2 focus:outline-none disabled:opacity-60"
            />

            {/* Bottom toolbar row */}
            <div className="flex items-center justify-between px-4 pb-3 pt-1">
              <div className="flex items-center gap-3 text-gray-400">
                <button className="hover:text-white transition-colors"><Paperclip size={18} /></button>
                <button className="hover:text-white transition-colors"><Globe size={18} /></button>
                <button className="hover:text-white transition-colors"><Smile size={18} /></button>
                <span className="w-px h-4 bg-gray-600" />
                <button className="hover:text-white transition-colors"><FolderOpen size={18} /></button>
              </div>

              {/* Mic / Send button */}
              {inputValue.trim() ? (
                <button
                  onClick={() => handleSend()}
                  className="w-9 h-9 bg-green-500 hover:bg-green-400 text-white rounded-full flex items-center justify-center shadow-md transition-all"
                >
                  <Send size={15} className="-mr-0.5 mt-0.5" />
                </button>
              ) : (
                <button
                  onClick={handleMicClick}
                  className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${
                    isListening ? 'bg-red-500 animate-pulse' : 'bg-white text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Mic size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </ProtectedRoute>
  );
}
