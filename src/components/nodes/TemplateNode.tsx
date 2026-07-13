'use client';


import { Handle, Position } from 'reactflow';
import { FileText, Plus, Check } from 'lucide-react';
import NodeWrapper from './NodeWrapper';

interface TemplateNodeProps {
  data: {
    templates?: any[];
    selectedTemplate?: any;
    onSelect?: (tpl: any) => void;
    onCreateNew?: () => void;
    onDelete?: () => void;
  };
}

function TemplateNode({ data }: TemplateNodeProps) {
  const { templates = [], selectedTemplate, onSelect, onCreateNew, onDelete } = data;

  return (
    <NodeWrapper onDelete={onDelete}>
      <div className="node-card">
        <div className="node-header ">
          <FileText className="w-3.5 h-3.5" />
          <span className="text-gray-200">Template</span>
          {selectedTemplate && <Check className="w-3 h-3 ml-auto text-green-500" />}
        </div>
        <div className="node-body">
          {selectedTemplate ? (
            <div className="p-1.5 rounded bg-white/5 border border-[var(--node-border)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium truncate">{selectedTemplate.name}</span>
                <button onClick={() => onSelect?.(null)} className="text-gray-500 hover:text-gray-400 text-[10px]">✕</button>
              </div>
              <span className="mini-badge bg-blue-100 text-blue-600 mt-1">{selectedTemplate.category}</span>
            </div>
          ) : (
            <>
              <div className="max-h-24 overflow-y-auto space-y-1">
                {templates.map((t: any) => (
                  <button
                    key={t.id}
                    onClick={() => onSelect?.(t)}
                    className="w-full flex items-center justify-between p-1.5 rounded hover:bg-white/5 text-left transition-colors"
                  >
                    <span className="text-xs truncate">{t.name}</span>
                    <span className="mini-badge bg-gray-100 text-gray-500">{t.category}</span>
                  </button>
                ))}
              </div>
              {templates.length === 0 && <p className="text-[10px] text-gray-500 text-center py-2">Chưa có template</p>}
              <button onClick={() => onCreateNew?.()} className="node-btn-secondary flex items-center justify-center gap-1 mt-1">
                <Plus className="w-3 h-3" /> Tạo mới
              </button>
              <p className="text-[10px] text-gray-500 text-center">Tuỳ chọn</p>
            </>
          )}
        </div>
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} className="!bg-white/50" />
      </div>
    </NodeWrapper>
  );
}

export default TemplateNode;
