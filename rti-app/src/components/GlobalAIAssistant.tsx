import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Send, X, Camera } from "lucide-react";
import { NyayaAvatar } from "./NyayaAvatar";

const TypewriterText = ({ text, onUpdate }: { text: string, onUpdate?: () => void }) => {
  const [displayed, setDisplayed] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setIsComplete(false);
    
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.substring(0, i + 1));
        i++;
        if (i % 4 === 0 && onUpdate) onUpdate();
      } else {
        setIsComplete(true);
        clearInterval(timer);
        if (onUpdate) onUpdate();
      }
    }, 15);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <span>
      {displayed}
      {!isComplete && <span className="inline-block w-1.5 h-3.5 ml-0.5 align-middle bg-gray-500 animate-pulse" />}
    </span>
  );
};

export const GlobalAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'ai'|'system', content: string, isTypingEffect?: boolean}[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const location = useLocation();
  const endRef = useRef<HTMLDivElement>(null);
  
  // Exclude some pages if necessary, e.g., login, onboarding, or the main toolkit page
  const excludePages = ['/login', '/onboarding/location', '/onboarding/rights', '/toolkit'];
  if (excludePages.includes(location.pathname)) return null;

  useEffect(() => {
    // Randomly show tooltip
    const timer = setTimeout(() => {
      if (!isOpen) setShowTooltip(true);
    }, Math.random() * 5000 + 3000);
    
    return () => clearTimeout(timer);
  }, [location.pathname, isOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleOpen = () => {
    setIsOpen(true);
    setShowTooltip(false);
    if (messages.length === 0) {
      // Simulate taking a snapshot and understanding context
      let contextName = location.pathname.replace('/', '');
      if (contextName === '') contextName = 'home';
      
      setMessages([
        
        { role: 'ai', content: `Hi! I'm Nyaya AI. I see you're on the ${contextName} page. Do you need help with anything here?` }
      ]);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const text = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `Based on what I can see on this ${location.pathname.replace('/', '') || 'home'} page, here is a helpful answer to your question. Since I'm an AI, I've analyzed the layout, the current data, and the context of what you're trying to achieve right now. Is there any specific element you want me to explain?`,
        isTypingEffect: true 
      }]);
      setIsTyping(false);
    }, 3000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-green-100 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300" style={{ height: '400px' }}>
          
          {/* Header */}
          <div className="bg-gray-900 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <NyayaAvatar size={32} state="idle" />
              <div>
                <h3 className="text-white text-sm font-bold">Nyaya AI Context Helper</h3>
                <p className="text-gray-400 text-xs flex items-center gap-1">
                  <Camera size={10} /> Reading page context...
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'system' ? (
                  <div className="text-xs text-gray-400 italic text-center w-full my-2 bg-gray-100/50 rounded-lg p-2 flex items-center justify-center gap-1">
                    <Camera size={12} /> {msg.content}
                  </div>
                ) : (
                  <div className={`px-4 py-2.5 max-w-[85%] text-sm rounded-2xl shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-gray-900 text-white rounded-br-sm' 
                      : 'bg-white text-gray-800 border border-green-100 rounded-bl-sm'
                  }`}>
                    {msg.role === 'ai' && msg.isTypingEffect ? (
                      <TypewriterText text={msg.content} onUpdate={() => endRef.current?.scrollIntoView()} />
                    ) : (
                      msg.content
                    )}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2">
                <NyayaAvatar size={24} state="typing" />
                <div className="px-3 py-2.5 bg-white border border-green-100 rounded-2xl rounded-bl-sm shadow-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about this page..."
              className="flex-1 bg-gray-100 rounded-full px-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400/50"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center disabled:opacity-50 transition-all hover:bg-green-600 shadow-sm"
            >
              <Send size={14} className="-mr-0.5 mt-0.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button & Tooltip */}
      {!isOpen && (
        <div className="flex items-center gap-3">
          {showTooltip && (
            <div className="bg-gray-900 text-white text-sm px-4 py-2 rounded-xl shadow-lg relative animate-in fade-in slide-in-from-right-4">
              Need help?
              <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-gray-900 rotate-45 -translate-y-1/2" />
            </div>
          )}
          <button 
            onClick={handleOpen}
            className="w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-green-400 hover:scale-105 transition-transform"
          >
            <NyayaAvatar size={50} state="idle" />
          </button>
        </div>
      )}
    </div>
  );
};
