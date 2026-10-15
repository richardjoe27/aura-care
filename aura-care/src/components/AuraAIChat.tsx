"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  ShieldAlert,
  User,
  RefreshCw,
  Lock,
  Copy,
  Check,
  Zap,
  HelpCircle,
} from "lucide-react";
import { ChatMessage } from "../types/health";
import { generateAuraAIResponse } from "../utils/auraClinicalAI";

interface AuraAIChatProps {
  currentHeartRate?: number;
  connectedWatchName?: string;
}

// Helper to render markdown-like formatting (bold, italic, code, bullets)
function renderFormattedMessage(text: string) {
  const lines = text.split("\n");

  return lines.map((line, idx) => {
    // Empty line creates spacing
    if (!line.trim()) {
      return <div key={idx} className="h-2" />;
    }

    // Bullet point lines starting with • or -
    const isBullet = line.trim().startsWith("•") || line.trim().startsWith("-");
    const cleanLine = isBullet ? line.trim().replace(/^[•\-]\s*/, "") : line;

    // Parse inline bold **text**, code `text`, and italic *text*
    const parts: React.ReactNode[] = [];
    let remaining = cleanLine;
    let keyIdx = 0;

    // Regex for **bold**, `code`, and *italic*
    const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
    let match;
    let lastIndex = 0;

    while ((match = tokenRegex.exec(cleanLine)) !== null) {
      if (match.index > lastIndex) {
        parts.push(cleanLine.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith("**") && token.endsWith("**")) {
        parts.push(
          <strong key={keyIdx++} className="font-bold text-[#8AF5D0]">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith("`") && token.endsWith("`")) {
        parts.push(
          <code
            key={keyIdx++}
            className="px-1.5 py-0.5 rounded bg-[#071514] border border-[#2DD4BF]/30 font-mono text-[11px] text-[#2DD4BF]"
          >
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith("*") && token.endsWith("*")) {
        parts.push(
          <em key={keyIdx++} className="italic text-[#FAF8F2]/90">
            {token.slice(1, -1)}
          </em>
        );
      }
      lastIndex = tokenRegex.lastIndex;
    }
    if (lastIndex < cleanLine.length) {
      parts.push(cleanLine.substring(lastIndex));
    }

    if (isBullet) {
      return (
        <div key={idx} className="flex items-start gap-2 my-0.5 pl-1">
          <span className="text-[#2DD4BF] text-xs leading-relaxed select-none">•</span>
          <span className="flex-1">{parts}</span>
        </div>
      );
    }

    return (
      <div key={idx} className="my-0.5">
        {parts}
      </div>
    );
  });
}

export const AuraAIChat: React.FC<AuraAIChatProps> = ({
  currentHeartRate = 72,
  connectedWatchName = "Apple Watch Ultra 2",
}) => {
  const initialGreeting: ChatMessage = {
    id: "msg-1",
    sender: "aura-ai",
    text: `Hello Richard! I'm Aura AI, your universal clinical & general intelligence assistant. I'm connected to your live biometrics (${connectedWatchName}: ${currentHeartRate} BPM, BP: 118/76 mmHg) and an expansive knowledge base.\n\nYou can ask me **anything**—medical interpretations, science & physics, world trivia, math calculations, or completely random questions!`,
    timestamp: "Just now",
    suggestions: [
      "Why is the sky blue?",
      "What is photosynthesis?",
      "Calculate 15% of 850",
      "Interpret my recent lipid panel results",
      "How do airplanes fly?",
      "What is quantum computing?",
    ],
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Realistic fast AI thinking delay
    setTimeout(() => {
      const { reply, suggestions } = generateAuraAIResponse(text, {
        heartRate: currentHeartRate,
        connectedWatchName: connectedWatchName,
        patientName: "Richard",
        bloodPressure: "118/76 mmHg",
        spo2: 99,
      });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "aura-ai",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestions: suggestions,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([initialGreeting]);
  };

  return (
    <div className="flex flex-col h-[700px] aura-glass rounded-3xl border border-[#2DD4BF]/25 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2DD4BF]/15 bg-[#071514]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0B2523] via-[#2DD4BF] to-[#8AF5D0] p-0.5 shadow-md shadow-[#2DD4BF]/20">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#071514]">
              <Bot className="h-5 w-5 text-[#8AF5D0]" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8AF5D0] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2DD4BF]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold font-heading text-[#FAF8F2]">Aura Universal AI</h3>
              <span className="rounded-full bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 px-2 py-0.5 text-[9px] font-extrabold text-[#8AF5D0]">
                MODEL 2.5 COGNITIVE
              </span>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-300 hidden sm:inline-block">
                ⚡ Synced: {currentHeartRate} BPM
              </span>
            </div>
            <p className="text-[11px] text-[#9AAEAA]">
              Answers any clinical, scientific, mathematical, or random everyday question
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleClearChat}
            title="Reset conversation"
            className="flex items-center gap-1.5 text-[11px] text-[#9AAEAA] hover:text-[#FAF8F2] bg-[#0B2523] border border-[#2DD4BF]/20 px-3 py-1 rounded-full transition"
          >
            <RefreshCw className="h-3 w-3" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>

          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-[#A8C8B8] aura-glass px-3 py-1 rounded-full border border-[#2DD4BF]/20">
            <Lock className="h-3 w-3 text-[#2DD4BF]" />
            <span>Encrypted Session</span>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed relative group ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-[#2DD4BF] to-[#8AF5D0] text-[#071514] font-semibold shadow-md shadow-[#2DD4BF]/20 rounded-br-none"
                  : "aura-glass text-[#FAF8F2] border border-[#2DD4BF]/25 shadow-lg rounded-bl-none"
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="font-extrabold uppercase text-[10px] tracking-wider opacity-70">
                  {msg.sender === "user" ? "Richard Joel (Patient)" : "Aura AI Assistant"}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] opacity-60 font-mono">{msg.timestamp}</span>
                  {msg.sender !== "user" && (
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      title="Copy response"
                      className="opacity-0 group-hover:opacity-100 transition text-[#9AAEAA] hover:text-[#FAF8F2]"
                    >
                      {copiedId === msg.id ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Formatted Message Body */}
              <div className="mt-1">
                {msg.sender === "user" ? msg.text : renderFormattedMessage(msg.text)}
              </div>
            </div>

            {/* Contextual Suggestions Chips */}
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-2 max-w-[85%]">
                {msg.suggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(sug)}
                    className="flex items-center gap-1.5 rounded-full bg-[#071514]/90 border border-[#2DD4BF]/25 px-3 py-1 text-[11px] font-semibold text-[#8AF5D0] hover:bg-[#2DD4BF] hover:text-[#071514] transition shadow-sm cursor-pointer"
                  >
                    <Sparkles className="h-3 w-3 text-[#2DD4BF]" />
                    <span>{sug}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2.5 p-3.5 aura-glass rounded-2xl w-max border border-[#2DD4BF]/25 shadow-lg">
            <Bot className="h-4 w-4 text-[#8AF5D0] animate-bounce" />
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#2DD4BF] animate-ping" />
              <span className="h-2 w-2 rounded-full bg-[#8AF5D0] animate-pulse" />
              <span className="h-2 w-2 rounded-full bg-[#2DD4BF]" />
            </div>
            <span className="text-[11px] text-[#8AF5D0] font-mono">Synthesizing intelligence...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Safety Notice Footer */}
      <div className="px-6 py-2 bg-[#071514]/90 border-t border-[#2DD4BF]/10 flex items-center justify-between text-[10px] text-[#9AAEAA]">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span>
            Aura AI answers any health or universal inquiry. For acute life-threatening situations, use Emergency SOS.
          </span>
        </div>
        <span className="hidden sm:inline font-mono text-[9px] text-[#2DD4BF]">
          Watch: {connectedWatchName}
        </span>
      </div>

      {/* Input Tray */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 sm:p-4 bg-[#071514] border-t border-[#2DD4BF]/20 flex items-center gap-3"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask anything: 'Why is the sky blue?', '15% of 850', 'How do planes fly?', symptoms..."
          className="flex-1 rounded-2xl bg-[#0B2523] border border-[#2DD4BF]/20 px-4 py-3 text-xs text-[#FAF8F2] placeholder-[#9AAEAA]/60 focus:border-[#2DD4BF] focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#2DD4BF] to-[#8AF5D0] px-5 py-3 text-xs font-black text-[#071514] shadow-md shadow-[#2DD4BF]/25 transition hover:scale-105 disabled:opacity-40 cursor-pointer"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
