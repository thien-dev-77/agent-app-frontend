'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { createBrand, createTemplate, uploadFile } from '@/lib/api';
import { Brand, Template } from '@/types';
import ColorPicker from './ColorPicker';
import FileUpload from './FileUpload';
import toast from 'react-hot-toast';

interface SidePanelProps {
  type: 'brand' | 'template';
  onClose: () => void;
  onBrandCreated: (brand: Brand) => void;
  onTemplateCreated: (tpl: Template) => void;
}

export default function SidePanel({ type, onClose, onBrandCreated, onTemplateCreated }: SidePanelProps) {
  // Brand form
  const [brandName, setBrandName] = useState('');
  const [brandColor, setBrandColor] = useState('#6366f1');
  const [brandLogo, setBrandLogo] = useState<File[]>([]);
  const [brandDesc, setBrandDesc] = useState('');

  // Template form
  const [tplName, setTplName] = useState('');
  const [tplCategory, setTplCategory] = useState('banner');
  const [tplPrompt, setTplPrompt] = useState('');
  const [tplWidth, setTplWidth] = useState(1024);
  const [tplHeight, setTplHeight] = useState(1024);

  const [loading, setLoading] = useState(false);

  async function handleCreateBrand() {
    if (!brandName.trim()) { toast.error('Nhập tên brand'); return; }
    setLoading(true);
    try {
      let logoUrl: string | undefined;
      if (brandLogo.length > 0) {
        const { url } = await uploadFile(brandLogo[0]);
        logoUrl = url;
      }
      const brand = await createBrand({
        name: brandName,
        primary_color: brandColor,
        description: brandDesc || undefined,
        logo_url: logoUrl,
      });
      toast.success('Đã tạo brand!');
      onBrandCreated(brand);
    } catch { toast.error('Tạo brand thất bại'); }
    finally { setLoading(false); }
  }

  async function handleCreateTemplate() {
    if (!tplName.trim() || !tplPrompt.trim()) { toast.error('Nhập tên và prompt'); return; }
    setLoading(true);
    try {
      const tpl = await createTemplate({ name: tplName, category: tplCategory, prompt_template: tplPrompt, width: tplWidth, height: tplHeight });
      toast.success('Đã tạo template!');
      onTemplateCreated(tpl);
    } catch { toast.error('Tạo template thất bại'); }
    finally { setLoading(false); }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="panel-overlay p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            {type === 'brand' ? 'Tạo Brand mới' : 'Tạo Template mới'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {type === 'brand' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tên brand *</label>
              <input value={brandName} onChange={e => setBrandName(e.target.value)} className="node-field" placeholder="VD: Nha khoa Smile" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Mô tả</label>
              <textarea value={brandDesc} onChange={e => setBrandDesc(e.target.value)} className="node-field resize-none" rows={2} placeholder="Mô tả ngắn..." />
            </div>
            <ColorPicker color={brandColor} onChange={setBrandColor} label="Màu chủ đạo" />
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Logo</label>
              <FileUpload onFilesSelected={f => setBrandLogo(f)} selectedFiles={brandLogo} onRemoveFile={() => setBrandLogo([])} label="Upload logo" />
            </div>
            <button onClick={handleCreateBrand} disabled={loading} className="node-btn-primary w-full">
              {loading ? 'Đang tạo...' : 'Tạo Brand'}
            </button>
          </div>
        )}

        {type === 'template' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tên *</label>
              <input value={tplName} onChange={e => setTplName(e.target.value)} className="node-field" placeholder="VD: Banner Facebook" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Loại</label>
              <select value={tplCategory} onChange={e => setTplCategory(e.target.value)} className="node-field">
                <option value="banner">Banner</option>
                <option value="social-post">Social Post</option>
                <option value="thumbnail">Thumbnail</option>
                <option value="poster">Poster</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Prompt Template *</label>
              <textarea value={tplPrompt} onChange={e => setTplPrompt(e.target.value)} className="node-field resize-none text-[11px] font-mono" rows={4} placeholder="Tạo banner cho {{brand_name}} với màu {{primary_color}}..." />
              <p className="text-[10px] text-gray-400 mt-0.5">Dùng {'{{brand_name}}'}, {'{{primary_color}}'}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Width</label>
                <input type="number" value={tplWidth} onChange={e => setTplWidth(Number(e.target.value))} className="node-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Height</label>
                <input type="number" value={tplHeight} onChange={e => setTplHeight(Number(e.target.value))} className="node-field" />
              </div>
            </div>
            <button onClick={handleCreateTemplate} disabled={loading} className="node-btn-primary w-full">
              {loading ? 'Đang tạo...' : 'Tạo Template'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
