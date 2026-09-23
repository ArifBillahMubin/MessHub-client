import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { MessageCircle, Send, X, Bot, ArrowUpRight } from "lucide-react";
import {
  SUGGESTED_QUESTIONS,
  WELCOME_MESSAGE,
  getBotReply,
} from "../../data/chatbotKnowledge";

const VisitorChatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    { id: "welcome", role: "bot", ...WELCOME_MESSAGE },
  ]);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 180);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const pushBotReply = (text) => {
    setTyping(true);
    const reply = getBotReply(text);
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-bot`, role: "bot", ...reply },
      ]);
      setTyping(false);
    }, 420);
  };

  const handleSend = (text) => {
    const value = (text ?? input).trim();
    if (!value || typing) return;

    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-user`, role: "user", answer: value, links: [] },
    ]);
    setInput("");
    pushBotReply(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSend();
  };

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3 font-sans">
      {open && (
        <section
          aria-label="MessHub visitor assistant"
          className="flex h-[min(560px,72vh)] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl border border-primary/15 bg-white shadow-[0_18px_50px_rgba(23,59,58,0.22)]"
        >
          <header className="flex items-center justify-between bg-gradient-to-r from-primary to-[#085f5d] px-4 py-3.5 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
                <Bot size={20} />
              </span>
              <div>
                <p className="text-sm font-extrabold leading-tight">MessHub Guide</p>
                <p className="text-[11px] font-medium text-white/80">Ask anything about this site</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 transition hover:bg-white/15"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#f4fbfb] px-3.5 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-6 ${
                    message.role === "user"
                      ? "rounded-br-md bg-primary text-white"
                      : "rounded-bl-md border border-primary/10 bg-white text-neutral shadow-sm"
                  }`}
                >
                  <p>{message.answer}</p>
                  {message.role === "bot" && message.links?.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {message.links.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => setOpen(false)}
                          className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-background px-2.5 py-1 text-[11px] font-bold text-primary transition hover:bg-primary hover:text-white"
                        >
                          {link.label}
                          <ArrowUpRight size={12} />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-primary/10 bg-white px-3.5 py-2.5 text-primary shadow-sm">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                  </span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-primary/10 bg-white px-3 pb-2 pt-2">
            <div className="mb-2 flex gap-1.5 overflow-x-auto pb-1">
              {SUGGESTED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => handleSend(question)}
                  className="shrink-0 rounded-full border border-primary/15 bg-background px-3 py-1 text-[11px] font-semibold text-primary transition hover:border-primary/40"
                >
                  {question}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex items-center gap-2 pb-1">
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about MessHub..."
                className="h-11 flex-1 rounded-full border border-primary/15 bg-background/60 px-4 text-sm text-neutral outline-none transition placeholder:text-neutral/45 focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-[0_6px_16px_rgba(0,107,104,0.28)] transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_10px_28px_rgba(0,107,104,0.38)] transition hover:-translate-y-0.5 hover:bg-primary/90"
        aria-label={open ? "Close MessHub guide" : "Open MessHub guide"}
      >
        {open ? <X size={22} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default VisitorChatbot;
