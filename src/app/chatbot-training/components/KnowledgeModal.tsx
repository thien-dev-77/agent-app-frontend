'use client';

import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { X, Upload, FileText, Plus, FolderOpen, Trash2, Database, Image as ImageIcon } from 'lucide-react';
import { TrainingCategory, TrainingStats, TrainingPhrase, TrainingFAQ, TrainingScenario } from '@/types';
import { uploadKnowledgeFile, addKnowledgeText, createTrainingCategory, deleteTrainingCategory, uploadFile } from '@/lib/api';

interface Props {
  open: boolean;
  onClose: () => void;
  categories: TrainingCategory[];
  stats: TrainingStats | null;
  onRefresh: () => void;
  phrases?: TrainingPhrase[];
  faqs?: TrainingFAQ[];
  scenarios?: TrainingScenario[];
}

export default function KnowledgeModal({ open, onClose, categories, stats, onRefresh, phrases = [], faqs = [], scenarios = [] }: Props) {
  const [tab, setTab] = useState<'list' | 'upload' | 'text' | 'images'>('list');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);
  const [lastResult, setLastResult] = useState<string>('');
  const [images, setImages] = useState<any[]>([]);
  const [imgTitle, setImgTitle] = useState('');
  const [imgDesc, setImgDesc] = useState('');
  const [imgTags, setImgTags] = useState('');
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const imgFileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const inputStyle = {
    background: 'var(--bg-primary)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
  };

  const loadImages = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/chatbot-training/images${selectedCategory ? `?category_id=${selectedCategory}` : ''}`);
      const data = await res.json();
      setImages(data);
    } catch {}
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImgPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveImage = async () => {
    if (!imgFile) { toast.error('Chọn ảnh trước'); return; }
    if (!imgTitle.trim()) { toast.error('Nhập tiêu đề ảnh'); return; }
    setUploading(true);
    try {
      const { url } = await uploadFile(imgFile);
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/chatbot-training/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: imgTitle.trim(),
          image_url: url,
          description: imgDesc.trim() || undefined,
          tags: imgTags ? imgTags.split(',').map(t => t.trim()) : undefined,
          category_id: selectedCategory || undefined,
        }),
      });
      toast.success('Đã lưu hình ảnh');
      setImgTitle(''); setImgDesc(''); setImgTags(''); setImgFile(null); setImgPreview('');
      loadImages();
      onRefresh();
    } catch {
      toast.error('Lỗi upload ảnh');
    } finally {
      setUploading(false);
      if (imgFileRef.current) imgFileRef.current.value = '';
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Xóa ảnh?')) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/chatbot-training/images/${id}`, { method: 'DELETE' });
      toast.success('Đã xóa');
      loadImages();
    } catch { toast.error('Lỗi'); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setLastResult('');
    try {
      const result = await uploadKnowledgeFile(file, selectedCategory || undefined);
      toast.success(`${result.message} (${result.phrases_created} mục)`);
      setLastResult(`✅ ${result.message} — Đã tạo ${result.phrases_created} mục kiến thức`);
      onRefresh();
    } catch {
      toast.error('Lỗi upload file');
      setLastResult('❌ Lỗi upload file');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleTextSubmit = async () => {
    if (!textContent.trim()) { toast.error('Nhập nội dung'); return; }
    setUploading(true);
    setLastResult('');
    try {
      const result = await addKnowledgeText(textContent, textTitle || undefined, selectedCategory || undefined);
      toast.success(`${result.message} (${result.phrases_created} mục)`);
      setLastResult(`✅ ${result.message} — Đã tạo ${result.phrases_created} mục kiến thức`);
      setTextContent('');
      setTextTitle('');
      onRefresh();
    } catch {
      toast.error('Lỗi thêm nội dung');
      setLastResult('❌ Lỗi thêm nội dung');
    } finally {
      setUploading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      await createTrainingCategory({ name: newCatName.trim() });
      toast.success('Đã thêm danh mục');
      setNewCatName('');
      setShowAddCat(false);
      onRefresh();
    } catch { toast.error('Lỗi'); }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Xóa danh mục?')) return;
    try { await deleteTrainingCategory(id); toast.success('Đã xóa'); onRefresh(); } catch { toast.error('Lỗi'); }
  };

  const tabStyle = (active: boolean) => ({
    background: active ? 'var(--accent)' : 'transparent',
    color: active ? 'white' : 'var(--text-secondary)',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div 
        className="rounded-xl w-[900px] max-h-[650px] flex flex-col"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Kho kiến thức</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)]"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub header - tabs */}
        <div 
          className="flex items-center justify-between px-6 py-3"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Kiến thức của chatbot</span>
          </div>
          <div className="flex items-center gap-2">
            {(['list', 'upload', 'text', 'images'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); if (t === 'images') loadImages(); }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg transition"
                style={tabStyle(tab === t)}
              >
                {t === 'list' ? 'Kiến thức' : t === 'upload' ? '+ Upload' : t === 'text' ? '+ Text' : '+ Ảnh'}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: categories */}
          <div 
            className="w-[220px] p-4 overflow-y-auto"
            style={{ borderRight: '1px solid var(--border)' }}
          >
            <p className="text-[11px] font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Danh mục
            </p>
            <button
              onClick={() => setSelectedCategory('')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition mb-1"
              style={{
                background: !selectedCategory ? 'var(--bg-elevated)' : 'transparent',
                color: !selectedCategory ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              <FolderOpen className="w-4 h-4" /> Tất cả
            </button>
            {categories.map((cat) => (
              <div key={cat.id} className="group flex items-center justify-between">
                <button
                  onClick={() => setSelectedCategory(cat.id)}
                  className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition"
                  style={{
                    background: selectedCategory === cat.id ? 'var(--bg-elevated)' : 'transparent',
                    color: selectedCategory === cat.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                >
                  <FolderOpen className="w-3.5 h-3.5" /> {cat.name}
                </button>
                <button 
                  onClick={() => handleDeleteCategory(cat.id)} 
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}

            {showAddCat ? (
              <div className="mt-2 flex gap-1">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                  placeholder="Tên danh mục"
                  className="flex-1 px-2 py-1 rounded text-xs outline-none"
                  style={inputStyle}
                  autoFocus
                />
                <button 
                  onClick={handleAddCategory} 
                  className="px-2 py-1 text-xs rounded"
                  style={{ background: 'var(--accent)', color: 'white' }}
                >
                  OK
                </button>
                <button 
                  onClick={() => setShowAddCat(false)} 
                  className="px-2 py-1 text-xs"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAddCat(true)} 
                className="mt-2 flex items-center gap-1 text-xs px-3"
                style={{ color: 'var(--accent)' }}
              >
                <Plus className="w-3 h-3" /> Danh mục
              </button>
            )}
          </div>

          {/* Right: content area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {tab === 'list' && (
              <div>
                {(() => {
                  const filteredPhrases = selectedCategory ? phrases.filter((p) => p.category_id === selectedCategory) : phrases;
                  const filteredFaqs = selectedCategory ? faqs.filter((f) => f.category_id === selectedCategory) : faqs;
                  const filteredScenarios = selectedCategory ? scenarios.filter((s) => s.category_id === selectedCategory) : scenarios;
                  const total = filteredPhrases.length + filteredFaqs.length + filteredScenarios.length;

                  if (total === 0) {
                    return (
                      <div className="text-center py-12">
                        <Database className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Chưa có kiến thức nào</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Upload file hoặc nhập text để thêm</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{total} mục kiến thức</span>
                        {filteredPhrases.length > 0 && <span>{filteredPhrases.length} mẫu câu</span>}
                        {filteredFaqs.length > 0 && <span>{filteredFaqs.length} FAQ</span>}
                        {filteredScenarios.length > 0 && <span>{filteredScenarios.length} tình huống</span>}
                      </div>

                      {filteredScenarios.length > 0 && (
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
                            Tình huống
                          </p>
                          <div className="space-y-1.5">
                            {filteredScenarios.map((s) => (
                              <div key={s.id} className="p-3 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{s.title}</p>
                                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{s.trigger_condition}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {filteredFaqs.length > 0 && (
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>FAQ</p>
                          <div className="space-y-1.5">
                            {filteredFaqs.map((f) => (
                              <div key={f.id} className="p-3 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                                <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{f.question}</p>
                                <p className="text-[11px] mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{f.answer}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {filteredPhrases.length > 0 && (
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>Mẫu câu</p>
                          <div className="space-y-1.5">
                            {filteredPhrases.map((p) => (
                              <div key={p.id} className="p-3 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: 'rgba(79, 140, 255, 0.2)', color: 'var(--accent)' }}>
                                  {p.intent}
                                </span>
                                <p className="text-xs mt-1" style={{ color: 'var(--text-primary)' }}>{p.user_message}</p>
                                <p className="text-[11px] mt-1" style={{ color: 'var(--text-secondary)' }}>{p.bot_response}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {tab === 'upload' && (
              <div>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition hover:border-[var(--accent)]"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <Upload className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Kéo thả file hoặc nhấn để chọn</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Hỗ trợ .txt, .md, .doc, .docx (tối đa 5MB)</p>
                </div>
                <input ref={fileRef} type="file" accept=".txt,.md,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                {uploading && <p className="text-xs text-center mt-3" style={{ color: 'var(--accent)' }}>Đang xử lý...</p>}
                {lastResult && !uploading && (
                  <p className="text-xs mt-3 text-center rounded-lg p-2" style={{ background: 'rgba(52, 211, 153, 0.15)', color: 'var(--accent-green)' }}>
                    {lastResult}
                  </p>
                )}
              </div>
            )}

            {tab === 'text' && (
              <div className="space-y-3">
                {lastResult && !uploading && (
                  <p className="text-xs rounded-lg p-2" style={{ background: 'rgba(52, 211, 153, 0.15)', color: 'var(--accent-green)' }}>
                    {lastResult}
                  </p>
                )}
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Tiêu đề (tùy chọn)</label>
                  <input
                    type="text"
                    value={textTitle}
                    onChange={(e) => setTextTitle(e.target.value)}
                    placeholder="VD: Kiến thức niềng răng"
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Nội dung kiến thức</label>
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Dán nội dung kiến thức vào đây..."
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
                    style={inputStyle}
                    rows={12}
                  />
                </div>
                <button
                  onClick={handleTextSubmit}
                  disabled={uploading || !textContent.trim()}
                  className="px-5 py-2 text-sm font-medium rounded-lg disabled:opacity-50 transition"
                  style={{ background: 'var(--accent)', color: 'white' }}
                >
                  {uploading ? 'Đang xử lý...' : 'Thêm kiến thức'}
                </button>
              </div>
            )}

            {tab === 'images' && (
              <div className="space-y-4">
                <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Upload hình ảnh tham khảo</p>
                  <div className="flex gap-3 items-start">
                    <div
                      onClick={() => imgFileRef.current?.click()}
                      className="w-28 h-28 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition shrink-0 overflow-hidden hover:border-[var(--accent)]"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      {imgPreview ? (
                        <img src={imgPreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="w-6 h-6 mx-auto" style={{ color: 'var(--text-tertiary)' }} />
                          <p className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>Chọn ảnh</p>
                        </div>
                      )}
                    </div>
                    <input ref={imgFileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <div className="flex-1 space-y-2">
                      <input type="text" value={imgTitle} onChange={e => setImgTitle(e.target.value)} placeholder="Tiêu đề ảnh *" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
                      <input type="text" value={imgDesc} onChange={e => setImgDesc(e.target.value)} placeholder="Mô tả" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
                      <input type="text" value={imgTags} onChange={e => setImgTags(e.target.value)} placeholder="Tags (VD: kết quả, trước sau)" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
                    </div>
                  </div>
                  <button
                    onClick={handleSaveImage}
                    disabled={!imgFile || !imgTitle.trim() || uploading}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg disabled:opacity-40 transition"
                    style={{ background: 'var(--accent)', color: 'white' }}
                  >
                    {uploading ? 'Đang lưu...' : 'Lưu ảnh'}
                  </button>
                </div>

                {images.length === 0 ? (
                  <div className="text-center py-8">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-tertiary)' }} />
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Chưa có hình ảnh</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{images.length} hình ảnh</p>
                    <div className="grid grid-cols-3 gap-3">
                      {images.map((img: any) => (
                        <div key={img.id} className="rounded-lg overflow-hidden group relative" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                          <img src={img.image_url} alt={img.title} className="w-full h-24 object-cover" />
                          <div className="p-2">
                            <p className="text-[11px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>{img.title}</p>
                          </div>
                          <button onClick={() => handleDeleteImage(img.id)} className="absolute top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100 transition" style={{ background: 'rgba(0,0,0,0.5)', color: 'var(--accent-red)' }}>
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div 
          className="flex items-center justify-between px-6 py-3 rounded-b-xl"
          style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Bạn đã sử dụng: {stats ? stats.phrases + stats.faqs : 0} mục kiến thức
          </p>
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium rounded-lg transition"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            Sử dụng
          </button>
        </div>
      </div>
    </div>
  );
}
