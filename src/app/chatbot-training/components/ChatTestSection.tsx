'use client';

import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Send, Trash2, User, Bot, Loader2, FlaskConical } from 'lucide-react';
import { chatWithBot } from '@/lib/api';
import { TrainingStats } from '@/types';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Props {
  stats: TrainingStats | null;
}

export default function ChatTestSection({ stats }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setMessages((prev) => [...prev, { role: 'user', content: msg, timestamp: new Date() }]);
    setInput('');
    setLoading(true);
    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const { reply } = await chatWithBot({ message: msg, history });
      setMessages((prev) => [...prev, { role: 'assistant', content: reply, timestamp: new Date() }]);
    } catch { toast.error('Chatbot không phản hồi'); }
    finally { setLoading(false); inputRef.current?.focus(); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  const totalTraining = stats ? stats.phrases + stats.scenarios + stats.faqs : 0;

  return (
    <div>
      <div className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center mb-6">
        <FlaskConical className="w-6 h-6 text-gray-400" />
      </div>

      <div className="flex items-center justify-between mb-3">
        <h1 className="text-3xl font-bold text-gray-900">Test Chatbot AI</h1>
        <button onClick={() => setMessages([])} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-gray-400 transition">
          <Trash2 className="w-3.5 h-3.5" /> Xóa chat
        </button>
      </div>
      <p className="text-base text-gray-600 leading-relaxed mb-6">
        Chat trực tiếp để test chatbot. AI sẽ trả lời dựa trên {totalTraining} mục dữ liệu đào tạo. Model: GPT-4o-mini.
      </p>

      <div className="border-t border-dashed border-gray-200 my-6" />

      {/* Chat Window */}
      <div className="border border-gray-200 rounded-xl overflow-hidden" style={{ height: 'calc(100vh - 380px)' }}>
        {/* Messages */}
        <div className="h-[calc(100%-72px)] overflow-y-auto p-5 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
                <Bot className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">Chatbot sẵn sàng</p>
              <p className="text-xs text-gray-500 max-w-sm mb-5">Gửi tin nhắn để test</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Niềng răng mất bao lâu?', 'Chi phí bao nhiêu?', 'Có đau không?'].map((s) => (
                  <button key={s} onClick={() => { setInput(s); inputRef.current?.focus(); }} className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs rounded-lg hover:border-[#7F56D9] hover:text-[#7F56D9] transition">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start gap-2.5 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-gray-900' : 'bg-[#7F56D9]'}`}>
                  {msg.role === 'user' ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className={`rounded-xl px-4 py-2.5 ${msg.role === 'user' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#7F56D9] flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-gray-100 rounded-xl px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-[#7F56D9]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="h-[72px] border-t border-gray-200 flex items-center gap-3 px-4">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm resize-none outline-none focus:border-[#7F56D9] focus:ring-1 focus:ring-[#7F56D9] transition"
            rows={1}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-2.5 bg-[#7F56D9] text-white rounded-lg hover:bg-[#6941C6] disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
