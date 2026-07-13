'use client';

import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Image as ImageIcon, X, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import NodeWrapper from './NodeWrapper';

interface ImageNodeProps {
  data: {
    files?: File[];
    onFilesAdd?: (files: File[]) => void;
    onFileRemove?: (index: number) => void;
    onDelete?: () => void;
    label?: string;
  };
}

function ImageNode({ data }: ImageNodeProps) {
  const { files = [], onFilesAdd, onFileRemove, onDelete, label } = data;

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
      <div className="node-card nowheel" style={{ width: 220 }}>
        <div className="node-header">
          <ImageIcon className="w-4 h-4 text-cyan-400" />
          <span className="text-gray-200 font-semibold">{label || 'Image Source'}</span>
          <div className="node-status-dot ml-auto" />
          {files.length > 0 && <span className="text-[10px] text-cyan-400 ml-1">{files.length}</span>}
        </div>
        <div className="node-body space-y-2">
          <p className="text-[10px] text-gray-500">Visual references</p>
          <div
            {...getRootProps()}
            className={`border border-dashed rounded-lg p-3 text-center cursor-pointer transition-all ${
              isDragActive ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-[var(--node-border)] hover:border-gray-500'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className={`w-4 h-4 mx-auto mb-1 ${isDragActive ? 'text-[var(--accent)]' : 'text-gray-500'}`} />
            <p className="text-[10px] text-gray-500">Drop images here</p>
          </div>

          {files.length > 0 && (
            <div className={`grid gap-1 ${files.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {files.map((f, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden border border-[var(--node-border)]">
                  <img src={URL.createObjectURL(f)} alt="" className="w-full aspect-square object-cover" />
                  <button
                    onPointerDown={e => e.stopPropagation()}
                    onClick={() => onFileRemove?.(i)}
                    className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
      </div>
    </NodeWrapper>
  );
}

export default ImageNode;
