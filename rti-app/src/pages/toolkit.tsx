import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ArrowLeft, Send, Mic, Paperclip, Globe, Smile, FolderOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NyayaAvatar } from "@/components/NyayaAvatar";

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  isTypingEffect?: boolean;
}


// Typewriter component for AI responses
const TypewriterText = ({ text, onUpdate }: { text: string, onUpdate?: () => void }) => {
  const [displayed, setDisplayed] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setIsComplete(false);
    
    // Type 1 character every 15ms (approx 60 chars per second)
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.substring(0, i + 1));
        i++;
        if (i % 4 === 0 && onUpdate) onUpdate(); // Throttle scroll updates
      } else {
        setIsComplete(true);
        clearInterval(timer);
        if (onUpdate) onUpdate();
      }
    }, 15);

    return () => clearInterval(timer);
  }, [text]); // eslint-disable-line

  return (
    <span>
      {displayed}
      {!isComplete && <span className="inline-block w-1.5 h-3.5 ml-0.5 align-middle bg-gray-500 animate-pulse" />}
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
    setIsTyping(true); // AI enters reading/searching state

    // 3 seconds delay as requested before generating text
    setTimeout(() => {
      const response = answerKey ? MOCK_ANSWERS[answerKey] : t("defaultAns");
      setIsTyping(false); // AI finishes reading, goes back to idle state
      setChatMessages(prev => [...prev, { role: 'ai', content: response, isTypingEffect: true }]);
    }, 3000);
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

        {/* Back arrow — top left constrained */}
        <div className="absolute top-4 left-0 right-0 z-30 flex justify-center pointer-events-none px-4">
          <div className="w-full max-w-2xl flex justify-start">
            <Link to="/home" className="pointer-events-auto w-10 h-10 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-md text-gray-600 hover:bg-white shadow-sm transition-all border border-gray-200">
              <ArrowLeft size={20} />
            </Link>
          </div>
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
                  {msg.role === 'ai' && msg.isTypingEffect ? (
                    <TypewriterText 
                      text={msg.content} 
                      onUpdate={() => endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })} 
                    />
                  ) : (
                    msg.content
                  )}
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
