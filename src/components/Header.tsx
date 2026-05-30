import React from "react";
import { Sparkles, CheckSquare, BarChart3, HelpCircle } from "lucide-react";

interface HeaderProps {
  activeTab: "scan" | "checklist" | "help";
  setActiveTab: (tab: "scan" | "checklist" | "help") => void;
  hasScanResult: boolean;
}

export default function Header({ activeTab, setActiveTab, hasScanResult }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/95 border-b border-neutral-950 text-white shadow-lg" id="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-[#f97316] p-2 rounded-xl text-black shadow-md shadow-[#f97316]/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-white">
                GapAnalyzer<span className="text-[#f97316]">.AI</span>
              </span>
              <p className="font-mono text-[9px] tracking-widest text-[#f97316]/85 uppercase hidden sm:block">
                E-Commerce Optimization Core
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              id="tab-btn-scan"
              onClick={() => setActiveTab("scan")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider font-mono transition-all cursor-pointer ${
                activeTab === "scan"
                  ? "bg-neutral-900 text-[#f97316] border-b-2 border-[#f97316]"
                  : "text-neutral-400 hover:bg-neutral-900/50 hover:text-white"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{hasScanResult ? "My Report" : "Audit Scanner"}</span>
            </button>

            <button
              id="tab-btn-checklist"
              onClick={() => setActiveTab("checklist")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider font-mono transition-all cursor-pointer ${
                activeTab === "checklist"
                  ? "bg-neutral-900 text-[#f97316] border-b-2 border-[#f97316]"
                  : "text-neutral-400 hover:bg-neutral-900/50 hover:text-white"
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Checking Tool</span>
            </button>

            <button
              id="tab-btn-help"
              onClick={() => setActiveTab("help")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider font-mono transition-all cursor-pointer ${
                activeTab === "help"
                  ? "bg-neutral-900 text-[#f97316] border-b-2 border-[#f97316]"
                  : "text-neutral-400 hover:bg-neutral-900/50 hover:text-white"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">FAQ Guides</span>
              <span className="sm:hidden">FAQ</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
