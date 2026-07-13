'use client';

import { Handle, Position } from 'reactflow';
import { Palette, Plus, Check } from 'lucide-react';
import NodeWrapper from './NodeWrapper';

interface BrandNodeProps {
  data: {
    brands?: any[];
    selectedBrand?: any;
    onSelect?: (brand: any) => void;
    onCreateNew?: () => void;
    onDelete?: () => void;
  };
}

function BrandNode({ data }: BrandNodeProps) {
  const { brands = [], selectedBrand, onSelect, onCreateNew, onDelete } = data;

  return (
    <NodeWrapper onDelete={onDelete}>
      <div className="node-card">
        <div className="node-header">
          <Palette className="w-4 h-4 text-violet-400" />
          <span className="text-gray-200 font-semibold">Brand</span>
          <div className="node-status-dot ml-auto" />
          {selectedBrand && <Check className="w-3 h-3 text-emerald-400" />}
        </div>
        <div className="node-body">
          {selectedBrand ? (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-[var(--node-border)]">
              <div className="w-5 h-5 rounded" style={{ backgroundColor: selectedBrand.primary_color }} />
              <span className="text-xs font-medium text-gray-200 truncate">{selectedBrand.name}</span>
              <button onClick={() => onSelect?.(null)} className="ml-auto text-gray-500 hover:text-gray-300 text-[10px]">✕</button>
            </div>
          ) : (
            <>
              <div className="max-h-28 overflow-y-auto space-y-1">
                {brands.map((b: any) => (
                  <button
                    key={b.id}
                    onClick={() => onSelect?.(b)}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 text-left transition-colors"
                  >
                    <div className="w-4 h-4 rounded flex-shrink-0 border border-[var(--node-border)]" style={{ backgroundColor: b.primary_color }} />
                    <span className="text-xs text-gray-300 truncate">{b.name}</span>
                  </button>
                ))}
              </div>
              {brands.length === 0 && <p className="text-[10px] text-gray-500 text-center py-2">Chưa có brand</p>}
              <button onClick={() => onCreateNew?.()} className="node-btn-secondary flex items-center justify-center gap-1 mt-1">
                <Plus className="w-3 h-3" /> Tạo mới
              </button>
            </>
          )}
        </div>
        <Handle type="source" position={Position.Right} />
      </div>
    </NodeWrapper>
  );
}

export default BrandNode;
