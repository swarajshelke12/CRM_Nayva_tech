import React from 'react';
import { useApp } from '../../context/AppContext';
import type { Screen } from '../../types';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Settings, 
  ExternalLink,
  X
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { currentScreen, setCurrentScreen, meetings } = useApp();

  const meetingsBadge = meetings.length > 0 ? `${meetings.length} Upcoming` : undefined;

  const navItems: { id: Screen; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'meetings', label: 'Meetings', icon: Calendar, badge: meetingsBadge },
    { id: 'preparation', label: 'Meeting Preparation', icon: FileText },
    { id: 'connections', label: 'Connections / Setup', icon: Settings }
  ];

  const handleNavClick = (screen: Screen) => {
    setCurrentScreen(screen);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-zinc-950 border-r border-zinc-800/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold text-sm tracking-tighter">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-zinc-100 text-sm tracking-tight">MeetPrep CRM</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300">
                  Client
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-medium">Navya Tech Solutions</p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="text-zinc-400 hover:text-zinc-100 lg:hidden p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Agency Backing Sub-banner */}
        <div className="px-3.5 py-2 mx-3 mt-3 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-zinc-300">AI Automation</span>
          </div>
          <a
            href="https://www.navyatech.co.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-0.5 transition-colors"
          >
            <span>Agency</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* 4 Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Navigation
          </div>

          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-100 font-medium border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-zinc-100' : 'text-zinc-500'}`} />
                  <span className="text-xs">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] rounded ${
                      isActive
                        ? 'bg-zinc-900 text-zinc-200 border border-zinc-700'
                        : 'bg-zinc-900 text-zinc-500 border border-zinc-850'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Client User Profile Footer */}
        <div className="p-3.5 border-t border-zinc-800/80 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-300">
              SS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-200 truncate">Swaraj Shelke</p>
              <p className="text-[11px] text-zinc-500 truncate">Navya Tech Solutions</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
