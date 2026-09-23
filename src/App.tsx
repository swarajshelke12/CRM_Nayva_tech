import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';

import { DashboardView } from './components/views/DashboardView';
import { MeetingsView } from './components/views/MeetingsView';
import { MeetingPrepView } from './components/views/MeetingPrepView';
import { ConnectionsView } from './components/views/ConnectionsView';
import { HowItWorksModal } from './components/common/HowItWorksModal';
import { ExternalLink, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentScreen, toast, dismissToast } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'meetings':
        return <MeetingsView />;
      case 'preparation':
        return <MeetingPrepView />;
      case 'connections':
        return <ConnectionsView />;
      case 'dashboard':
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-zinc-100">
      {/* How It Works User Guide Modal */}
      <HowItWorksModal />

      {/* Production Toast Notifications */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm flex items-center gap-2.5 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-750 text-xs shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />}
          <span className="text-zinc-200 flex-1 leading-snug">{toast.message}</span>
          <button
            onClick={dismissToast}
            className="text-zinc-500 hover:text-zinc-300 p-0.5 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Fixed Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <TopHeader onOpenMobile={() => setMobileOpen(true)} />

        {/* Active Screen Viewport */}
        <main className="flex-1 p-4 sm:p-6 max-w-6xl w-full mx-auto">
          {renderActiveScreen()}
        </main>

        {/* Minimal Client Portal Footer */}
        <footer className="border-t border-zinc-850 px-4 sm:px-6 py-3.5 bg-zinc-950 text-xs text-zinc-500">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-300">MeetPrep CRM</span>
              <span>·</span>
              <span className="text-zinc-400">Production AI Meeting Intelligence</span>
              <span>·</span>
              <span>Navya Tech Solutions</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-zinc-500">Managed AI Automation Client Portal</span>
              <span>·</span>
              <a
                href="https://www.navyatech.co.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
              >
                <span>navyatech.co.in</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
