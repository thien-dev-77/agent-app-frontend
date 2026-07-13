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
      <div className="node-card" style={{ width: 260 }}>
        <div className="node-header">
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <span className="text-gray-200 font-semibold">Prompt Builder</span>
          <div className="node-status-dot ml-auto" />
          {localPrompt.length > 0 && <Check className="w-3 h-3 text-emerald-400" />}
        </div>
        <div className="node-body">
          <p className="text-[10px] text-gray-500">Core creative concept</p>
          <label className="text-[10px] text-gray-400 block mb-1">Main Prompt</label>
          <textarea
            value={localPrompt}
            onChange={e => handleChange(e.target.value)}
            className="node-field resize-none text-[11px]"
            rows={4}
            placeholder="Describe your creative vision..."
          />
          <p className="text-[10px] text-gray-500 text-right">{localPrompt.length} chars</p>
        </div>
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
      </div>
    </NodeWrapper>
  );
}

export default PromptNode;
