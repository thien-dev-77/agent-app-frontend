'use client';

import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Video, Loader2, Play, Download } from 'lucide-react';
import NodeWrapper from './NodeWrapper';

interface VideoNodeProps {
  data: {
    prompt?: string;
    imageUrl?: string;
    generating?: boolean;
    result?: { status: string; video_url?: string; error_message?: string };
    onGenerate?: (videoPrompt: string) => void;
    onDelete?: () => void;
    canGenerate?: boolean;
  };
}

function VideoNode({ data }: VideoNodeProps) {
  const { imageUrl, generating = false, result, onGenerate, onDelete, canGenerate = false } = data;
  const [localPrompt, setLocalPrompt] = useState(data.prompt || '');

  const canRun = canGenerate || localPrompt.trim().length > 0 || !!imageUrl;

  return (
    <NodeWrapper onDelete={onDelete}>
      <div className="node-card" style={{ width: 250 }}>
        <div className="node-header ">
          <Video className="w-3.5 h-3.5" />
          <span className="text-gray-200">Generate Video</span>
          {generating && <Loader2 className="w-3 h-3 ml-auto animate-spin" />}
        </div>
        <div className="node-body space-y-2">
          {/* Prompt */}
          <div>
            <label className="text-[10px] text-gray-500 block mb-0.5">Video prompt</label>
            <textarea
              value={localPrompt}
              onChange={e => setLocalPrompt(e.target.value)}
              className="node-field resize-none text-[11px]"
              rows={2}
              placeholder="Mô tả video muốn tạo..."
            />
          </div>

          {/* Input image */}
          {imageUrl && (
            <div>
              <label className="text-[10px] text-gray-500 block mb-0.5">Input từ Generate</label>
              <div className="w-full h-14 rounded overflow-hidden border border-[var(--node-border)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Input" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* Info */}
          <div className="flex gap-2 text-[10px]">
            <span className="bg-white/5 text-rose-600 px-1.5 py-0.5 rounded font-mono">Gemini Flash</span>
            <span className="bg-white/5 text-gray-500 px-1.5 py-0.5 rounded">5-10s</span>
          </div>

          {/* Run button */}
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={() => onGenerate?.(localPrompt)}
            disabled={generating}
            className={`node-btn-primary flex items-center justify-center gap-1.5 ${generating ? 'opacity-70' : ''}`}
            style={{ background: generating ? '#9f1239' : '#e11d48' }}
          >
            {generating ? (
              <><Loader2 className="w-3 h-3 animate-spin" /> Đang tạo video...</>
            ) : (
              <><Play className="w-3 h-3" /> Tạo Video</>
            )}
          </button>

          {/* Result */}
          {result && (
            <div className={`rounded p-1.5 ${
              result.status === 'completed' ? 'bg-green-50 border border-green-200' : result.status === 'failed' ? 'bg-red-50 border border-red-200' : 'bg-white/5 border border-[var(--node-border)]'
            }`}>
              {result.status === 'completed' && result.video_url ? (
                <div className="space-y-1">
                  <div className="relative w-full h-24 rounded overflow-hidden bg-black">
                    <video src={result.video_url} className="w-full h-full object-cover" muted />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <a href={result.video_url} target="_blank" rel="noreferrer" className="text-[10px] text-rose-600 hover:underline flex items-center gap-0.5">
                      <Play className="w-2.5 h-2.5" /> Xem
                    </a>
                    <a href={result.video_url} download className="text-[10px] text-gray-400 hover:underline flex items-center gap-0.5">
                      <Download className="w-2.5 h-2.5" /> Tải
                    </a>
                  </div>
                </div>
              ) : result.status === 'failed' ? (
                <p className="text-[10px] text-red-600">❌ {result.error_message || 'Thất bại'}</p>
              ) : (
                <p className="text-[10px] text-blue-600 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Đang xử lý video...
                </p>
              )}
            </div>
          )}

          {!canRun && !generating && !result && (
            <p className="text-[10px] text-gray-500 text-center">Nhập prompt hoặc kết nối từ Generate</p>
          )}
        </div>
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} className="!bg-white/50" />
      </div>
    </NodeWrapper>
  );
}

export default VideoNode;
