'use client';

import { useState } from 'react';
import {
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Save,
  Trash2,
} from 'lucide-react';

interface FlowSettingsProps {
  flowName?: string;
  flowDescription?: string;
  isActive?: boolean;
  createdAt?: string;
  lastUpdated?: string;
  version?: string;
  autoRun?: boolean;
  stopOnError?: boolean;
  timeout?: number;
  retryAttempts?: number;
  globalVariables?: { name: string; type: string; value: string }[];
  onSave?: () => void;
  onDelete?: () => void;
}

export default function FlowSettingsPanel({
  flowName = 'Shorts Content Pipeline',
  flowDescription = 'Automates script generation',
  isActive = true,
  createdAt = '24 Apr 2024',
  lastUpdated = '2 hours ago',
  version = 'v1.2.0',
  autoRun = true,
  stopOnError = true,
  timeout = 3000,
  retryAttempts = 3,
  globalVariables = [
    { name: 'payload_data', type: 'Object', value: '' },
    { name: 'target_platform', type: 'String', value: '"YT"' },
    { name: 'max_duration', type: 'String', value: '"60s"' },
  ],
  onSave,
  onDelete,
}: FlowSettingsProps) {
  const [expanded, setExpanded] = useState({
    info: true,
    details: true,
    runtime: true,
    variables: true,
  });

  const toggle = (key: keyof typeof expanded) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="settings-panel">
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--panel-border)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold" style={{ color: 'var(--text-primary)' }}>
            Flow Settings
          </span>
        </div>
        <span className="status-badge active">Active</span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Info Section */}
        <div className="settings-section">
          <button
            onClick={() => toggle('info')}
            className="settings-section-header w-full"
          >
            <span className="settings-section-title">Info</span>
            <div className="flex items-center gap-2">
              <button
                className="p-1 rounded hover:bg-[var(--bg-hover)]"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {expanded.info ? (
                <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
              ) : (
                <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
              )}
            </div>
          </button>
          {expanded.info && (
            <div className="space-y-3">
              <div>
                <label className="settings-label block mb-1">Name</label>
                <input
                  type="text"
                  defaultValue={flowName}
                  className="settings-input"
                />
              </div>
              <div>
                <label className="settings-label block mb-1">Description</label>
                <input
                  type="text"
                  defaultValue={flowDescription}
                  className="settings-input"
                />
              </div>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="settings-section">
          <button
            onClick={() => toggle('details')}
            className="settings-section-header w-full"
          >
            <span className="settings-section-title">Details</span>
            <div className="flex items-center gap-2">
              <button
                className="p-1 rounded hover:bg-[var(--bg-hover)]"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {expanded.details ? (
                <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
              ) : (
                <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
              )}
            </div>
          </button>
          {expanded.details && (
            <div className="space-y-2">
              <div className="settings-row">
                <span className="settings-label">Status</span>
                <div
                  className={`toggle-switch ${isActive ? 'active' : ''}`}
                  onClick={() => {}}
                />
              </div>
              <div className="settings-row">
                <span className="settings-label">Created</span>
                <span className="settings-value">{createdAt}</span>
              </div>
              <div className="settings-row">
                <span className="settings-label">Last Updated</span>
                <span className="settings-value">{lastUpdated}</span>
              </div>
              <div className="settings-row">
                <span className="settings-label">Version</span>
                <span className="settings-value">{version}</span>
              </div>
            </div>
          )}
        </div>

        {/* Runtime Settings */}
        <div className="settings-section">
          <button
            onClick={() => toggle('runtime')}
            className="settings-section-header w-full"
          >
            <span className="settings-section-title">Runtime Settings</span>
            <div className="flex items-center gap-2">
              <button
                className="p-1 rounded hover:bg-[var(--bg-hover)]"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {expanded.runtime ? (
                <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
              ) : (
                <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
              )}
            </div>
          </button>
          {expanded.runtime && (
            <div className="space-y-2">
              <div className="settings-row">
                <span className="settings-label">Auto-run on trigger</span>
                <div
                  className={`toggle-switch ${autoRun ? 'active' : ''}`}
                  onClick={() => {}}
                />
              </div>
              <div className="settings-row">
                <span className="settings-label">Stop on error</span>
                <div
                  className={`toggle-switch ${stopOnError ? 'active' : ''}`}
                  onClick={() => {}}
                />
              </div>
              <div className="settings-row">
                <span className="settings-label">Timeout (ms)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue={timeout}
                    className="settings-input w-20 text-right"
                  />
                  <div 
                    className="w-16 h-2 rounded-full overflow-hidden"
                    style={{ background: 'var(--bg-elevated)' }}
                  >
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        background: 'var(--accent-yellow)',
                        width: `${Math.min((timeout / 10000) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="settings-row">
                <span className="settings-label">Retry attempts</span>
                <span className="settings-value">{retryAttempts}</span>
              </div>
            </div>
          )}
        </div>

        {/* Global Variables */}
        <div className="settings-section">
          <button
            onClick={() => toggle('variables')}
            className="settings-section-header w-full"
          >
            <span className="settings-section-title">Global Variables</span>
            <div className="flex items-center gap-2">
              <button
                className="p-1 rounded hover:bg-[var(--bg-hover)]"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {expanded.variables ? (
                <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
              ) : (
                <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
              )}
            </div>
          </button>
          {expanded.variables && (
            <div className="space-y-2">
              {globalVariables.map((v, i) => (
                <div key={i} className="settings-row">
                  <span className="settings-label font-mono text-[11px]">{v.name}</span>
                  <span 
                    className="text-[11px] px-1.5 py-0.5 rounded"
                    style={{ 
                      background: 'var(--accent-blue-muted)', 
                      color: 'var(--accent-blue)' 
                    }}
                  >
                    {v.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-4 py-3 flex items-center gap-2"
        style={{ borderTop: '1px solid var(--panel-border)' }}
      >
        <button
          onClick={onSave}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium"
          style={{ background: 'var(--accent)', color: 'white' }}
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
        <button
          onClick={onDelete}
          className="p-2.5 rounded-lg"
          style={{ 
            background: 'var(--accent-red-muted)', 
            color: 'var(--accent-red)' 
          }}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
