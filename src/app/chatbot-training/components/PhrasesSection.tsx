'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Tag, User, Bot, MessageSquare } from 'lucide-react';
import { TrainingPhrase, TrainingCategory } from '@/types';
import { createTrainingPhrase, updateTrainingPhrase, deleteTrainingPhrase } from '@/lib/api';

interface Props {
  phrases: TrainingPhrase[];
  categories: TrainingCategory[];
  selectedCategoryId: string;
  onCategoryChange: (id: string) => void;
  onRefresh: () => void;
}

export default function PhrasesSection({ phrases, categories, selectedCategoryId, onCategoryChange, onRefresh }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ category_id: '', intent: '', user_message: '', bot_response: '', keywords: '', priority: 0 });

  const resetForm = () => { setForm({ category_id: selectedCategoryId || '', intent: '', user_message: '', bot_response: '', keywords: '', priority: 0 }); setShowForm(false); setEditingId(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...form, keywords: form.keywords ? form.keywords.split(',').map((k) => k.trim()) : undefined };
      if (editingId) { await updateTrainingPhrase(editingId, payload); toast.success('Đã cập nhật'); }
      else { await createTrainingPhrase(payload); toast.success('Đã tạo'); }
      resetForm(); onRefresh();
    } catch { toast.error('Lỗi'); }
  };

  const handleEdit = (p: TrainingPhrase) => {
    setForm({ category_id: p.category_id, intent: p.intent, user_message: p.user_message, bot_response: p.bot_response, keywords: p.keywords?.join(', ') || '', priority: p.priority });
    setEditingId(p.id); setShowForm(true);
  };

  const handleDelete = async (id: string) => { if (!confirm('Xóa?')) return; try { await deleteTrainingPhrase(id); toast.success('Đã xóa'); onRefresh(); } catch { toast.error('Lỗi'); } };

  return (
    <div>
      <div className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center mb-6">
        <MessageSquare className="w-6 h-6 text-gray-400" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">Mẫu câu đào tạo</h1>
      <p className="text-base text-gray-600 leading-relaxed mb-6">
        Các cặp câu hỏi-trả lời mẫu giúp chatbot học cách phản hồi theo đúng intent.
      </p>

      <div className="flex items-center gap-3 mb-6">
        <select value={selectedCategoryId} onChange={(e) => onCategoryChange(e.target.value)} className="px-3.5 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#7F56D9] transition">
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="inline-flex items-center gap-2 px-4 py-2 bg-[#7F56D9] text-white text-sm font-medium rounded-lg hover:bg-[#6941C6] transition">
          <Plus className="w-4 h-4" /> Thêm mẫu câu
        </button>
      </div>

      <div className="border-t border-dashed border-gray-200 my-6" />

      {showForm && (
        <div className="border border-gray-200 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">{editingId ? 'Sửa mẫu câu' : 'Thêm mẫu câu mới'}</h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục</label>
                <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#7F56D9] focus:ring-1 focus:ring-[#7F56D9]" required>
                  <option value="">Chọn...</option>
                  {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Intent</label>
                <input type="text" value={form.intent} onChange={(e) => setForm({ ...form, intent: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#7F56D9] focus:ring-1 focus:ring-[#7F56D9]" placeholder="hoi_gia, dat_lich..." required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Câu hỏi (User)</label>
              <textarea value={form.user_message} onChange={(e) => setForm({ ...form, user_message: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#7F56D9] focus:ring-1 focus:ring-[#7F56D9] resize-none" rows={2} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Câu trả lời (Bot)</label>
              <textarea value={form.bot_response} onChange={(e) => setForm({ ...form, bot_response: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#7F56D9] focus:ring-1 focus:ring-[#7F56D9] resize-none" rows={3} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Keywords</label>
              <input type="text" value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#7F56D9] focus:ring-1 focus:ring-[#7F56D9]" placeholder="niềng răng, thời gian" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">{editingId ? 'Cập nhật' : 'Tạo mới'}</button>
              <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition">Hủy</button>
            </div>
          </form>
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-900 mb-4">Danh sách mẫu câu</h2>
      {phrases.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center">
          <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Chưa có mẫu câu nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {phrases.map((phrase) => (
            <div key={phrase.id} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition group">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-[#7F56D9] rounded-md text-xs font-medium">
                      <Tag className="w-3 h-3" /> {phrase.intent}
                    </span>
                    {phrase.category && <span className="text-xs text-gray-400">{phrase.category.name}</span>}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2.5">
                      <User className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-900">{phrase.user_message}</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Bot className="w-4 h-4 text-[#7F56D9] mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-600">{phrase.bot_response}</p>
                    </div>
                  </div>
                  {phrase.keywords && phrase.keywords.length > 0 && (
                    <div className="flex gap-1.5 mt-3 flex-wrap">
                      {phrase.keywords.map((kw, i) => (<span key={i} className="px-2 py-0.5 border border-gray-200 text-gray-500 rounded-md text-[11px]">{kw}</span>))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition ml-3">
                  <button onClick={() => handleEdit(phrase)} className="p-1.5 rounded-md text-gray-400 hover:text-[#7F56D9] hover:bg-purple-50"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(phrase.id)} className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
