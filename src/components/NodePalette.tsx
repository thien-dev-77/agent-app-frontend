'use client';

import { DragEvent } from 'react';
import {
  Palette,
  FileText,
  ImageIcon,
  MessageSquare,
  Sparkles,
  Video,
  Type,
  Wand2,
  Search,
  ChevronDown,
} from 'lucide-react';

export interface NodeTypeInfo {
  type: string;
  label: string;
  icon: any;
  color: string;
  description: string;
}

// Node types cũ của bạn
export const NODE_TYPES_LIST: NodeTypeInfo[] = [
  { type: 'brand', label: 'Brand', icon: Palette, color: 'violet', description: 'Chọn thương hiệu' },
  { type: 'image', label: 'Image Source', icon: ImageIcon, color: 'cyan', description: 'Upload hình input' },
  { type: 'references', label: 'References', icon: ImageIcon, color: 'amber', description: 'Style reference' },
  { type: 'aiprompt', label: 'AI Prompt', icon: Wand2, color: 'purple', description: 'AI tạo prompt từ brand' },
  { type: 'template', label: 'Template', icon: FileText, color: 'blue', description: 'Prompt mẫu' },
  { type: 'prompt', label: 'Prompt', icon: MessageSquare, color: 'emerald', description: 'Nhập prompt thủ công' },
  { type: 'generate', label: 'Generate Image', icon: Sparkles, color: 'rose', description: 'Tạo hình ảnh' },
  { type: 'video', label: 'Generate Video', icon: Video, color: 'indigo', description: 'Tạo video' },
  { type: 'text', label: 'Text Note', icon: Type, color: 'gray', description: 'Ghi chú' },
];

// Map màu cho icon backgrounds - sử dụng accent colors mới
const iconBgMap: Record<string, string> = {
  violet: 'bg-violet-500/20 text-violet-400',
  blue: 'bg-blue-500/20 text-blue-400',
  amber: 'bg-amber-500/20 text-amber-400',
  emerald: 'bg-emerald-500/20 text-emerald-400',
  indigo: 'bg-indigo-500/20 text-indigo-400',
  rose: 'bg-rose-500/20 text-rose-400',
  cyan: 'bg-cyan-500/20 text-cyan-400',
  gray: 'bg-gray-500/20 text-gray-400',
  purple: 'bg-purple-500/20 text-purple-400',
};

export default function NodePalette() {
  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="node-palette">
      {/* Header */}
      <div 
        className="px-4 py-3"
        style={{ borderBottom: '1px solid var(--panel-border)' }}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent)' }}
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <p className="text-[14px] font-semibold" style={{ color: 'var(--text-primary)' }}>
            Studio
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--panel-border)' }}>
        <div className="relative">
          <Search 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" 
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search modules..."
            className="w-full pl-9 pr-4 py-2 rounded-lg text-[12px] outline-none"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--panel-border)' }}>
        <a 
          href="/" 
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium"
          style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
        >
          <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} /> 
          Workflow
        </a>
        <a 
          href="/chatbot-list" 
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] transition hover:bg-[var(--bg-hover)]"
          style={{ color: 'var(--text-secondary)' }}
        >
          <MessageSquare className="w-3.5 h-3.5" /> 
          Chatbot
        </a>
        <a 
          href="/crm" 
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] transition hover:bg-[var(--bg-hover)]"
          style={{ color: 'var(--text-secondary)' }}
        >
          <FileText className="w-3.5 h-3.5" /> 
          CRM
        </a>
      </div>

      {/* Modules */}
      <div className="px-3 pt-3 pb-2 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-1 mb-2">
          <p 
            className="text-[11px] font-medium uppercase tracking-wider"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Modules
          </p>
          <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)' }} />
        </div>
        
        <div className="space-y-1">
          {NODE_TYPES_LIST.map((nodeInfo) => {
            const Icon = nodeInfo.icon;
            return (
              <div
                key={nodeInfo.type}
                draggable
                onDragStart={(e) => onDragStart(e, nodeInfo.type)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-grab active:cursor-grabbing transition-all hover:bg-[var(--bg-hover)]"
                style={{ border: '1px solid transparent' }}
                title={nodeInfo.description}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${iconBgMap[nodeInfo.color]}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[12px] leading-tight" style={{ color: 'var(--text-primary)' }}>
                    {nodeInfo.label}
                  </p>
                  <p className="text-[10px] truncate" style={{ color: 'var(--text-tertiary)' }}>
                    {nodeInfo.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
