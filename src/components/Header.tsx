import React from "react";
import { Sparkles, CheckSquare, BarChart3, HelpCircle } from "lucide-react";

interface HeaderProps {
  activeTab: "scan" | "checklist" | "help";
  setActiveTab: (tab: "scan" | "checklist" | "help") => void;
  hasScanResult: boolean;
}

export default function Header({ activeTab, setActiveTab, hasScanResult }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/95 border-b border-amber-900/50 text-white shadow-2xl" id="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-amber-600 p-2 rounded-lg text-black shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              id="tab-btn-scan"
              onClick={() => setActiveTab("scan")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-tight ${
                activeTab === "scan"
                  ? "bg-amber-500/10 text-amber-500 border border-amber-500/50"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{hasScanResult ? "Report" : "Scan"}</span>
            </button>

            <button
              id="tab-btn-checklist"
              onClick={() => setActiveTab("checklist")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-tight ${
                activeTab === "checklist"
                  ? "bg-amber-500/10 text-amber-500 border border-amber-500/50"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>CRO</span>
            </button>

            <button
              id="tab-btn-help"
              onClick={() => setActiveTab("help")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-tight ${
                activeTab === "help"
                  ? "bg-amber-500/10 text-amber-500 border border-amber-500/50"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>FAQ</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
