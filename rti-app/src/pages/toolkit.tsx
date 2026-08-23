import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ArrowLeft, Send, Mic, Paperclip, Globe, Smile, FolderOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RighteousAvatar } from "@/components/RighteousAvatar";
import { generateMRRighteousResponse, type ConversationTurn } from "@/lib/mrRighteous";

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  isTypingEffect?: boolean;
  screenshot?: string;
}


// ── Lightweight Markdown Renderer ─────────────────────────────────────────
const MarkdownMessage = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  const renderInline = (str: string, key: string | number): React.ReactNode => {
    // Process inline: **bold**, *italic*, `code`
    const parts = str.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
    return (
      <span key={key}>
        {parts.map((part, pi) => {
          if (part.startsWith('**') && part.endsWith('**'))
            return <strong key={pi} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
          if (part.startsWith('*') && part.endsWith('*'))
            return <em key={pi}>{part.slice(1, -1)}</em>;
          if (part.startsWith('`') && part.endsWith('`'))
            return <code key={pi} className="bg-gray-100 text-green-700 text-xs px-1.5 py-0.5 rounded font-mono">{part.slice(1, -1)}</code>;
          return part;
        })}
      </span>
    );
  };

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines (add small gap)
    if (line.trim() === '') {
      elements.push(<div key={`gap-${i}`} className="h-1.5" />);
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={i} className="border-gray-200 my-2" />);
      i++;
      continue;
    }

    // Table detection — starts with |
    if (line.trim().startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      // Filter out separator rows (|---|---|)
      const dataRows = tableLines.filter(l => !/^\s*\|[\s\-|]+\|\s*$/.test(l));
      if (dataRows.length > 0) {
        const parseRow = (row: string) =>
          row.split('|').map(c => c.trim()).filter(c => c !== '');
        const headers = parseRow(dataRows[0]);
        const bodyRows = dataRows.slice(1);
        elements.push(
          <div key={`table-${i}`} className="my-2 overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50">
                  {headers.map((h, hi) => (
                    <th key={hi} className="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-200 whitespace-nowrap">
                      {renderInline(h, hi)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    {parseRow(row).map((cell, ci) => (
                      <td key={ci} className="px-3 py-2 text-gray-700 border-b border-gray-100 align-top">
                        {renderInline(cell, ci)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // Heading: **Title** alone on a line
    if (/^\*\*[^*]+\*\*$/.test(line.trim()) || /^#{1,3}\s/.test(line.trim())) {
      const text = line.trim().replace(/^\*\*|\*\*$/g, '').replace(/^#+\s/, '');
      elements.push(
        <p key={i} className="font-bold text-gray-900 text-sm mt-2 mb-1">{text}</p>
      );
      i++;
      continue;
    }

    // Bullet list: starts with → or - or • or *
    if (/^(→|-|•|\*)\s/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^(→|-|•|\*)\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^(→|-|•|\*)\s/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-1.5 space-y-1">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-green-500 mt-0.5 shrink-0">→</span>
              <span>{renderInline(item, ii)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list: starts with 1. 2. etc.
    if (/^\d+\.\s/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-1.5 space-y-1 list-none">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-green-600 font-bold shrink-0 w-4">{ii + 1}.</span>
              <span>{renderInline(item, ii)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Normal paragraph
    elements.push(
      <p key={i} className="text-sm text-gray-700 leading-relaxed">
        {renderInline(line, i)}
      </p>
    );
    i++;
  }

  return <div className="flex flex-col gap-0.5">{elements}</div>;
};

// ── Typewriter with Markdown ───────────────────────────────────────────────
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
        if (i % 8 === 0 && onUpdate) onUpdate();
      } else {
        setIsComplete(true);
        clearInterval(timer);
        if (onUpdate) onUpdate();
      }
    }, 10);
    return () => clearInterval(timer);
  }, [text]); // eslint-disable-line

  return (
    <div>
      <MarkdownMessage text={displayed} />
      {!isComplete && <span className="inline-block w-1.5 h-3.5 ml-0.5 align-middle bg-gray-400 animate-pulse rounded-sm" />}
    </div>
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

  
  const location = useLocation();
  const sourcePage = location.state?.sourcePage;
  const screenshot = location.state?.screenshot;
  const initialMessage = location.state?.initialMessage;
const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    if (sourcePage) {
      return [{ 
        role: 'ai', 
        content: initialMessage || `I see you were looking at the **${sourcePage}** page. I have analyzed its context. How may I help you with it?`,
        isTypingEffect: true,
        screenshot: screenshot
      }];
    }
    return [];
  });
  
  const [hasStarted, setHasStarted] = useState(!!sourcePage);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSend = (text: string = inputValue, _answerKey?: string, directResponse?: string) => {
    if (!text.trim()) return;
    setHasStarted(true);

    const userMsg: ChatMessage = { role: 'user', content: text };
    setChatMessages(prev => {
      const updated = [...prev, userMsg];
      return updated;
    });
    setInputValue("");
    setIsTyping(true);

    // Build conversation history for AI context
    const historyForAI: ConversationTurn[] = chatMessages.map(m => ({
      role: m.role,
      content: m.content,
    }));

    setTimeout(() => {
      const response = directResponse
        ? directResponse
        : generateMRRighteousResponse(text, historyForAI);
      setIsTyping(false);
      setChatMessages(prev => [...prev, { role: 'ai', content: response, isTypingEffect: true }]);
    }, 1800 + Math.random() * 1000); // 1.8–2.8s for natural feel
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
              <RighteousAvatar size={96} state={agentState} />
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
                    <RighteousAvatar size={32} state="idle" />
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
                  ) : msg.role === 'ai' ? (
                    <MarkdownMessage text={msg.content} />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 flex-row animate-in fade-in duration-300">
                <RighteousAvatar size={32} state="typing" />
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
                <button onClick={() => handleSend("[Attached: File.pdf]", undefined, "I've received your document. I can use this to extract details or append it as an annexure to your RTI application.")} className="hover:text-white transition-colors" title="Attach Document"><Paperclip size={18} /></button>
                <button onClick={() => handleSend("Search for latest RTI rules", undefined, "Searching the web... According to the latest DoPT guidelines, the RTI application fee remains ₹10, but some states like Maharashtra charge ₹20 online.")} className="hover:text-white transition-colors" title="Web Search"><Globe size={18} /></button>
                <button onClick={() => handleSend("👍", undefined, "I'm glad I could help! Let me know if you need anything else.")} className="hover:text-white transition-colors" title="Emoji"><Smile size={18} /></button>
                <span className="w-px h-4 bg-gray-600" />
                <button onClick={() => handleSend("Import from DigiLocker", undefined, "Successfully connected to DigiLocker! I found your BPL Certificate. I will automatically attach it to waive your ₹10 RTI fee.")} className="hover:text-white transition-colors" title="Import DigiLocker"><FolderOpen size={18} /></button>
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
