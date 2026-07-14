'use client';

import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { MessageSquare, Check } from 'lucide-react';
import NodeWrapper from './NodeWrapper';

interface PromptNodeProps {
  data: {
    prompt?: string;
    onChange?: (val: string) => void;
    onDelete?: () => void;
  };
}

function PromptNode({ data }: PromptNodeProps) {
  const { prompt = '', onChange, onDelete } = data;
  const [localPrompt, setLocalPrompt] = useState(prompt);

  useEffect(() => { setLocalPrompt(prompt); }, [prompt]);

  const handleChange = (val: string) => {
    setLocalPrompt(val);
    onChange?.(val);
  };

  return (
    <NodeWrapper onDelete={onDelete}>
      <div className="node-card nowheel" style={{ width: 300, background: '#141414', border: '1px solid #2a2a2a' }}>
        {/* Header */}
        <div className="node-header" style={{ background: '#1a1a1a', borderBottom: '1px solid #2a2a2a', padding: '8px 12px' }}>
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-gray-200 font-semibold text-[11px]">Prompt</span>
          <div className="flex items-center gap-1.5 ml-auto">
            {localPrompt.length > 0 && (
              <span className="text-[9px] text-gray-600">{localPrompt.length} chars</span>
            )}
            {localPrompt.trim().length > 0
              ? <Check className="w-3 h-3 text-emerald-400" />
              : <div className="w-2 h-2 rounded-full bg-emerald-500" />
            }
          </div>
        </div>

        {/* Textarea chiếm full */}
        <div className="p-0">
          <textarea
            value={localPrompt}
            onChange={e => handleChange(e.target.value)}
            className="w-full bg-transparent text-[11px] text-gray-300 leading-relaxed outline-none resize-none px-3 py-2.5"
            style={{ minHeight: 120, maxHeight: 300 }}
            placeholder="Mô tả ý tưởng sáng tạo của bạn..."
            onPointerDown={e => e.stopPropagation()}
          />
        </div>

        {/* Footer hint */}
        {localPrompt.trim().length === 0 && (
          <div className="px-3 pb-2.5">
            <p className="text-[9px] text-gray-600">Nhập prompt rồi nhấn <span className="text-red-400">Run ▶</span></p>
          </div>
        )}

        <Handle type="target" position={Position.Left} style={{ background: '#22c55e' }} />
        <Handle type="source" position={Position.Right} style={{ background: '#22c55e' }} />
      </div>
    </NodeWrapper>
  );
}

export default PromptNode;
