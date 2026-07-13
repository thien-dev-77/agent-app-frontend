'use client';

import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Send, Bot, Loader2, Paperclip, RefreshCw } from 'lucide-react';
import { chatWithBot, getChatSuggestions } from '@/lib/api';

// Regex detect image URLs
const IMAGE_URL_REGEX = /(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif|webp|svg)(?:\?[^\s]*)?)/gi;

function MessageContent({ content, isUser }: { content: string; isUser: boolean }) {
  const imageUrls = content.match(IMAGE_URL_REGEX);

  if (!imageUrls || imageUrls.length === 0) {
    return <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>;
  }

  const parts: { type: 'text' | 'image'; value: string }[] = [];
  let remaining = content;

  imageUrls.forEach((url) => {
    const idx = remaining.indexOf(url);
    if (idx > 0) {
      parts.push({ type: 'text', value: remaining.slice(0, idx).trim() });
    }
    parts.push({ type: 'image', value: url });
    remaining = remaining.slice(idx + url.length);
  });
  if (remaining.trim()) {
    parts.push({ type: 'text', value: remaining.trim() });
  }

  return (
    <div className="space-y-2">
      {parts.map((part, i) => {
        if (part.type === 'image') {
          return (
            <div key={i} className="rounded-lg overflow-hidden">
              <img
                src={part.value}
                alt="Hình ảnh tham khảo"
                className="w-full max-w-[280px] h-auto rounded-lg"
                style={{ border: '1px solid var(--border)' }}
                loading="lazy"
              />
            </div>
          );
        }
        return (
          <p key={i} className="text-sm whitespace-pre-wrap leading-relaxed">
            {part.value}
          </p>
        );
      })}
    </div>
  );
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  promptContent: string;
  model: string;
  autoSuggest?: boolean;
}

export default function ChatPreview({ promptContent, model, autoSuggest = false }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, suggestions]);

  const fetchSuggestions = async (history: ChatMessage[]) => {
    if (!autoSuggest || history.length === 0) return;
    setLoadingSuggestions(true);
    try {
      const { suggestions: newSuggestions } = await getChatSuggestions(
        history.map((m) => ({ role: m.role, content: m.content }))
      );
      setSuggestions(newSuggestions);
    } catch {
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSend = async (msg?: string) => {
    const text = (msg || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setSuggestions([]);
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const { reply } = await chatWithBot({ message: text, history });
      const updatedMessages = [...newMessages, { role: 'assistant' as const, content: reply }];
      setMessages(updatedMessages);

      if (autoSuggest) {
        fetchSuggestions(updatedMessages);
      }
    } catch {
      toast.error('Bot không phản hồi');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const handleClearChat = () => {
    setMessages([]);
    setSuggestions([]);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-primary)' }}>
      {/* Chat header */}
      <div 
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
          >
            <Bot className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Chat Preview
            </p>
            <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
              Test chatbot của bạn
            </p>
          </div>
        </div>
        <button 
          onClick={handleClearChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition hover:bg-[var(--bg-hover)]"
          style={{ color: 'var(--text-secondary)' }}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: 'var(--bg-elevated)' }}
            >
              <Bot className="w-8 h-8" style={{ color: 'var(--accent)' }} />
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Bắt đầu cuộc trò chuyện
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
              Gửi tin nhắn để test chatbot
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                msg.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'
              }`}
              style={{
                background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-surface)',
                color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
              }}
            >
              <MessageContent content={msg.content} isUser={msg.role === 'user'} />
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div 
              className="rounded-2xl rounded-bl-md px-4 py-3"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-1.5">
                <div 
                  className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ background: 'var(--text-tertiary)', animationDelay: '0ms' }}
                />
                <div 
                  className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ background: 'var(--text-tertiary)', animationDelay: '150ms' }}
                />
                <div 
                  className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ background: 'var(--text-tertiary)', animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Auto Suggestions */}
        {!loading && suggestions.length > 0 && (
          <div className="flex flex-col gap-2 pt-1 pl-9">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(s)}
                className="flex items-center justify-between w-full text-left px-4 py-3 rounded-xl text-sm transition"
                style={{ 
                  background: 'var(--bg-surface)', 
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)'
                }}
              >
                <span>{s}</span>
                <span style={{ color: 'var(--text-tertiary)' }} className="ml-3 shrink-0">→</span>
              </button>
            ))}
          </div>
        )}

        {loadingSuggestions && (
          <div className="flex items-center gap-2 pt-2 pl-9">
            <Loader2 className="w-3 h-3 animate-spin" style={{ color: 'var(--text-tertiary)' }} />
            <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
              Đang tạo gợi ý...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <button 
            className="p-2 transition hover:bg-[var(--bg-hover)] rounded-lg"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Gửi tin nhắn..."
            className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none transition"
            style={{ 
              background: 'var(--bg-surface)', 
              border: '1px solid var(--border)',
              color: 'var(--text-primary)'
            }}
            disabled={loading}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
