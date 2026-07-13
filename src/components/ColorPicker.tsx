'use client';

import { HexColorPicker } from 'react-colorful';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

export default function ColorPicker({ color, onChange, label = 'Màu chủ đạo' }: ColorPickerProps) {
  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="flex items-start gap-4">
        <HexColorPicker color={color} onChange={onChange} style={{ width: '180px', height: '160px' }} />
        <div className="space-y-2">
          <div
            className="w-16 h-16 rounded-xl border border-gray-200 shadow-sm"
            style={{ backgroundColor: color }}
          />
          <input
            type="text"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-24 px-2 py-1 text-sm rounded-lg border border-gray-200 font-mono text-center"
            placeholder="#000000"
          />
        </div>
      </div>
    </div>
  );
}
