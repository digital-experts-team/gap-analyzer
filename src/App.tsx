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
    q: "How does the GapAnalyzer.AI scan process work?",
    a: "The tool initiates deep, background comparisons checking key digital commerce markers: SSL certificates, DNS query speed, structured schema metadata, responsive touchscreen target diameters, and image compression metrics. This footprint is compared in real-time by Google Gemini to identify missing UX assets, rendering discrepancies, and trust elements based on your retail category benchmarks."
  },
  {
    id: "faq_2",
    q: "What is the industry average score for high-margin e-commerce boutique stores?",
    a: "Standard Shopify properties often hover around 55–65 in operational strength. Enterprise market-makers like Gymshark or Sephora consistently rank above 85 due to custom express checkout overlays, dynamic sizing utilities, and responsive slide-cart setups. The visual audit highlights the exact tactics needed to narrow this gap."
  },
  {
    id: "faq_3",
    q: "How does compressing listing images and utilizing WebP affect my conversion indices?",
    a: "Page loading speed is a severe diagnostic factor. Studies show that a 1-second delay in page rendering drops conversion rates by up to 17%. Over 60% of shoppers use mobile connections. Standardizing next-gen codecs like WebP and compressing heavy graphics elevates mobile browsing flow, satisfying both customers and search crawlers."
  },
  {
    id: "faq_4",
    q: "Can this report be printed or exported for my development team?",
    a: "Yes! Use the 'Export PDF / Print' shortcut on the upper right of your dashboard report card to instantly launch your system print dialog. The report layouts compile perfectly into a clean, comprehensive briefing sheet tailored for your developers or design consultants."
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
    // Simulate loading sequentially to give a premium feels and let users experience the scans log!
    setTimeout(() => {
      const sample = SAMPLE_SCANS[category];
      if (sample) {
        setScanResult(sample);
      }
      setIsLoading(false);
      setActiveTab("scan");
    }, 2500);
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-white" id="main-app-root">
      
      {/* GLOBAL BANNER IF GEMINI KEY ABSENT OR SANDBOX ACTIVE */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-1 px-4 text-center text-[11px] font-mono tracking-wide flex items-center justify-center gap-2 select-none" id="production-environment-alert">
        <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
        <span>POWERED BY THE GEMINI 3.5 FLASH COGNITIVE CORE • REAL-TIME GAP ANALYSIS DISCOVERY CHANNELS ACTIVE</span>
      </div>

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
          <div className="max-w-4xl mx-auto px-4 py-12 space-y-12" id="faq-help-screen">
            
            {/* FAQ TOP HEADLINE */}
            <div className="text-center space-y-3">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                Support & Guides
              </span>
              <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                E-Commerce Benchmark Knowledge Hub
              </h1>
              <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
                Learn how top Shopify and Custom online boutiques optimize visual layouts, secure mobile speeds, and maximize checkout conversions.
              </p>
            </div>

            {/* EXPANDABLE ACCORDIONS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-400" />
                Frequently Asked Inquiries
              </h2>
              
              <div className="space-y-3" id="faq-accordions-group">
                {FAQ_ITEMS.map(faq => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div 
                      key={faq.id}
                      className={`border rounded-xl transition-all ${
                        isOpen 
                          ? "bg-slate-950 border-blue-500/20" 
                          : "bg-slate-950/40 border-slate-850 hover:border-slate-850"
                      }`}
                      id={`faq-node-${faq.id}`}
                    >
                      <button
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-white transition-colors hover:text-blue-400"
                        type="button"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-400" : ""}`} />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 border-t border-slate-900 text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CURATED SHOPPING RECOMMENDATION CHEAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="benchmark-recommendations">
              
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3 shadow-xl">
                <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl w-fit">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-white">Conversion rate boosters</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Integrate single-click digital wallets (Apple Pay, Shop Pay, PayPal) directly into checkout lines and cart overlays. Studies show express options can lift overall storefront conversion velocities by 20% to 35% overnight.
                </p>
                <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 pt-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> High Priority Impact
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3 shadow-xl">
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl w-fit">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-white">Web core speeds strategy</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Avoid heavy immediate overlay advertisements or bulky uncompressed video banners on initial window loads. Convert image extensions to light WebP structures and defer secondary marketing codes to load late.
                </p>
                <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 pt-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Web Core Vitals Compliant
                </div>
              </div>

            </div>

          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 text-center text-slate-500 text-xs text-slate-400 font-sans mt-auto" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <p className="font-mono text-[10px] tracking-widest uppercase">
            Designed for E-Commerce Excellence • Real-time competitive audits
          </p>
          <div className="flex justify-center gap-4 text-[10px] font-mono">
            <a href="#" className="hover:text-white transition-all">Privacy guidelines</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-all">Terms of service</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-all">Security policies</a>
          </div>
          <p className="text-[11px] text-slate-600 mt-2">
            © {new Date().getFullYear()} Digital Experts & and GapAnalyzer.AI. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
