"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { apiService, DEMO_EVENT_ID } from "@/services/api";
import { ChatMessage } from "@/types";
import { Sparkles, Send, Mic, RefreshCw, Bot, User, CheckCircle2 } from "lucide-react";

export default function CopilotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "assistant",
      agent_name: "EventPlannerAgent",
      content: "Namaste! I am your Eventora AI Copilot, orchestrating with 8 specialized agents (Budget, Cultural Intelligence, Vendor Negotiation, Seating, Risk & Contingency). How can I assist your celebration preparations today?",
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestedPrompts = [
    "Increase my wedding guest count from 250 to 350.",
    "My decoration vendor cancelled. What should we do?",
    "Reduce my budget by ₹2 lakh and optimize floral spend.",
    "Suggest traditional Maharashtrian sweets for the banquet."
  ];

  async function handleSend(textToSend?: string) {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: query,
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await apiService.chatWithCopilot(DEMO_EVENT_ID, query);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        agent_name: res.agent_name || "EventPlannerAgent",
        content: res.reply,
        created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto h-[calc(100vh-8.5rem)] flex flex-col bg-white rounded-3xl border border-[#EEE7F3] shadow-md overflow-hidden">
        {/* Copilot Header */}
        <div className="p-5 bg-gradient-to-r from-[#54265F] to-[#75458B] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F3E5C8] flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-[#54265F]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold">Eventora AI Copilot</h2>
                <span className="text-[10px] bg-[#31966A] text-white font-bold px-2 py-0.5 rounded-full">
                  Multi-Agent Sync
                </span>
              </div>
              <p className="text-xs text-[#EEE7F3]/80">Connected to Database & Event Context (Priyanka & Rohan)</p>
            </div>
          </div>
          <button 
            onClick={() => setMessages([messages[0]])}
            className="p-2 text-[#EEE7F3]/80 hover:text-white hover:bg-white/10 rounded-xl transition"
            title="Reset Chat"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#FFFDF9]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.sender === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-[#54265F] text-[#F3E5C8] flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[80%] rounded-2xl p-4 space-y-1.5 shadow-xs ${
                m.sender === "user"
                  ? "bg-[#54265F] text-white rounded-tr-none"
                  : "bg-white border border-[#EEE7F3] text-[#25212A] rounded-tl-none"
              }`}>
                {m.sender === "assistant" && m.agent_name && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#75458B] uppercase tracking-wider pb-1 border-b border-[#EEE7F3]">
                    <Sparkles className="w-3 h-3 text-[#C58B76]" />
                    {m.agent_name}
                  </div>
                )}
                <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                  {m.content}
                </div>
                <div className={`text-[10px] text-right ${m.sender === "user" ? "text-white/70" : "text-gray-400"}`}>
                  {m.created_at}
                </div>
              </div>

              {m.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-[#75458B] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-xs text-gray-500 italic p-3 bg-[#F8F4FA] rounded-2xl w-fit">
              <Sparkles className="w-4 h-4 text-[#75458B] animate-spin" />
              <span>Orchestrating agents and recalculating event dependencies...</span>
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        <div className="px-6 py-2.5 bg-white border-t border-[#EEE7F3] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-semibold text-gray-400 text-[11px] whitespace-nowrap">Suggested:</span>
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-3 py-1 bg-[#F8F4FA] hover:bg-[#EEE7F3] text-[#54265F] rounded-full whitespace-nowrap border border-[#EEE7F3] transition text-[11px]"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Controls */}
        <div className="p-4 bg-white border-t border-[#EEE7F3] flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your event instructions (e.g., 'Increase guest count to 350')..."
            className="flex-1 py-3 px-4 bg-[#FFFDF9] border border-[#EEE7F3] rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-[#75458B] transition"
          />
          <button 
            type="button" 
            title="Voice Input (Sarvam AI Ready)"
            className="p-3 text-gray-400 hover:text-[#54265F] bg-[#F8F4FA] rounded-2xl transition"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-3 gradient-ai-button rounded-2xl disabled:opacity-50 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}

