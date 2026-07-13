'use client';

import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { ImageIcon, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import NodeWrapper from './NodeWrapper';

interface ReferenceNodeProps {
  data: {
    files?: File[];
    onFilesAdd?: (files: File[]) => void;
    onFileRemove?: (index: number) => void;
    onDelete?: () => void;
  };
}

function ReferenceNode({ data }: ReferenceNodeProps) {
  const { files = [], onFilesAdd, onFileRemove, onDelete } = data;

  const onDrop = useCallback((accepted: File[]) => {
    onFilesAdd?.(accepted);
  }, [onFilesAdd]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: true,
  });

  return (
    <NodeWrapper onDelete={onDelete}>
      <div className="node-card">
        <div className="node-header ">
          <ImageIcon className="w-3.5 h-3.5" />
          <span className="text-gray-200">Hình tham khảo</span>
          {files.length > 0 && <span className="mini-badge bg-amber-100 text-amber-600 ml-auto">{files.length}</span>}
        </div>
        <div className="node-body">
          <div
            {...getRootProps()}
            className={`border border-dashed rounded p-3 text-center cursor-pointer transition-all ${
              isDragActive ? 'border-amber-400 bg-white/5' : 'border-[var(--node-border)] hover:border-amber-300'
            }`}
          >
            <input {...getInputProps()} />
            <p className="text-[10px] text-gray-500">
              {isDragActive ? 'Thả vào đây...' : 'Kéo thả hoặc click'}
            </p>
          </div>
          {files.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {files.map((f, i) => (
                <div key={i} className="relative group/img w-8 h-8 rounded overflow-hidden border border-[var(--node-border)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => onFileRemove?.(i)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-[10px] text-gray-500 text-center">Tuỳ chọn</p>
        </div>
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} className="!bg-white/50" />
      </div>
    </NodeWrapper>
  );
}

export default ReferenceNode;
