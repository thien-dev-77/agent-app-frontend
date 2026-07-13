'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, HelpCircle, PlusIcon, MinusIcon } from 'lucide-react';
import { TrainingFAQ, TrainingCategory } from '@/types';
import { createTrainingFAQ, updateTrainingFAQ, deleteTrainingFAQ } from '@/lib/api';

interface Props {
  faqs: TrainingFAQ[];
  categories: TrainingCategory[];
  selectedCategoryId: string;
  onCategoryChange: (id: string) => void;
  onRefresh: () => void;
}

export default function FAQsSection({ faqs, categories, selectedCategoryId, onCategoryChange, onRefresh }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({ category_id: '', question: '', answer: '', related_questions: '', keywords: '', sort_order: 0 });

  const resetForm = () => { setForm({ category_id: selectedCategoryId || '', question: '', answer: '', related_questions: '', keywords: '', sort_order: 0 }); setShowForm(false); setEditingId(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...form, related_questions: form.related_questions ? form.related_questions.split('\n').map((q) => q.trim()).filter(Boolean) : undefined, keywords: form.keywords ? form.keywords.split(',').map((k) => k.trim()) : undefined };
      if (editingId) { await updateTrainingFAQ(editingId, payload); toast.success('Đã cập nhật'); } else { await createTrainingFAQ(payload); toast.success('Đã tạo'); }
      resetForm(); onRefresh();
    } catch { toast.error('Lỗi'); }
  };

  const handleEdit = (faq: TrainingFAQ) => {
    setForm({ category_id: faq.category_id, question: faq.question, answer: faq.answer, related_questions: faq.related_questions?.join('\n') || '', keywords: faq.keywords?.join(', ') || '', sort_order: faq.sort_order });
    setEditingId(faq.id); setShowForm(true);
  };

  const handleDelete = async (id: string) => { if (!confirm('Xóa?')) return; try { await deleteTrainingFAQ(id); toast.success('Đã xóa'); onRefresh(); } catch { toast.error('Lỗi'); } };

  return (
    <div>
      <div className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center mb-6">
        <HelpCircle className="w-6 h-6 text-gray-400" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">Câu hỏi thường gặp</h1>
      <p className="text-base text-gray-600 leading-relaxed mb-6">FAQ giúp chatbot trả lời nhanh các câu hỏi phổ biến nhất.</p>

      <div className="flex items-center gap-3 mb-6">
        <select value={selectedCategoryId} onChange={(e) => onCategoryChange(e.target.value)} className="px-3.5 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#7F56D9] transition">
          <option value="">Tất cả</option>
          {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="inline-flex items-center gap-2 px-4 py-2 bg-[#7F56D9] text-white text-sm font-medium rounded-lg hover:bg-[#6941C6] transition">
          <Plus className="w-4 h-4" /> Thêm FAQ
        </button>
      </div>

      <div className="border-t border-dashed border-gray-200 my-6" />

      {showForm && (
        <div className="border border-gray-200 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">{editingId ? 'Sửa FAQ' : 'Thêm FAQ'}</h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục</label>
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#7F56D9]" required>
                <option value="">Chọn...</option>
                {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Câu hỏi</label>
              <input type="text" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#7F56D9]" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Câu trả lời</label>
              <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#7F56D9] resize-none" rows={4} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Câu hỏi liên quan</label>
              <textarea value={form.related_questions} onChange={(e) => setForm({ ...form, related_questions: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#7F56D9] resize-none" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Keywords</label>
              <input type="text" value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#7F56D9]" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">{editingId ? 'Cập nhật' : 'Tạo mới'}</button>
              <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition">Hủy</button>
            </div>
          </form>
        </div>
      )}

      {/* FAQ Accordion */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Danh sách FAQ</h2>
      {faqs.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center">
          <HelpCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Chưa có FAQ nào</p>
        </div>
      ) : (
        <div className="space-y-0 border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200">
          {faqs.map((faq) => (
            <div key={faq.id}>
              <button
                className="flex items-center justify-between w-full px-5 py-4 text-left hover:bg-gray-50 transition"
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
              >
                <span className="text-sm font-medium text-gray-900 pr-4">{faq.question}</span>
                {expandedId === faq.id
                  ? <MinusIcon className="w-4 h-4 text-[#7F56D9] shrink-0" />
                  : <PlusIcon className="w-4 h-4 text-gray-400 shrink-0" />
                }
              </button>
              {expandedId === faq.id && (
                <div className="px-5 pb-4 bg-gray-50">
                  <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{faq.answer}</p>
                  {faq.related_questions && faq.related_questions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Câu hỏi tương tự</p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        {faq.related_questions.map((q, i) => (<li key={i}>• {q}</li>))}
                      </ul>
                    </div>
                  )}
                  {faq.keywords && faq.keywords.length > 0 && (
                    <div className="flex gap-1.5 mt-3 flex-wrap">
                      {faq.keywords.map((kw, i) => (<span key={i} className="px-2 py-0.5 border border-gray-200 bg-white text-gray-500 rounded-md text-[11px]">{kw}</span>))}
                    </div>
                  )}
                  <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-200">
                    <button onClick={() => handleEdit(faq)} className="p-1.5 rounded-md text-gray-400 hover:text-[#7F56D9] hover:bg-purple-50 transition"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(faq.id)} className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
