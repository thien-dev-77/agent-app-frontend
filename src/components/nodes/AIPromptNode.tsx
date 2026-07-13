'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Wand2, Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import NodeWrapper from './NodeWrapper';

interface AIPromptNodeProps {
  id: string;
  data: {
    onDelete?: () => void;
    generatedPrompt?: string;
    generating?: boolean;
    status?: 'idle' | 'running' | 'done' | 'error';
    // Stored values (persisted in node.data)
    brandName?: string;
    primaryColor?: string;
    secondaryColor?: string;
    fontStyle?: string;
    mood?: string;
    description?: string;
    refFileUrls?: string[];
    logoUrl?: string;
  };
}

function AIPromptNode({ id, data }: AIPromptNodeProps) {
  const { onDelete } = data;
  const { setNodes } = useReactFlow();

  const [brandName, setBrandName] = useState(data.brandName || '');
  const [primaryColor, setPrimaryColor] = useState(data.primaryColor || '');
  const [secondaryColor, setSecondaryColor] = useState(data.secondaryColor || '');
  const [fontStyle, setFontStyle] = useState(data.fontStyle || '');
  const [mood, setMood] = useState(data.mood || '');
  const [description, setDescription] = useState(data.description || '');
  const [generatedPrompt, setGeneratedPrompt] = useState(data.generatedPrompt || '');
  const [refFiles, setRefFiles] = useState<File[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState(data.logoUrl || '');

  const loading = data.generating || false;
  const status = data.status || 'idle';

  // Sync generatedPrompt from parent
  useEffect(() => {
    if (data.generatedPrompt) setGeneratedPrompt(data.generatedPrompt);
  }, [data.generatedPrompt]);

  // Save data to node.data on every change (so handleRunFlow can read it)
  const saveTimeout = useRef<any>(null);
  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      setNodes((nds) => nds.map((n) => {
        if (n.id !== id) return n;
        return {
          ...n,
          data: {
            ...n.data,
            brandName,
            primaryColor,
            secondaryColor,
            fontStyle,
            mood,
            description,
          },
        };
      }));
    }, 300);
  }, [brandName, primaryColor, secondaryColor, fontStyle, mood, description, id, setNodes]);

  // Save refFiles as object URLs for handleRunFlow to read
  useEffect(() => {
    setNodes((nds) => nds.map((n) => {
      if (n.id !== id) return n;
      return { ...n, data: { ...n.data, _refFiles: refFiles, _logoFile: logoFile } };
    }));
  }, [refFiles, logoFile, id, setNodes]);

  // Logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setLogoFile(f);
      const reader = new FileReader();
      reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
      reader.readAsDataURL(f);
    }
  };
  const removeLogo = () => { setLogoFile(null); setLogoPreview(''); };

  // References
  const onDrop = useCallback((accepted: File[]) => {
    setRefFiles((prev) => [...prev, ...accepted].slice(0, 4));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: true,
    maxFiles: 4,
  });

  const removeFile = (idx: number) => setRefFiles((prev) => prev.filter((_, i) => i !== idx));

  return (
    <NodeWrapper onDelete={onDelete}>
      <div className="node-card nowheel" style={{ width: 300 }}>
        <div className="node-header">
          <Wand2 className="w-4 h-4 text-purple-400" />
          <span className="text-gray-200 font-semibold">Prompt Builder</span>
          {status === 'done' && <span className="ml-auto text-[10px] text-emerald-400">✓</span>}
          {status === 'idle' && <div className="node-status-dot ml-auto" />}
        </div>
        <div className="node-body space-y-2.5">

          {/* Brand + Logo */}
          <div>
            <label className="text-[9px] text-gray-500 block mb-1">BRAND</label>
            <div className="flex items-center gap-2">
              {logoPreview ? (
                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[var(--node-border)] shrink-0">
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-contain bg-white/5" />
                  <button onPointerDown={e => e.stopPropagation()} onClick={removeLogo} className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px]">✕</button>
                </div>
              ) : (
                <label className="w-10 h-10 rounded-lg border border-dashed border-[var(--node-border)] hover:border-purple-400 flex items-center justify-center cursor-pointer transition shrink-0" onPointerDown={e => e.stopPropagation()}>
                  <Upload className="w-3.5 h-3.5 text-gray-500" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                </label>
              )}
              <input type="text" value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="Tên thương hiệu" className="node-field !py-1.5 !text-[10px] flex-1" />
            </div>
          </div>

          {/* Colors + Mood */}
          <div className="grid grid-cols-3 gap-1.5">
            <div>
              <label className="text-[9px] text-gray-500 block mb-0.5">Màu chính</label>
              <input type="text" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} placeholder="#FF5733" className="node-field !py-1.5 !text-[10px]" />
            </div>
            <div>
              <label className="text-[9px] text-gray-500 block mb-0.5">Màu phụ</label>
              <input type="text" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} placeholder="#333" className="node-field !py-1.5 !text-[10px]" />
            </div>
            <div>
              <label className="text-[9px] text-gray-500 block mb-0.5">Mood</label>
              <select value={mood} onChange={e => setMood(e.target.value)} className="node-field !py-1.5 !text-[10px]" onPointerDown={e => e.stopPropagation()}>
                <option value="">...</option>
                <option value="Professional">Pro</option>
                <option value="Luxury">Luxury</option>
                <option value="Playful">Playful</option>
                <option value="Minimal">Minimal</option>
                <option value="Bold">Bold</option>
                <option value="Elegant">Elegant</option>
              </select>
            </div>
          </div>

          {/* Font */}
          <div>
            <label className="text-[9px] text-gray-500 block mb-0.5">Font / Style</label>
            <input type="text" value={fontStyle} onChange={e => setFontStyle(e.target.value)} placeholder="Modern Sans, Serif..." className="node-field !py-1.5 !text-[10px]" />
          </div>

          {/* Reference Images */}
          <div>
            <label className="text-[9px] text-gray-500 block mb-1">HÌNH THAM KHẢO</label>
            {refFiles.length > 0 ? (
              <div className="grid grid-cols-4 gap-1 mb-1.5">
                {refFiles.map((f, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden border border-[var(--node-border)] aspect-square">
                    <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                    <button onPointerDown={e => e.stopPropagation()} onClick={() => removeFile(i)} className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <X className="w-2 h-2" />
                    </button>
                  </div>
                ))}
                {refFiles.length < 4 && (
                  <div {...getRootProps()} className="aspect-square border border-dashed border-[var(--node-border)] rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-400 transition">
                    <input {...getInputProps()} />
                    <ImageIcon className="w-3 h-3 text-gray-500" />
                  </div>
                )}
              </div>
            ) : (
              <div {...getRootProps()} className={`border border-dashed rounded-lg p-2 text-center cursor-pointer transition ${isDragActive ? 'border-purple-400 bg-purple-500/5' : 'border-[var(--node-border)] hover:border-gray-500'}`}>
                <input {...getInputProps()} />
                <Upload className="w-3.5 h-3.5 mx-auto text-gray-500 mb-0.5" />
                <p className="text-[9px] text-gray-500">Thả hình tham khảo (max 4)</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-[9px] text-gray-500 block mb-0.5">MÔ TẢ Ý TƯỞNG</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="VD: Banner khuyến mãi 50% niềng răng cho trẻ em..." className="node-field !text-[10px] resize-none" rows={3} />
          </div>

          {/* Status */}
          {!generatedPrompt && !loading && (
            <p className="text-[10px] text-gray-500 text-center py-2 rounded-lg border border-dashed border-[var(--node-border)]">
              Nhấn <span className="text-red-400 font-bold">Run Workflow</span> để tạo prompt
            </p>
          )}

          {loading && (
            <div className="text-center py-3 rounded-lg border border-purple-500/20 bg-purple-500/5">
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin mx-auto" />
              <p className="text-[10px] text-purple-300 mt-1">Đang tạo prompt...</p>
            </div>
          )}

          {/* Output - editable */}
          {generatedPrompt && !loading && (
            <div className="rounded-lg p-2.5 bg-black/30 border border-emerald-500/30">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] text-emerald-400 font-semibold">OUTPUT PROMPT:</p>
                <span className="text-[9px] text-gray-500">{generatedPrompt.length} chars</span>
              </div>
              <textarea
                value={generatedPrompt}
                onChange={e => {
                  setGeneratedPrompt(e.target.value);
                  // Sync lên node.data để generate node đọc được
                  setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, generatedPrompt: e.target.value } } : n));
                }}
                className="w-full bg-transparent text-[10px] text-gray-300 leading-relaxed outline-none resize-none"
                rows={5}
                onPointerDown={e => e.stopPropagation()}
              />
            </div>
          )}
        </div>
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
      </div>
    </NodeWrapper>
  );
}

export default AIPromptNode;
