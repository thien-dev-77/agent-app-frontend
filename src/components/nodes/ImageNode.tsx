'use client';

import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Image as ImageIcon, X, Upload, Plus } from 'lucide-react';
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
      <div className="node-card nowheel" style={{ width: 240, background: '#141414', border: '1px solid #2a2a2a' }}>
        {/* Header */}
        <div className="node-header" style={{ background: '#1a1a1a', borderBottom: '1px solid #2a2a2a', padding: '8px 12px' }}>
          <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-gray-200 font-semibold text-[11px]">{label || 'Image Source'}</span>
          {files.length > 0 && (
            <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-md text-cyan-400" style={{ background: 'rgba(6,182,212,0.1)' }}>
              {files.length}
            </span>
          )}
        </div>

        {/* Images grid — chiếm full width */}
        {files.length > 0 ? (
          <div className="p-1.5">
            <div className={`grid gap-1 ${files.length === 1 ? 'grid-cols-1' : files.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {files.map((f, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden" style={{ border: '1px solid #2a2a2a' }}>
                  <img
                    src={URL.createObjectURL(f)}
                    alt=""
                    className={`w-full object-cover ${files.length === 1 ? 'aspect-[4/3]' : 'aspect-square'}`}
                  />
                  <button
                    onPointerDown={e => e.stopPropagation()}
                    onClick={() => onFileRemove?.(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {/* Thêm ảnh */}
              <div
                {...getRootProps()}
                className="aspect-square rounded-lg flex items-center justify-center cursor-pointer transition-all hover:border-cyan-400"
                style={{ border: '1px dashed #333' }}
              >
                <input {...getInputProps()} />
                <Plus className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`m-2 rounded-xl p-5 text-center cursor-pointer transition-all ${
              isDragActive ? 'border-cyan-400 bg-cyan-500/5' : 'hover:border-gray-500'
            }`}
            style={{ border: '1px dashed #2a2a2a' }}
          >
            <input {...getInputProps()} />
            <Upload className={`w-5 h-5 mx-auto mb-2 ${isDragActive ? 'text-cyan-400' : 'text-gray-600'}`} />
            <p className="text-[10px] text-gray-500">Kéo thả hoặc click</p>
            <p className="text-[9px] text-gray-600 mt-0.5">PNG, JPG, WEBP</p>
          </div>
        )}

        <Handle type="target" position={Position.Left} style={{ background: '#06b6d4' }} />
        <Handle type="source" position={Position.Right} style={{ background: '#06b6d4' }} />
      </div>
    </NodeWrapper>
  );
}

export default ImageNode;
