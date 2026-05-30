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

  const storeHost = storeUrl ? storeUrl.replace(/https?:\/\/(www\.)?/, '').split('/')[0] : "";
  const compHost = competitorUrl ? competitorUrl.replace(/https?:\/\/(www\.)?/, '').split('/')[0] : "";

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
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl text-white p-6" id="scanning-loader">
          <div className="max-w-md w-full text-center space-y-6">
            
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-2 border-t-amber-500 border-r-transparent animate-spin" />
              <div className="bg-zinc-900 p-4 rounded-full text-amber-500">
                <Zap className="w-6 h-6 animate-bounce" />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black uppercase tracking-tighter text-amber-500">Auditing Gaps...</h2>
              <p className="text-zinc-500 text-[10px] font-mono truncate px-4">
                {storeHost || "Store"} vs {compHost || "Competitor"}
              </p>
            </div>

            <div className="bg-zinc-900/50 border border-amber-900/30 rounded-xl p-4 text-left font-mono text-[10px] space-y-2 shadow-2xl">
              {SCAN_STEPS.slice(0, scanStepIndex).map((step, idx) => (
                <div key={idx} className="text-amber-500/60 flex items-start gap-2">
                  <span>✓</span>
                  <span>{step}</span>
                </div>
              ))}
              <div className="text-white flex items-start gap-2 animate-pulse">
                <span className="text-amber-500">⚡</span>
                <span className="text-amber-500 font-bold">{SCAN_STEPS[scanStepIndex]}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="bg-black border-b border-amber-900/20 relative py-12 px-6 text-white text-center select-none overflow-hidden" id="hero-banner">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />
        
        <div className="relative max-w-xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase leading-none">
            Outmarket Your <span className="text-amber-500">Competitors</span>
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-medium">
            AI-driven audit of conversion gaps and layout flaws.
          </p>
        </div>
      </section>

      {/* QUICK SAMPLES */}
      <section className="max-w-xl mx-auto px-6 -mt-6 relative z-20" id="quick-presets">
        <div className="bg-zinc-900 border border-amber-900/30 p-4 rounded-2xl flex flex-col gap-3 shadow-2xl">
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest text-center">One-Tap Showcases</p>
          <div className="flex gap-2">
            <button
              onClick={() => triggerSample("Fashion")}
              className="flex-1 px-3 py-2 bg-black border border-amber-900/20 hover:border-amber-500/50 text-[10px] font-bold text-zinc-300 uppercase rounded-xl transition-all cursor-pointer"
            >
              Fashion
            </button>
            <button
              onClick={() => triggerSample("Beauty")}
              className="flex-1 px-3 py-2 bg-black border border-amber-900/20 hover:border-amber-500/50 text-[10px] font-bold text-zinc-300 uppercase rounded-xl transition-all cursor-pointer"
            >
              Beauty
            </button>
          </div>
        </div>
      </section>

      {/* MAIN FORM */}
      <section className="max-w-md mx-auto px-6 py-8" id="main-interactive-form">
        <div className="bg-zinc-950 border border-amber-900/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="text-center">
            <h2 className="text-lg font-black uppercase text-white tracking-widest">Free Audit</h2>
            <div className="h-0.5 w-12 bg-amber-500 mx-auto mt-2" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <input
                type="url"
                required
                placeholder="YOUR STORE URL"
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                className="w-full bg-black border border-amber-900/20 focus:border-amber-500 px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider text-amber-500 focus:outline-none transition-all placeholder:text-zinc-700"
              />
              <input
                type="url"
                required
                placeholder="COMPETITOR URL"
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
                className="w-full bg-black border border-amber-900/20 focus:border-amber-500 px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider text-amber-500 focus:outline-none transition-all placeholder:text-zinc-700"
              />
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black border border-amber-900/20 text-zinc-400 focus:border-amber-500 px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider focus:outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>SELECT CATEGORY</option>
                <option value="Fashion">Fashion</option>
                <option value="Beauty">Beauty</option>
                <option value="Electronics">Electronics</option>
                <option value="Home">Home Decor</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="NAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-amber-900/20 focus:border-amber-500 px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider text-amber-500 focus:outline-none transition-all placeholder:text-zinc-700"
              />
              <input
                type="email"
                required
                placeholder="EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-amber-900/20 focus:border-amber-500 px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider text-amber-500 focus:outline-none transition-all placeholder:text-zinc-700"
              />
            </div>

            {formError && (
              <p className="text-[10px] text-red-500 font-bold uppercase text-center">{formError}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-600 hover:bg-amber-500 text-black font-black py-4 px-6 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-xl shadow-amber-500/20 cursor-pointer"
            >
              Start Analysis
            </button>
          </form>
        </div>
      </section>

      <section className="bg-black py-12 px-6 text-center" id="newsletter-guide">
        <div className="max-w-md mx-auto space-y-4">
          <div className="inline-flex p-3 bg-amber-500/10 text-amber-500 rounded-full mb-2">
            <CheckSquare className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-black uppercase text-white tracking-widest">Growth Guide</h2>
          <p className="text-zinc-500 text-[11px] font-medium leading-relaxed">
            Get our elite 50-point Shopify conversion playbook for offline reading.
          </p>
          <div className="flex justify-center pt-2">
            {!pdfDownloaded ? (
              <button
                onClick={() => {
                  setPdfDownloaded(true);
                  setTimeout(() => setPdfDownloaded(false), 6000);
                }}
                className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-amber-500 transition-all cursor-pointer"
              >
                Download PDF
              </button>
            ) : (
              <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest bg-amber-500/10 border border-amber-500/30 px-6 py-3 rounded-xl">
                Ready! See CRO tab
              </p>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
