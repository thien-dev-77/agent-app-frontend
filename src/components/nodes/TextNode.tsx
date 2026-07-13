'use client';


import { Handle, Position } from 'reactflow';
import { Type } from 'lucide-react';
import NodeWrapper from './NodeWrapper';

interface TextNodeProps {
  data: {
    text?: string;
    onChange?: (val: string) => void;
    onDelete?: () => void;
  };
}

function TextNode({ data }: TextNodeProps) {
  const { text = '', onChange, onDelete } = data;

  return (
    <NodeWrapper onDelete={onDelete}>
      <div className="node-card" style={{ width: 180 }}>
        <div className="node-header bg-white/5 text-gray-400">
          <Type className="w-3.5 h-3.5" />
          <span className="text-gray-200">Note</span>
        </div>
        <div className="node-body">
          <textarea
            value={text}
            onChange={e => onChange?.(e.target.value)}
            className="node-field resize-none text-[11px]"
            rows={3}
            placeholder="Ghi chú..."
          />
        </div>
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} className="!bg-gray-400" />
      </div>
    </NodeWrapper>
  );
}

export default TextNode;
