import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ReportResponse } from "../types/report";
import { API_BASE } from "../api/config";

interface CompanyCoachChatProps {
  company: string;
  report: ReportResponse;
}

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export function CompanyCoachChat({ company, report }: CompanyCoachChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !report) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/coach/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          profile: report.profile,
          insights: report.insights,
          interview_preparation: report.interview_preparation,
          recommendations: report.recommendations,
          message: `Regarding ${company}: ${userMessage.content}`,
          conversation: messages
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to AI Coach");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              
              try {
                const parsed = JSON.parse(data);
                if (parsed.error) {
                  assistantMessage = `*Error:* ${parsed.error}`;
                } else if (parsed.text) {
                  assistantMessage += parsed.text;
                }
                
                setMessages((prev) => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1].content = assistantMessage;
                  return newMsgs;
                });
              } catch (e) {
                // Ignore parse errors on incomplete chunks
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "*Sorry, I encountered an error connecting to the AI.*" }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="company-coach-chat">
      <div className="chat-messages" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="chat-empty-state">
            <Bot size={48} />
            <h3>Your {company} AI Coach</h3>
            <p>Ask me anything about preparing for {company}. I have full access to your topic coverage, gaps, and {company}'s interview patterns.</p>
            <div className="chat-suggestions">
              <button onClick={() => setInput(`Why is my ${company} readiness score what it is?`)}>Why is my score what it is?</button>
              <button onClick={() => setInput(`What should I study next to crack ${company}?`)}>What should I study next?</button>
            </div>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message chat-message--${msg.role}`}>
            <div className="chat-message__avatar">
              {msg.role === "assistant" ? <Bot size={20} /> : <User size={20} />}
            </div>
            <div className="chat-message__content">
              {msg.role === "assistant" ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="chat-message chat-message--assistant">
             <div className="chat-message__avatar"><Bot size={20} /></div>
             <div className="chat-message__content"><Loader2 className="spin" size={20} /></div>
          </div>
        )}
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${company} interviews...`}
          disabled={isTyping}
        />
        <button type="submit" disabled={isTyping || !input.trim()}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
