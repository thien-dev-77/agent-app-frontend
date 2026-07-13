'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface AppShellProps {
  children: ReactNode;
  hideSidebar?: boolean;
}

export default function AppShell({ children, hideSidebar = false }: AppShellProps) {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      {!hideSidebar && <Sidebar />}
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  );
}
