'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Zap, User, Bot, Theater, CirclePlus, AlertTriangle } from 'lucide-react';
import { TrainingScenario, TrainingCategory, ConversationStep } from '@/types';
import { createTrainingScenario, updateTrainingScenario, deleteTrainingScenario } from '@/lib/api';

interface Props {
  scenarios: TrainingScenario[];
  categories: TrainingCategory[];
  selectedCategoryId: string;
  onCategoryChange: (id: string) => void;
  onRefresh: () => void;
}

export default function ScenariosSection({ scenarios, categories, selectedCategoryId, onCategoryChange, onRefresh }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ category_id: '', title: '', description: '', trigger_condition: '', severity: 'normal', resolution_guide: '', tags: '' });
  const [steps, setSteps] = useState<ConversationStep[]>([{ role: 'user', message: '' }, { role: 'bot', message: '' }]);

  const resetForm = () => { setForm({ category_id: selectedCategoryId || '', title: '', description: '', trigger_condition: '', severity: 'normal', resolution_guide: '', tags: '' }); setSteps([{ role: 'user', message: '' }, { role: 'bot', message: '' }]); setShowForm(false); setEditingId(null); };
  const addStep = () => { const last = steps[steps.length - 1]?.role || 'bot'; setSteps([...steps, { role: last === 'user' ? 'bot' : 'user', message: '' }]); };
  const removeStep = (i: number) => setSteps(steps.filter((_, idx) => idx !== i));
  const updateStep = (i: number, field: keyof ConversationStep, value: string) => { const n = [...steps]; n[i] = { ...n[i], [field]: value }; setSteps(n); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...form, conversation_flow: steps.filter((s) => s.message.trim()), tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : undefined };
      if (editingId) { await updateTrainingScenario(editingId, payload); toast.success('Đã cập nhật'); } else { await createTrainingScenario(payload); toast.success('Đã tạo'); }
      resetForm(); onRefresh();
    } catch { toast.error('Lỗi'); }
  };

  const handleEdit = (s: TrainingScenario) => {
    setForm({ category_id: s.category_id, title: s.title, description: s.description || '', trigger_condition: s.trigger_condition, severity: s.severity, resolution_guide: s.resolution_guide || '', tags: s.tags?.join(', ') || '' });
    setSteps(Array.isArray(s.conversation_flow) && s.conversation_flow.length > 0 ? (s.conversation_flow as ConversationStep[]) : [{ role: 'user', message: '' }, { role: 'bot', message: '' }]);
    setEditingId(s.id); setShowForm(true);
  };

  const handleDelete = async (id: string) => { if (!confirm('Xóa?')) return; try { await deleteTrainingScenario(id); toast.success('Đã xóa'); onRefresh(); } catch { toast.error('Lỗi'); } };

  return (
    <div>
      <div className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center mb-6">
        <Theater className="w-6 h-6 text-gray-400" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">Tình huống xử lý</h1>
      <p className="text-base text-gray-600 leading-relaxed mb-6">Kịch bản hội thoại phức tạp. Chatbot sẽ dựa vào trigger condition để xử lý theo flow đã đào tạo.</p>

      <div className="flex items-center gap-3 mb-6">
        <select value={selectedCategoryId} onChange={(e) => onCategoryChange(e.target.value)} className="px-3.5 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#7F56D9] transition">
          <option value="">Tất cả</option>
          {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="inline-flex items-center gap-2 px-4 py-2 bg-[#7F56D9] text-white text-sm font-medium rounded-lg hover:bg-[#6941C6] transition">
          <Plus className="w-4 h-4" /> Thêm tình huống
        </button>
      </div>

      <div className="border-t border-dashed border-gray-200 my-6" />

      {showForm && (
        <div className="border border-gray-200 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">{editingId ? 'Sửa' : 'Thêm mới'}</h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục</label>
                <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#7F56D9]" required>
                  <option value="">Chọn...</option>
                  {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#7F56D9]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mức độ</label>
                <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#7F56D9]">
                  <option value="low">Thấp</option><option value="normal">Bình thường</option><option value="high">Cao</option><option value="critical">Khẩn cấp</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Trigger</label>
              <input type="text" value={form.trigger_condition} onChange={(e) => setForm({ ...form, trigger_condition: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#7F56D9]" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kịch bản hội thoại</label>
              <div className="space-y-2">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-2">
                    <select value={step.role} onChange={(e) => updateStep(i, 'role', e.target.value)} className="px-2 py-2 border border-gray-300 rounded-lg text-xs w-[70px] outline-none"><option value="user">User</option><option value="bot">Bot</option></select>
                    <input type="text" value={step.message} onChange={(e) => updateStep(i, 'message', e.target.value)} className="flex-1 px-3.5 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#7F56D9]" />
                    {steps.length > 2 && <button type="button" onClick={() => removeStep(i)} className="p-2 text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>}
                  </div>
                ))}
              </div>
              <button type="button" onClick={addStep} className="mt-2 flex items-center gap-1.5 text-xs text-[#7F56D9] hover:text-[#6941C6]"><CirclePlus className="w-4 h-4" /> Thêm bước</button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Hướng dẫn xử lý</label>
              <textarea value={form.resolution_guide} onChange={(e) => setForm({ ...form, resolution_guide: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#7F56D9] resize-none" rows={2} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
              <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#7F56D9]" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">{editingId ? 'Cập nhật' : 'Tạo mới'}</button>
              <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition">Hủy</button>
            </div>
          </form>
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-900 mb-4">Danh sách tình huống</h2>
      {scenarios.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center">
          <Theater className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Chưa có tình huống nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {scenarios.map((s) => (
            <div key={s.id} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition group">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-gray-900">{s.title}</h4>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${s.severity === 'critical' ? 'bg-red-50 text-red-700' : s.severity === 'high' ? 'bg-orange-50 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                      {(s.severity === 'high' || s.severity === 'critical') && <AlertTriangle className="w-3 h-3" />}{s.severity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-3.5 h-3.5 text-[#7F56D9]" />
                    <p className="text-xs text-gray-500">{s.trigger_condition}</p>
                  </div>
                  {Array.isArray(s.conversation_flow) && s.conversation_flow.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 space-y-1.5 border border-gray-100">
                      {(s.conversation_flow as ConversationStep[]).slice(0, 3).map((step, i) => (
                        <div key={i} className="flex items-start gap-2">
                          {step.role === 'user' ? <User className="w-3.5 h-3.5 text-gray-400 mt-0.5" /> : <Bot className="w-3.5 h-3.5 text-[#7F56D9] mt-0.5" />}
                          <p className="text-xs text-gray-600 line-clamp-1">{step.message}</p>
                        </div>
                      ))}
                      {(s.conversation_flow as ConversationStep[]).length > 3 && <p className="text-[11px] text-gray-400 pl-5">+{(s.conversation_flow as ConversationStep[]).length - 3} bước</p>}
                    </div>
                  )}
                  {s.tags && s.tags.length > 0 && (
                    <div className="flex gap-1.5 mt-3 flex-wrap">
                      {s.tags.map((tag, i) => (<span key={i} className="px-2 py-0.5 border border-gray-200 text-gray-500 rounded-md text-[11px]">#{tag}</span>))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition ml-3">
                  <button onClick={() => handleEdit(s)} className="p-1.5 rounded-md text-gray-400 hover:text-[#7F56D9] hover:bg-purple-50"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
