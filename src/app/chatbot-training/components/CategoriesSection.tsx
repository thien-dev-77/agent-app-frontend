'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, FolderOpen, ExternalLink } from 'lucide-react';
import { TrainingCategory } from '@/types';
import { createTrainingCategory, updateTrainingCategory, deleteTrainingCategory } from '@/lib/api';

interface Props {
  categories: TrainingCategory[];
  onRefresh: () => void;
}

export default function CategoriesSection({ categories, onRefresh }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', icon: '', sort_order: 0 });

  const resetForm = () => { setForm({ name: '', description: '', icon: '', sort_order: 0 }); setShowForm(false); setEditingId(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) { await updateTrainingCategory(editingId, form); toast.success('Đã cập nhật'); }
      else { await createTrainingCategory(form); toast.success('Đã tạo danh mục'); }
      resetForm(); onRefresh();
    } catch { toast.error('Lỗi khi lưu'); }
  };

  const handleEdit = (cat: TrainingCategory) => {
    setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '', sort_order: cat.sort_order });
    setEditingId(cat.id); setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa danh mục này? Dữ liệu liên quan sẽ bị xóa.')) return;
    try { await deleteTrainingCategory(id); toast.success('Đã xóa'); onRefresh(); } catch { toast.error('Lỗi'); }
  };

  return (
    <div>
      {/* Page icon */}
      <div className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center mb-6">
        <FolderOpen className="w-6 h-6 text-gray-400" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">Danh mục kiến thức</h1>
      <p className="text-base text-gray-600 leading-relaxed mb-6">
        Phân loại kiến thức đào tạo chatbot theo nhóm. Mỗi danh mục chứa các mẫu câu, tình huống và FAQ liên quan.
      </p>

      {/* Add button */}
      <button
        onClick={() => { resetForm(); setShowForm(true); }}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#7F56D9] text-white text-sm font-medium rounded-lg hover:bg-[#6941C6] transition mb-6"
      >
        <Plus className="w-4 h-4" /> Thêm danh mục
      </button>

      {/* Divider */}
      <div className="border-t border-dashed border-gray-200 my-6" />

      {/* Form */}
      {showForm && (
        <div className="border border-gray-200 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">{editingId ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên danh mục</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#7F56D9] focus:ring-1 focus:ring-[#7F56D9] transition" placeholder="VD: Niềng răng" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Icon</label>
                <input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#7F56D9] focus:ring-1 focus:ring-[#7F56D9] transition" placeholder="tooth, heart..." />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#7F56D9] focus:ring-1 focus:ring-[#7F56D9] resize-none transition" rows={2} placeholder="Mô tả ngắn..." />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">{editingId ? 'Cập nhật' : 'Tạo mới'}</button>
              <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">Hủy</button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Danh sách</h2>
      {categories.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center">
          <FolderOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Chưa có danh mục nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <div key={cat.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition group relative">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                    <FolderOpen className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{cat.description || 'Chưa có mô tả'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => handleEdit(cat)} className="p-1.5 rounded-md text-gray-400 hover:text-[#7F56D9] hover:bg-purple-50"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${cat.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {cat.status === 'active' ? 'Active' : 'Inactive'}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-300" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
