import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ArrowLeft, Send, Mic, Paperclip, Globe, Smile, FolderOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

// Smiley-orbit animated icon with advanced states
const NyayaAvatar = ({ size = 48, state = 'idle' }: { size?: number, state?: 'idle' | 'typing' | 'listening' }) => {
  const orbitAnim = state === 'listening' ? 'orbit-pulse 1s ease-in-out infinite' : 'orbit-spin 3s linear infinite';
  const faceAnim = state === 'idle' ? 'look-around 6s ease-in-out infinite' :
                   state === 'typing' ? 'reading 1.5s ease-in-out infinite' : 'none';

  return (
    <span className="inline-flex items-center justify-center relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        {/* Main Body */}
        <circle cx="24" cy="24" r="16" fill="#00F5A0"/>
        
        {/* Face Group */}
        <g style={{ animation: faceAnim }}>
          <circle cx="19" cy="21" r="2" fill="#111"/>
          <circle cx="29" cy="21" r="2" fill="#111"/>
          
          {/* Glasses (Only when answering/typing) */}
          {state === 'typing' && (
            <g>
              <rect x="14" y="16" width="10" height="10" rx="2.5" stroke="#111" strokeWidth="2.5" fill="rgba(255,255,255,0.4)" />
              <rect x="24" y="16" width="10" height="10" rx="2.5" stroke="#111" strokeWidth="2.5" fill="rgba(255,255,255,0.4)" />
              <path d="M10 21 L14 21 M34 21 L38 21" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}

          {/* Smile (Hidden when typing, document covers mouth area) */}
          {state !== 'typing' && (
            <path d="M19 27 Q24 32 29 27" stroke="#111" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          )}
        </g>

        {/* Orbit Group */}
        <g style={{ transformOrigin: '24px 24px', animation: orbitAnim }}>
          <path d="M8 26 Q5 14 18 9" stroke="#111" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <path d="M36 9 Q47 18 40 30" stroke="#111" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <path d="M38 32 L40 30 L36 30" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </g>

        {/* Document + Hands holding it (Only when answering/typing) */}
        {state === 'typing' && (
          <g style={{ animation: 'doc-bob 2s ease-in-out infinite' }}>
            {/* Paper */}
            <rect x="13" y="28" width="22" height="20" fill="#fff" stroke="#111" strokeWidth="2" rx="2" />
            {/* Lines */}
            <path d="M17 34 L31 34 M17 39 L31 39 M17 44 L25 44" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
            {/* Left Hand */}
            <circle cx="13" cy="38" r="3.5" fill="#00F5A0" stroke="#111" strokeWidth="2" />
            {/* Right Hand */}
            <circle cx="35" cy="38" r="3.5" fill="#00F5A0" stroke="#111" strokeWidth="2" />
          </g>
        )}
      </svg>
      <style>{`
        @keyframes orbit-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes orbit-pulse { 0%, 100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        @keyframes doc-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        @keyframes look-around {
          0%, 100% { transform: translate(0, 0); }
          10%, 20% { transform: translate(2px, -2px); }
          30%, 40% { transform: translate(-2px, 1px); }
          50%, 60% { transform: translate(3px, 0px); }
          70% { transform: translate(0px, 0px); }
          80%, 90% { transform: translate(0px, 2px); }
        }
        @keyframes reading {
          0%, 100% { transform: translate(-2px, 0); }
          25% { transform: translate(0px, 0); }
          50% { transform: translate(2px, 0); }
          75% { transform: translate(0px, 0); }
        }
      `}</style>
    </span>
  );
};
export default function ToolkitPage() {
  const { t } = useTranslation(undefined, { keyPrefix: 'ai' });
  
  const FAQ_CHIPS = [
    { key: "faq1", query: "What is the RTI deadline?" },
    { key: "faq2", query: "How to file a First Appeal?" },
    { key: "faq3", query: "Is RTI free for BPL citizens?" },
    { key: "faq4", query: "Can RTI be filed online?" },
    { key: "faq5", query: "What if no reply in 30 days?" },
    { key: "faq6", query: "Which authority to contact?" },
  ];

  const MOCK_ANSWERS: Record<string, string> = {
    "faq1": t("ans1"),
    "faq2": t("ans2"),
    "faq3": t("ans3"),
    "faq4": t("ans4"),
    "faq5": t("ans5"),
    "faq6": t("ans6")
  };

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSend = (text: string = inputValue, answerKey?: string) => {
    if (!text.trim()) return;
    setHasStarted(true);
    setChatMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const response = answerKey ? MOCK_ANSWERS[answerKey] : t("defaultAns");
      setChatMessages(prev => [...prev, { role: 'ai', content: response }]);
      setIsTyping(false);
    }, 1800);
  };

  const agentState = isListening ? 'listening' : isTyping ? 'typing' : 'idle';

  const handleMicClick = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      handleSend(t("micQuery"), "faq5");
    }, 2200);
  };

  return (
    <ProtectedRoute>
      <div className="relative flex flex-col items-center h-[calc(100vh-4rem)] overflow-hidden">

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
              <NyayaAvatar size={96} state={agentState} />
              <div className="text-center">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{t("title")}</h1>
                <p className="text-sm text-gray-500 mt-1">{t("subtitle")}</p>
              </div>
            </div>

            {/* FAQ chips */}
            <div className="flex flex-wrap gap-2 justify-center max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              {FAQ_CHIPS.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(t(chip.key), chip.key)}
                  className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-green-200 hover:border-green-400 hover:bg-white text-gray-700 text-sm font-medium rounded-full shadow-sm transition-all hover:shadow-md"
                >
                  {t(chip.key)}
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
                    <NyayaAvatar size={32} state="idle" />
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
                <NyayaAvatar size={32} state="typing" />
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
              placeholder={isListening ? t("listening") : t("placeholder")}
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
