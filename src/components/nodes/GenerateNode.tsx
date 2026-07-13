'use client';

import { useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Sparkles, Loader2, Download, RefreshCw, Edit3, X, Send, Maximize2 } from 'lucide-react';
import NodeWrapper from './NodeWrapper';

interface GenerateNodeProps {
  id: string;
  data: {
    generating?: boolean;
    results?: any[];
    onRegenerate?: (index: number, newPrompt?: string) => void;
    onDelete?: () => void;
    status?: 'idle' | 'running' | 'done' | 'error';
    lastPrompt?: string;
  };
}

function GenerateNode({ id, data }: GenerateNodeProps) {
  const { generating = false, results = [], onRegenerate, onDelete, status = 'idle', lastPrompt = '' } = data;
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Chỉ lấy ảnh đầu tiên (mỗi node 1 ảnh)
  const result = results.find(r => r && r.id);
  const isCompleted = result?.status === 'completed' && result?.result_url;

  return (
    <NodeWrapper onDelete={onDelete}>
      <div className="node-card nowheel" style={{ width: 260 }}>
        {/* Header */}
        <div className="node-header">
          <Sparkles className="w-4 h-4 text-[var(--accent)]" />
          <span className="text-gray-200 font-semibold">Generate Image</span>
          {status === 'done' && <span className="ml-auto text-[10px] text-emerald-400">✓</span>}
          {status === 'running' && <Loader2 className="w-3.5 h-3.5 ml-auto animate-spin text-amber-400" />}
          {status === 'idle' && <div className="node-status-dot ml-auto" />}
        </div>

        {/* Body */}
        <div className="node-body space-y-2.5">
          {/* Status idle */}
          {status === 'idle' && !isCompleted && (
            <p className="text-[10px] text-gray-500 text-center py-4 rounded-lg border border-dashed border-[var(--node-border)]">
              ▶ Run Workflow to generate
            </p>
          )}

          {/* Loading */}
          {generating && (
            <div className="text-center py-6 rounded-lg border border-amber-500/20 bg-amber-500/5">
              <Loader2 className="w-6 h-6 text-amber-400 animate-spin mx-auto" />
              <p className="text-[10px] text-amber-300 mt-2">Generating image...</p>
            </div>
          )}

          {/* Result - 1 ảnh duy nhất */}
          {isCompleted && !generating && (
            <div className="space-y-2">
              {/* Image with click to preview */}
              <div
                className="relative group rounded-lg overflow-hidden border border-[var(--node-border)] cursor-pointer"
                onClick={() => setShowPreview(true)}
                onPointerDown={e => e.stopPropagation()}
              >
                <img src={result.result_url} alt="Generated" className="w-full aspect-square object-cover" />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-1.5">
                    <button className="p-2 bg-white/90 rounded-lg hover:bg-white" title="Xem lớn">
                      <Maximize2 className="w-3.5 h-3.5 text-gray-700" />
                    </button>
                    <a href={result.result_url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="p-2 bg-white/90 rounded-lg hover:bg-white" title="Download">
                      <Download className="w-3.5 h-3.5 text-gray-700" />
                    </a>
                    <button onClick={(e) => { e.stopPropagation(); setEditingIndex(0); setEditPrompt(lastPrompt); }} className="p-2 bg-white/90 rounded-lg hover:bg-white" title="Sửa">
                      <Edit3 className="w-3.5 h-3.5 text-gray-700" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onRegenerate?.(0); }} className="p-2 bg-white/90 rounded-lg hover:bg-white" title="Tạo lại">
                      <RefreshCw className="w-3.5 h-3.5 text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Edit prompt */}
              {editingIndex !== null && (
                <div className="rounded-lg p-2.5 bg-black/30 border border-[var(--accent)]/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-[var(--accent)]">Sửa prompt</span>
                    <button onPointerDown={e => e.stopPropagation()} onClick={() => setEditingIndex(null)}>
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                  <textarea
                    value={editPrompt}
                    onChange={e => setEditPrompt(e.target.value)}
                    className="node-field resize-none !text-[10px]"
                    rows={3}
                    placeholder="Sửa prompt..."
                    onPointerDown={e => e.stopPropagation()}
                  />
                  <button
                    onPointerDown={e => e.stopPropagation()}
                    onClick={() => { onRegenerate?.(0, editPrompt); setEditingIndex(null); }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-[var(--accent)] text-white text-[10px] font-medium rounded-lg hover:opacity-90 transition"
                  >
                    <Send className="w-3 h-3" /> Tạo lại
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {result?.status === 'failed' && (
            <div className="text-center py-4 rounded-lg border border-red-500/20 bg-red-500/5">
              <p className="text-[10px] text-red-400">❌ Lỗi tạo ảnh</p>
              <button onPointerDown={e => e.stopPropagation()} onClick={() => onRegenerate?.(0)} className="mt-1 text-[10px] text-gray-400 hover:text-white">Thử lại</button>
            </div>
          )}
        </div>

        {/* Handles */}
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
      </div>

      {/* Popup preview full size */}
      {showPreview && isCompleted && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center"
          onClick={() => setShowPreview(false)}
          onPointerDown={e => e.stopPropagation()}
        >
          <div className="relative max-w-[80vw] max-h-[80vh]">
            <img src={result.result_url} alt="Preview" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-full hover:bg-black/80"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              <a href={result.result_url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-100">
                <Download className="w-4 h-4 inline mr-1.5" /> Download
              </a>
              <button onClick={(e) => { e.stopPropagation(); setShowPreview(false); setEditingIndex(0); setEditPrompt(lastPrompt); }} className="px-4 py-2 bg-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/30 border border-white/20">
                <Edit3 className="w-4 h-4 inline mr-1.5" /> Edit
              </button>
              <button onClick={(e) => { e.stopPropagation(); setShowPreview(false); onRegenerate?.(0); }} className="px-4 py-2 bg-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/30 border border-white/20">
                <RefreshCw className="w-4 h-4 inline mr-1.5" /> Tạo lại
              </button>
            </div>
          </div>
        </div>
      )}
    </NodeWrapper>
  );
}

export default GenerateNode;
