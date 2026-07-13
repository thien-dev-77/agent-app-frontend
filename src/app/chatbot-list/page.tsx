'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Bot,
  Plus,
  Trash2,
  Pencil,
  Loader2,
  Zap,
  Clock,
  X,
  Search,
  LayoutGrid,
  List,
} from 'lucide-react';
import { getChatbots, createChatbot, deleteChatbot } from '@/lib/api';
import { AppShell, Header } from '@/components/layout';
import { StatusIndicator, DataTable, Column } from '@/components/dashboard';

const BOT_GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-pink-500',
  'from-emerald-500 to-teal-600',
  'from-orange-400 to-red-500',
  'from-cyan-500 to-blue-500',
  'from-pink-500 to-rose-500',
];

export default function ChatbotListPage() {
  const [chatbots, setChatbots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadBots();
  }, []);

  const loadBots = async () => {
    try {
      setLoading(true);
      setChatbots(await getChatbots());
    } catch {
      toast.error('Lỗi tải danh sách');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) {
      toast.error('Nhập tên chatbot');
      return;
    }
    try {
      setCreating(true);
      await createChatbot({
        name: newName.trim(),
        description: newDesc.trim() || undefined,
      });
      toast.success('Đã tạo chatbot');
      setNewName('');
      setNewDesc('');
      setShowCreate(false);
      loadBots();
    } catch {
      toast.error('Lỗi');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, name: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!confirm(`Xóa chatbot "${name}"?`)) return;
    try {
      await deleteChatbot(id);
      toast.success('Đã xóa');
      loadBots();
    } catch {
      toast.error('Lỗi');
    }
  };

  const filteredBots = chatbots.filter(
    (bot) =>
      bot.name.toLowerCase().includes(search.toLowerCase()) ||
      bot.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Table columns for list view
  const columns: Column<any>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (row, idx) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg bg-gradient-to-br ${BOT_GRADIENTS[idx % BOT_GRADIENTS.length]} flex items-center justify-center`}
          >
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
              {row.name}
            </p>
            <p
              className="text-[11px] line-clamp-1 max-w-xs"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {row.description || 'Chưa có mô tả'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'model',
      header: 'Model',
      render: (row) => (
        <span
          className="text-[12px] flex items-center gap-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Zap className="w-3 h-3" />
          {row.model || 'gpt-4o-mini'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <StatusIndicator
          status={row.status === 'active' ? 'healthy' : 'inactive'}
          label={row.status === 'active' ? 'Hoạt động' : 'Nháp'}
          size="sm"
        />
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      sortable: true,
      render: (row) => (
        <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
          {new Date(row.created_at).toLocaleDateString('vi-VN')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '120px',
      render: (row) => (
        <div className="flex items-center gap-2 justify-end">
          <a
            href={`/chatbot-training?bot=${row.id}`}
            className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
            style={{
              background: 'var(--accent)',
              color: 'white',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            Đào tạo
          </a>
          <button
            onClick={(e) => handleDelete(row.id, row.name, e)}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AppShell>
      <Header
        title="Chatbots"
        subtitle={`${chatbots.length} chatbot đã tạo`}
        actions={
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            <Plus className="w-4 h-4" />
            Tạo chatbot
          </button>
        }
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: 'var(--text-tertiary)' }}
            />
            <input
              type="text"
              placeholder="Tìm chatbot..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg text-[13px] w-64 outline-none"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div
            className="flex items-center gap-1 p-1 rounded-lg"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            <button
              onClick={() => setView('grid')}
              className="p-2 rounded-md transition-colors"
              style={{
                background: view === 'grid' ? 'var(--bg-elevated)' : 'transparent',
                color: view === 'grid' ? 'var(--text-primary)' : 'var(--text-tertiary)',
              }}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className="p-2 rounded-md transition-colors"
              style={{
                background: view === 'list' ? 'var(--bg-elevated)' : 'transparent',
                color: view === 'list' ? 'var(--text-primary)' : 'var(--text-tertiary)',
              }}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2
              className="w-6 h-6 animate-spin"
              style={{ color: 'var(--accent)' }}
            />
          </div>
        ) : view === 'list' ? (
          <DataTable
            data={filteredBots}
            columns={columns}
            emptyMessage="Chưa có chatbot nào"
            onRowClick={(row) => (window.location.href = `/chatbot-training?bot=${row.id}`)}
          />
        ) : (
          <>
            {filteredBots.length === 0 && !showCreate ? (
              <div
                className="rounded-xl border-2 border-dashed p-20 text-center"
                style={{ borderColor: 'var(--border)' }}
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'var(--bg-elevated)' }}
                >
                  <Bot className="w-10 h-10" style={{ color: 'var(--accent)' }} />
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Chưa có chatbot nào
                </h3>
                <p
                  className="text-sm mb-6 max-w-sm mx-auto"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Tạo chatbot đầu tiên để bắt đầu đào tạo AI tư vấn tự động
                </p>
                <button
                  onClick={() => setShowCreate(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
                  style={{ background: 'var(--accent)', color: 'white' }}
                >
                  <Plus className="w-4 h-4" /> Tạo chatbot đầu tiên
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredBots.map((bot, idx) => (
                  <a
                    key={bot.id}
                    href={`/chatbot-training?bot=${bot.id}`}
                    className="rounded-xl overflow-hidden transition-all duration-200 group hover:border-[var(--border-hover)]"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {/* Card header gradient */}
                    <div
                      className={`h-20 bg-gradient-to-br ${BOT_GRADIENTS[idx % BOT_GRADIENTS.length]} relative`}
                    >
                      <div className="absolute -bottom-5 left-5">
                        <div
                          className="w-12 h-12 rounded-xl shadow-lg flex items-center justify-center"
                          style={{
                            background: 'var(--bg-surface)',
                            border: '2px solid var(--bg-surface)',
                          }}
                        >
                          <Bot className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDelete(bot.id, bot.name, e)}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/20 text-white/80 hover:bg-black/40 hover:text-white opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Card body */}
                    <div className="px-5 pt-8 pb-5">
                      <h3
                        className="text-base font-semibold mb-1"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {bot.name}
                      </h3>
                      <p
                        className="text-xs mb-4 line-clamp-2 h-8"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {bot.description || 'Chưa có mô tả'}
                      </p>

                      {/* Meta */}
                      <div
                        className="flex items-center gap-3 mb-4 text-[11px]"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" /> {bot.model || 'gpt-4o-mini'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />{' '}
                          {new Date(bot.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </div>

                      {/* Actions */}
                      <div
                        className="flex items-center justify-between pt-4"
                        style={{ borderTop: '1px solid var(--border)' }}
                      >
                        <StatusIndicator
                          status={bot.status === 'active' ? 'healthy' : 'inactive'}
                          label={bot.status === 'active' ? 'Hoạt động' : 'Nháp'}
                          size="sm"
                        />
                        <span
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                          style={{
                            background: 'var(--bg-elevated)',
                            color: 'var(--text-primary)',
                          }}
                        >
                          <Pencil className="w-3 h-3" /> Đào tạo
                        </span>
                      </div>
                    </div>
                  </a>
                ))}

                {/* Add card */}
                <button
                  onClick={() => setShowCreate(true)}
                  className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 min-h-[240px] transition group hover:border-[var(--accent)]"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-[var(--accent-glow)]"
                    style={{ background: 'var(--bg-elevated)' }}
                  >
                    <Plus
                      className="w-6 h-6 transition-colors"
                      style={{ color: 'var(--text-tertiary)' }}
                    />
                  </div>
                  <div className="text-center">
                    <p
                      className="text-sm font-medium transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Tạo chatbot mới
                    </p>
                    <p
                      className="text-[11px] mt-0.5"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      Đào tạo AI tư vấn tự động
                    </p>
                  </div>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowCreate(false)}
          />
          <div
            className="relative w-full max-w-md mx-4 rounded-xl p-6"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-base font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                Tạo chatbot mới
              </h3>
              <button
                onClick={() => setShowCreate(false)}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-[13px] font-medium mb-1.5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Tên chatbot
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  placeholder="VD: Trợ lý bán hàng, Tư vấn nha khoa..."
                  className="w-full px-4 py-3 rounded-lg text-[13px] outline-none transition-all"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                  autoFocus
                />
              </div>
              <div>
                <label
                  className="block text-[13px] font-medium mb-1.5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Mô tả
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Chatbot này làm gì?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg text-[13px] outline-none resize-none transition-all"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="flex-1 px-6 py-2.5 rounded-lg text-[13px] font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: 'var(--accent)', color: 'white' }}
                >
                  {creating ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    'Tạo chatbot'
                  )}
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="px-6 py-2.5 rounded-lg text-[13px] font-medium transition-colors hover:bg-[var(--bg-hover)]"
                  style={{
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
