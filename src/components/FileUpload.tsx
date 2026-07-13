'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
  onRemoveFile?: (index: number) => void;
  multiple?: boolean;
  accept?: Record<string, string[]>;
  label?: string;
}

export default function FileUpload({
  onFilesSelected,
  selectedFiles,
  onRemoveFile,
  multiple = false,
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
  label = 'Kéo thả file vào đây hoặc click để chọn',
}: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept,
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload
          className={`w-10 h-10 mx-auto mb-3 ${
            isDragActive ? 'text-indigo-500' : 'text-gray-400'
          }`}
        />
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (tối đa 10MB)</p>
      </div>

      {/* Preview selected files */}
      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden border border-gray-200"
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {file.type.startsWith('image/') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {onRemoveFile && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFile(index);
                    }}
                    className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 p-2 truncate">{file.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
