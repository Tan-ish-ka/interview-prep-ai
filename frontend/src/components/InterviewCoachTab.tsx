import { useState, useEffect, useRef } from "react";
import {
  Send,
  Bot,
  Sparkles,
  RefreshCw,
  Trash2,
  BookOpen,
  Compass,
  Zap,
  AlertTriangle
} from "lucide-react";
import type { ReportResponse } from "../types/report";
import { streamCoachChat, type ConversationMessage } from "../api/coach";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface InterviewCoachTabProps {
  report: ReportResponse;
}

const QUICK_PROMPTS = [
  {
    icon: Zap,
    text: "Assess my FAANG readiness",
    prompt: "Based on my competitive programming stats, what is my readiness level for top tech companies like Google, Meta, and Amazon, and what are my critical gaps?",
    color: "#a855f7"
  },
  {
    icon: AlertTriangle,
    text: "How to fix my weak topics?",
    prompt: "I want to improve my weak topics. Can you give me a structured practice strategy and list specific types of problems I should solve first?",
    color: "#f43f5e"
  },
  {
    icon: BookOpen,
    text: "Create a 4-week roadmap",
    prompt: "Design a customized 4-week study plan targeting my weaknesses and aligning with my current platform statistics to prepare for coding interviews.",
    color: "#22d3ee"
  },
  {
    icon: Compass,
    text: "Review my top tags & skill",
    prompt: "Analyze my top tags and stats, explain my strengths, and tell me how I can leverage my competitive programming skills in actual software engineering interviews.",
    color: "#34d399"
  }
];

export function InterviewCoachTab({ report }: InterviewCoachTabProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize with a welcoming message personalized with report details
  useEffect(() => {
    const defaultWelcome: ConversationMessage = {
      role: "assistant",
      content: `Hello **@${report.profile.username}**! I am your AI Interview Coach. 🤖✨

I've analyzed your **${report.profile.platform}** profile and live analytics:
* **Current Rating**: \`${report.insights.current_rating ?? "Unrated"}\` (Peak: \`${report.insights.max_rating ?? "Unrated"}\`)
* **Total Solved**: \`${report.insights.total_solved}\`
* **Skill Score**: \`${report.insights.skill_score}/100\`
* **Readiness Level**: \`${report.interview_preparation.interview_readiness_level || "Not Calculated"}\`

Your current weak topics are: **${report.insights.weak_topics.slice(0, 3).join(", ") || "None identified"}**.
Your strong areas include: **${report.insights.strong_topics.slice(0, 3).join(", ") || "None identified"}**.

Ask me anything about DSA questions, company readiness, designing system architectures, or creating detailed roadmaps!`
    };
    setMessages([defaultWelcome]);
  }, [report]);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Clean up streaming on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isStreaming) return;

    setError(null);
    setIsStreaming(true);

    const userMsg: ConversationMessage = {
      role: "user",
      content: textToSend.trim()
    };

    // Add user message immediately
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");

    // Add empty placeholder assistant message for streaming
    const assistantMsgIndex = updatedMessages.length;
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "" }
    ]);

    // Create abort controller
    abortControllerRef.current = new AbortController();

    let fullResponse = "";

    await streamCoachChat(
      {
        message: userMsg.content,
        profile: report.profile,
        insights: report.insights,
        recommendations: report.recommendations,
        interview_preparation: report.interview_preparation,
        conversation: messages, // Pass the history before the current message
      },
      (chunk) => {
        fullResponse += chunk;
        setMessages((prev) => {
          const next = [...prev];
          if (next[assistantMsgIndex]) {
            next[assistantMsgIndex] = {
              ...next[assistantMsgIndex],
              content: fullResponse
            };
          }
          return next;
        });
      },
      (err) => {
        setError(err);
        setIsStreaming(false);
        // Remove the empty/broken assistant message if it was untouched
        setMessages((prev) => {
          const next = [...prev];
          if (next[assistantMsgIndex] && next[assistantMsgIndex].content === "") {
            next.splice(assistantMsgIndex, 1);
          }
          return next;
        });
      },
      () => {
        setIsStreaming(false);
        abortControllerRef.current = null;
      },
      abortControllerRef.current.signal
    );
  };

  const handleClearChat = () => {
    if (isStreaming) {
      abortControllerRef.current?.abort();
      setIsStreaming(false);
    }
    const defaultWelcome: ConversationMessage = {
      role: "assistant",
      content: `Chat history cleared. How can I help you prepare today, **@${report.profile.username}**?`
    };
    setMessages([defaultWelcome]);
    setError(null);
  };

  return (
    <div className="coach-tab">
      <div className="coach-layout">
        {/* Left Panel: Sidebar */}
        <div className="coach-sidebar">
          <div className="coach-sidebar__header">
            <Sparkles size={18} style={{ color: "#c084fc" }} />
            <h3>Quick Start</h3>
          </div>
          <p className="coach-sidebar__desc">
            Select a topic below to automatically ask the coach using your profile insights.
          </p>
          <div className="coach-prompts">
            {QUICK_PROMPTS.map((qp, idx) => {
              const Icon = qp.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(qp.prompt)}
                  disabled={isStreaming}
                  className="coach-prompt-card"
                  style={{ "--card-accent": qp.color } as React.CSSProperties}
                >
                  <div className="coach-prompt-card__header">
                    <span className="coach-prompt-card__icon" style={{ backgroundColor: `${qp.color}15`, color: qp.color }}>
                      <Icon size={16} />
                    </span>
                    <span className="coach-prompt-card__title">{qp.text}</span>
                  </div>
                  <span className="coach-prompt-card__desc">{qp.prompt.slice(0, 75)}...</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Panel: Chat Panel */}
        <div className="coach-chat-panel">
          <div className="coach-chat-header">
            <div className="coach-chat-header__info">
              <Bot size={20} style={{ color: "#c084fc" }} />
              <div>
                <h4>Interview Coach</h4>
                <span className="coach-status">
                  <span className="coach-status__dot"></span>
                  Active & Profile-Aware
                </span>
              </div>
            </div>
            <button
              onClick={handleClearChat}
              className="coach-clear-btn"
              title="Reset conversation"
            >
              <Trash2 size={15} />
              <span>Clear Chat</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="coach-messages-area">
            {messages.map((msg, idx) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div
                  key={idx}
                  className={`coach-message-row ${
                    isAssistant ? "coach-message-row--assistant" : "coach-message-row--user"
                  }`}
                >
                  <div className="coach-avatar">
                    {isAssistant ? (
                      <Bot size={16} />
                    ) : (
                      <span className="user-avatar-char">
                        {report.profile.username.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="coach-message-bubble">
                    {msg.content === "" && isStreaming && idx === messages.length - 1 ? (
                      <div className="coach-typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    ) : (
                      <div className="markdown-content">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isStreaming && messages[messages.length - 1]?.content !== "" && (
              <div className="coach-streaming-cursor-row">
                <span className="coach-streaming-pulse"></span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Error display */}
          {error && (
            <div className="coach-error-bar">
              <div className="coach-error-bar__content">
                <strong>Error: </strong>
                <span>{error}</span>
              </div>
              <button onClick={() => setError(null)} className="coach-error-close">
                ×
              </button>
            </div>
          )}

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="coach-input-form"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your weaknesses, roadmap, or Google readiness..."
              disabled={isStreaming}
              className="coach-text-input"
            />
            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              className="coach-send-btn"
            >
              {isStreaming ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
