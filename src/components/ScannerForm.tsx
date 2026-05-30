import React, { useState, useEffect } from "react";
import { SAMPLE_SCANS } from "../data";
import { AnalysisResult, AnalysisInput } from "../types";
import { Sparkles, ArrowRight, CornerDownRight, CheckSquare, ShieldCheck, Zap, Laptop, FileText } from "lucide-react";

interface ScannerFormProps {
  onScanComplete: (result: AnalysisResult) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  triggerSample: (category: string) => void;
}

const SCAN_STEPS = [
  "Resolving secure DNS and verifying digital certificate path...",
  "Running SEO crawler on title keywords and Meta structures...",
  "Parsing visual hierarchies, image sizing grids, and tag attributes...",
  "Assessing checkout friction nodes and digital wallet indicators...",
  "Querying Gemini models to compute gap severity matrices...",
  "Refining final prioritized e-commerce CRO roadmap..."
];

export default function ScannerForm({ onScanComplete, isLoading, setIsLoading, triggerSample }: ScannerFormProps) {
  const [storeUrl, setStoreUrl] = useState("");
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [formError, setFormError] = useState("");
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  // Cycle scanning messages during loading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setScanStepIndex(0);
      interval = setInterval(() => {
        setScanStepIndex(prev => {
          if (prev < SCAN_STEPS.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!storeUrl || !competitorUrl || !category || !name || !email) {
      setFormError("Please fill out all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeUrl, competitorUrl, category, name, email })
      });

      if (!response.ok) {
        throw new Error("Analysis request failed. Please try again.");
      }

      const resJson = await response.json();
      if (resJson.status === "success" && resJson.data) {
        onScanComplete(resJson.data);
      } else {
        throw new Error(resJson.error || "Failed to generate report.");
      }
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div id="scanner-form-container">
      
      {/* LOADING SCREEN POPUP */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md text-white p-6" id="scanning-loader">
          <div className="max-w-md w-full text-center space-y-6">
            
            {/* Spinning Radar Logo */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/10 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent animate-spin" />
              <div className="bg-slate-900 p-4 rounded-full text-blue-400">
                <Laptop className="w-8 h-8 animate-bounce" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Constructing Gap Audit...</h2>
              <p className="text-slate-400 text-xs font-mono select-none">
                Comparing {storeUrl || "your site"} with {competitorUrl || "competitor"}
              </p>
            </div>

            {/* Current step output with check icons */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-left font-mono text-xs space-y-3 shadow-2xl">
              <div>
                <span className="text-blue-500 font-bold">ANALYZER LOGS:</span>
                <span className="text-slate-500 float-right">Step {scanStepIndex + 1}/6</span>
              </div>
              <div className="space-y-2 border-t border-slate-800 pt-3 h-28 overflow-y-auto">
                {SCAN_STEPS.slice(0, scanStepIndex).map((step, idx) => (
                  <div key={idx} className="text-emerald-400 flex items-start gap-2">
                    <span>✓</span>
                    <span>{step}</span>
                  </div>
                ))}
                <div className="text-white flex items-start gap-2 animate-pulse">
                  <span className="text-blue-400">⚡</span>
                  <span className="text-slate-300 font-semibold">{SCAN_STEPS[scanStepIndex]}</span>
                </div>
              </div>
            </div>

            <p className="text-slate-500 text-[10px] uppercase tracking-widest leading-relaxed">
              Gemini model 3.5 is compiling category benchmarks. <br />
              This takes about 10–15 seconds total.
            </p>
          </div>
        </div>
      )}

      {/* HERO SECTION MATCHING REQUEST */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 relative py-16 px-4 sm:px-6 lg:px-8 text-white text-center select-none overflow-hidden" id="hero-banner">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/15 via-transparent to-transparent opacity-80" />
        
        <div className="relative max-w-4xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/25 rounded-full text-xs font-mono uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" /> High-Intensity Auditor
          </span>
          
          <h1 className="text-3xl font-extrabold sm:text-5xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent max-w-3xl mx-auto font-sans">
            See Exactly What Your Competitor Is Doing That You're Not
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Enter your active boutique and a chief competitor URL. We will scan performance ratings, layout gaps, and conversion triggers using Gemini models to construct an on-screen roadmap block.
          </p>
        </div>
      </section>

      {/* THREE BENTO SHORTCUTS FOR SAMPLES */}
      <section className="max-w-5xl mx-auto px-4 mt-8" id="quick-presets">
        <div className="bg-slate-900/40 border border-slate-850 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl hidden sm:block">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-white">Skip the scan form & try immediate showcase?</p>
              <p className="text-xs text-slate-400">Load high-fidelity visual audits directly in one tap to test performance metrics.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => triggerSample("Fashion")}
              className="flex-grow md:flex-grow-0 px-4 py-2 border border-slate-800 hover:border-slate-700 bg-slate-900 hover:bg-slate-850 text-xs font-semibold text-slate-200 hover:text-white rounded-xl transition-all cursor-pointer"
            >
              👗 Fashion Showcase
            </button>
            <button
              onClick={() => triggerSample("Beauty")}
              className="flex-grow md:flex-grow-0 px-4 py-2 border border-slate-800 hover:border-slate-700 bg-slate-900 hover:bg-slate-850 text-xs font-semibold text-slate-200 hover:text-white rounded-xl transition-all cursor-pointer"
            >
              💄 Beauty Showcase
            </button>
          </div>
        </div>
      </section>

      {/* OVERLAPPING HERO CARD IN FORM */}
      <section className="max-w-md mx-auto px-4 py-8 relative z-10" id="main-interactive-form">
        <div className="bg-white text-slate-950 rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Analyze My Store — Free</h2>
            <p className="text-slate-500 text-xs">Complete the secure e-commerce indices to get audited checks.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Store URL */}
            <div className="space-y-1.5">
              <label htmlFor="storeUrl" className="text-xs font-semibold text-slate-700 block">Your Store URL</label>
              <input
                id="storeUrl"
                type="url"
                required
                placeholder="https://yourstore.com"
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 text-slate-900"
              />
            </div>

            {/* Competitor URL */}
            <div className="space-y-1.5">
              <label htmlFor="competitorUrl" className="text-xs font-semibold text-slate-700 block">Competitor URL</label>
              <input
                id="competitorUrl"
                type="url"
                required
                placeholder="https://competitor.com"
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 text-slate-900"
              />
            </div>

            {/* Category selection */}
            <div className="space-y-1.5">
              <label htmlFor="category" className="text-xs font-semibold text-slate-700 block">Your Product Category</label>
              <select
                id="category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 hover:border-slate-300 focus:border-blue-500 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 appearance-none cursor-pointer"
              >
                <option value="" disabled>Select Your Category</option>
                <option value="Fashion">Fashion & Apparel</option>
                <option value="Beauty">Beauty & Cosmetics</option>
                <option value="Electronics">Electronics & Hardware</option>
                <option value="Home">Home & Living decor</option>
                <option value="Other">Other Retail Niche</option>
              </select>
            </div>

            {/* Contact Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-semibold text-slate-700 block">Your Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-slate-700 block">Your Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none text-slate-900"
                />
              </div>
            </div>

            {/* Error output */}
            {formError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-xl text-center font-medium">
                ⚠️ {formError}
              </p>
            )}

            {/* Action button */}
            <button
              id="submitBtn"
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/15"
            >
              <span>Analyze My Store →</span>
            </button>

          </form>
        </div>
      </section>

      {/* NEWSLETTER AT FOOT OF CHIP */}
      <section className="bg-slate-900/40 border-t border-slate-850 py-16 px-4 text-center text-white" id="newsletter-guide">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="inline-flex p-3 bg-blue-500/10 text-blue-400 rounded-full">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Need immediate offline reading?</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Download our curated E-commerce Conversion Cheat Sheet details detailing the top 50 Shopify tactics to boost cart checkout metrics.
          </p>
          <div className="flex justify-center gap-3">
            {!pdfDownloaded ? (
              <button
                onClick={() => {
                  setPdfDownloaded(true);
                  setTimeout(() => setPdfDownloaded(false), 6000);
                }}
                className="px-6 py-2.5 bg-white text-slate-950 hover:bg-slate-100 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer"
              >
                Download PDF Playbook
              </button>
            ) : (
              <p className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-5 py-3 rounded-xl text-xs font-semibold max-w-md">
                ✓ Playbook ready! Browse the <span className="underline">CRO Checklist</span> tab above for a fully interactive checking toolkit!
              </p>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
