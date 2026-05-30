import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ScannerForm from "./components/ScannerForm";
import AuditDashboard from "./components/AuditDashboard";
import ChecklistTool from "./components/ChecklistTool";
import { SAMPLE_SCANS } from "./data";
import { AnalysisResult } from "./types";
import { HelpCircle, ChevronDown, Lightbulb, Compass, Info, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";

const FAQ_ITEMS = [
  {
    id: "faq_1",
    q: "How does the audit process work?",
    a: "We scan core commerce markers like speed, SEO, checkout flow, and trust badges. Gemini AI then compares this to industry leaders to find conversion gaps."
  },
  {
    id: "faq_2",
    q: "What is a good score?",
    a: "Most Shopify stores score between 50-60. Top-tier brands like Sephora hit 85+. We show you exactly how to climb to that elite tier."
  },
  {
    id: "faq_3",
    q: "Does speed really matter?",
    a: "Yes. Every 1-second delay can drop conversions by 15%. Over 70% of shoppers are on mobile, making speed your biggest growth lever."
  },
  {
    id: "faq_4",
    q: "Can I export this report?",
    a: "Absolutely. Use the print/export button on the dashboard to save a clean PDF for your design and development teams."
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"scan" | "checklist" | "help">("scan");
  const [scanResult, setScanResult] = useState<AnalysisResult | null>(() => {
    const saved = localStorage.getItem("current_gap_analysis");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fall back
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<string | null>("faq_1");

  useEffect(() => {
    if (scanResult) {
      localStorage.setItem("current_gap_analysis", JSON.stringify(scanResult));
    } else {
      localStorage.removeItem("current_gap_analysis");
    }
  }, [scanResult]);

  const handleScanComplete = (result: AnalysisResult) => {
    setScanResult(result);
    setIsLoading(false);
    setActiveTab("scan");
  };

  const handleResetScan = () => {
    setScanResult(null);
  };

  const triggerSampleScan = (category: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const sample = SAMPLE_SCANS[category];
      if (sample) {
        setScanResult(sample);
      }
      setIsLoading(false);
      setActiveTab("scan");
    }, 2000);
  };

  return (
    <div className="bg-black min-h-screen text-zinc-100 flex flex-col font-sans selection:bg-amber-600/30 selection:text-white" id="main-app-root">
      
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        hasScanResult={!!scanResult} 
      />

      <main className="flex-grow">
        {activeTab === "scan" && (
          scanResult ? (
            <AuditDashboard result={scanResult} onReset={handleResetScan} />
          ) : (
            <ScannerForm 
              onScanComplete={handleScanComplete} 
              isLoading={isLoading} 
              setIsLoading={setIsLoading} 
              triggerSample={triggerSampleScan}
            />
          )
        )}

        {activeTab === "checklist" && (
          <ChecklistTool />
        )}

        {activeTab === "help" && (
          <div className="max-w-2xl mx-auto px-6 py-12 space-y-12" id="faq-help-screen">
            
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase sm:text-4xl">
                Commerce Knowledge
              </h1>
              <p className="text-zinc-500 text-xs font-medium max-w-sm mx-auto leading-relaxed">
                Elite strategies for conversion optimization and performance scaling.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-[11px] font-black uppercase text-amber-500 tracking-widest pl-2">
                Frequently Asked
              </h2>
              
              <div className="space-y-2" id="faq-accordions-group">
                {FAQ_ITEMS.map(faq => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div 
                      key={faq.id}
                      className={`border rounded-2xl transition-all ${
                        isOpen 
                          ? "bg-zinc-950 border-amber-500/30 shadow-lg shadow-amber-500/5" 
                          : "bg-black border-amber-900/10 hover:border-amber-900/40"
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-black text-[11px] uppercase tracking-wider text-white hover:text-amber-500 transition-colors"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-3 h-3 text-zinc-600 transition-transform ${isOpen ? "rotate-180 text-amber-500" : ""}`} />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-[11px] font-medium text-zinc-500 leading-relaxed max-w-md">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4" id="benchmark-recommendations">
              <div className="bg-zinc-950 border border-amber-900/30 p-6 rounded-3xl space-y-2">
                <h3 className="font-black text-xs uppercase text-white tracking-widest">Growth Tip</h3>
                <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                  Implement digital wallets like Apple Pay directly on product pages. It reduces friction and lifts conversions by up to 25%.
                </p>
              </div>
              <div className="bg-zinc-950 border border-amber-900/30 p-6 rounded-3xl space-y-2">
                <h3 className="font-black text-xs uppercase text-white tracking-widest">Performance Tip</h3>
                <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                  Use WebP images and defer secondary marketing scripts. Faster load times directly equate to lower bounce rates.
                </p>
              </div>
            </div>

          </div>
        )}
      </main>

      <footer className="bg-black border-t border-amber-900/10 py-10 text-center" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <p className="font-black text-[10px] tracking-[0.4em] uppercase text-zinc-700">
            E-Commerce Intelligence
          </p>
          <div className="flex justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <a href="#" className="hover:text-amber-500 transition-all">Privacy</a>
            <a href="#" className="hover:text-amber-500 transition-all">Terms</a>
            <a href="#" className="hover:text-amber-500 transition-all">Support</a>
          </div>
          <p className="text-[9px] font-bold text-zinc-800 uppercase tracking-widest">
            © {new Date().getFullYear()} Ecommerce Analyzer Suite
          </p>
        </div>
      </footer>
    </div>
  );
}
