import React, { useState, useEffect } from "react";
import { SAMPLE_SCANS } from "../data";
import { AnalysisResult, AnalysisInput } from "../types";
import { Sparkles, ArrowRight, CornerDownRight, CheckSquare, ShieldCheck, Zap, Laptop, FileText, Link, CheckCircle2, XCircle, RefreshCw, FileCode2, Copy } from "lucide-react";

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

  // Google Apps Script States
  const [appScriptConfig, setAppScriptConfig] = useState<{ configured: boolean; url: string | null } | null>(null);
  const [testResult, setTestResult] = useState<{ status: string; message: string; snippet?: string } | null>(null);
  const [isTestingAppScript, setIsTestingAppScript] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Check status on mount
  useEffect(() => {
    const fetchAppScriptStatus = async () => {
      try {
        const response = await fetch("/api/appscript-status");
        if (response.ok) {
          const data = await response.json();
          setAppScriptConfig(data);
        }
      } catch (e) {
        console.error("Failed to check Google Apps Script connection:", e);
      }
    };
    fetchAppScriptStatus();
  }, []);

  const handleTestAppScript = async () => {
    setIsTestingAppScript(true);
    setTestResult(null);
    try {
      const response = await fetch("/api/test-appscript", {
        method: "POST"
      });
      if (response.ok) {
        const data = await response.json();
        setTestResult({
          status: data.status,
          message: data.message,
          snippet: data.responseSnippet
        });
      } else {
        setTestResult({
          status: "error",
          message: `Server validation returned error code: ${response.status}`
        });
      }
    } catch (e: any) {
      setTestResult({
        status: "error",
        message: `Failed to reach route: ${e.message || e}`
      });
    } finally {
      setIsTestingAppScript(false);
    }
  };

  const APPS_SCRIPT_CODE = `function doPost(e) {
  try {
    // 1. Try to get the active spreadsheet (works if created via 'Extensions > Apps Script' inside the Sheet)
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Fallback: If you created this as a standalone script from script.google.com,
    // uncomment the line below and enter your Google Sheet's ID (found in the sheet browser URL):
    // var ss = SpreadsheetApp.openById("YOUR_SPREADSHEET_ID_HERE");
    
    if (!ss) {
      throw new Error("No active Spreadsheet found. Make sure this Apps Script is created via 'Extensions > Apps Script' inside your Google Sheet, or use SpreadsheetApp.openById() with your spreadsheet ID.");
    }
    
    var sheet = ss.getSheets()[0] || ss.getActiveSheet();
    if (!sheet) {
      throw new Error("Could not find any sheet tab inside your Google Spreadsheet. Please verify that a tab exists.");
    }
    
    var data = JSON.parse(e.postData.contents);
    
    // Check if test trigger
    if (data.test) {
      return ContentService.createTextOutput(JSON.stringify({ 
        status: "success", 
        message: "Successfully connected to Google Sheet of '" + ss.getName() + "'!" 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Otherwise add new row with data parameters
    sheet.appendRow([
      new Date(),
      data.id || "",
      data.name || "",
      data.email || "",
      data.storeUrl || "",
      data.competitorUrl || "",
      data.category || "",
      data.yourScore || "",
      data.competitorScore || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", synced: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("GapAnalyzer.AI Apps Script Sync is ACTIVE. Use POST to submit data.");
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

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
    <div id="scanner-form-container" className="bg-[#040201] text-white min-h-screen">
      
      {/* LOADING SCREEN POPUP */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#040201]/95 backdrop-blur-md text-white p-6" id="scanning-loader">
          <div className="max-w-md w-full text-center space-y-6">
            
            {/* Spinning Radar Logo */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#f97316]/10 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-t-[#f97316] border-r-transparent animate-spin" />
              <div className="bg-[#0c0a09] p-4 rounded-full text-[#f97316] shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                <Laptop className="w-8 h-8 animate-bounce" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight font-display">Constructing Gap Audit...</h2>
              <p className="text-neutral-400 text-xs font-mono select-none">
                Comparing {storeUrl || "your site"} with {competitorUrl || "competitor"}
              </p>
            </div>

            {/* Current step output with check icons */}
            <div className="bg-[#0c0a09] border border-neutral-900 rounded-xl p-5 text-left font-mono text-xs space-y-3 shadow-2xl">
              <div className="flex justify-between items-center">
                <span className="text-[#f97316] font-bold tracking-wider">ANALYZER LOGS:</span>
                <span className="text-neutral-500 float-right text-[10px]">Step {scanStepIndex + 1}/6</span>
              </div>
              <div className="space-y-2 border-t border-neutral-900 pt-3 h-28 overflow-y-auto">
                {SCAN_STEPS.slice(0, scanStepIndex).map((step, idx) => (
                  <div key={idx} className="text-[#f97316] flex items-start gap-2">
                    <span>✓</span>
                    <span>{step}</span>
                  </div>
                ))}
                <div className="text-white flex items-start gap-2 animate-pulse">
                  <span className="text-[#f97316]">⚡</span>
                  <span className="text-neutral-300 font-semibold">{SCAN_STEPS[scanStepIndex]}</span>
                </div>
              </div>
            </div>

            <p className="text-neutral-500 text-[10px] uppercase tracking-widest leading-relaxed">
              Gemini model is compiling e-commerce category benchmarks. <br />
              This takes about 10–15 seconds total.
            </p>
          </div>
        </div>
      )}

      {/* HERO SECTION IN DARK-SUNSET SUNRISE GLOW */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 text-white text-center select-none overflow-hidden" id="hero-banner">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-b from-orange-500/10 to-transparent blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/25 rounded-full text-[10px] font-mono uppercase tracking-wider">
            <Zap className="w-3 h-3" /> High-Intensity Auditor
          </span>
          
          <h1 className="text-4xl sm:text-6xl tracking-tight font-display font-black text-white hover:opacity-95 transition-opacity uppercase leading-none max-w-3xl mx-auto">
            OUTMARKET YOUR <span className="text-[#f97316]">COMPETITORS</span>
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-lg mx-auto font-sans leading-relaxed">
            AI-driven audit of conversion gaps and layout flaws.
          </p>
        </div>
      </section>

      {/* ONE-TAP SHOWCASES SECTION */}
      <section className="max-w-xl mx-auto px-4 mt-2" id="quick-presets">
        <div className="space-y-3">
          <span className="text-[#f97316] text-[10px] font-mono font-bold tracking-[0.2em] text-center uppercase block">
            ONE-TAP SHOWCASES
          </span>
          
          <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto">
            <button
              onClick={() => triggerSample("Fashion")}
              className="px-3 py-3 bg-[#0c0a09] border border-neutral-800 hover:border-[#f97316]/40 text-neutral-200 hover:text-white text-[10.5px] font-mono font-bold tracking-wider rounded-xl transition-all cursor-pointer hover:shadow-[0_0_12px_rgba(249,115,22,0.1)] active:scale-95"
            >
              FASHION
            </button>
            <button
              onClick={() => triggerSample("Beauty")}
              className="px-3 py-3 bg-[#0c0a09] border border-neutral-800 hover:border-[#f97316]/40 text-neutral-200 hover:text-white text-[10.5px] font-mono font-bold tracking-wider rounded-xl transition-all cursor-pointer hover:shadow-[0_0_12px_rgba(249,115,22,0.1)] active:scale-95"
            >
              BEAUTY
            </button>
            <button
              onClick={() => triggerSample("Food")}
              className="px-3 py-3 bg-[#0c0a09] border border-neutral-800 hover:border-[#f97316]/40 text-neutral-200 hover:text-white text-[10.5px] font-mono font-bold tracking-wider rounded-xl transition-all cursor-pointer hover:shadow-[0_0_12px_rgba(249,115,22,0.1)] active:scale-95"
            >
              FOOD
            </button>
          </div>
        </div>
      </section>

      {/* INTERACTIVE FORM SECTION */}
      <section className="max-w-md mx-auto px-4 py-8 relative z-10" id="main-interactive-form">
        <div className="bg-[#0c0a09]/90 text-white rounded-2xl border border-neutral-800 shadow-[0_25px_50px_rgba(0,0,0,0.8)] p-6 sm:p-8 space-y-6 relative overflow-hidden">
          
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#f97316]/50 to-transparent" />
          
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold tracking-widest text-white uppercase font-display">FREE AUDIT</h2>
            <div className="h-[2px] w-12 bg-gradient-to-r from-[#f97316] to-[#ffaa44] mx-auto mt-2" />
          </div>

          {formError && (
            <div className="p-3 bg-red-950/25 border border-red-900/30 text-red-400 text-xs rounded-xl font-mono" id="form-error-banner">
              ⚠️ {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 font-mono">
            
            {/* Store URL */}
            <div className="space-y-1">
              <input
                id="storeUrl"
                type="url"
                required
                placeholder="YOUR STORE URL"
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                className="w-full bg-[#040201] border border-neutral-800 hover:border-neutral-700 focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/20 px-4 py-3 rounded-xl text-xs focus:outline-none transition-all uppercase tracking-wider text-white placeholder:text-neutral-600 block"
              />
            </div>

            {/* Competitor URL */}
            <div className="space-y-1">
              <input
                id="competitorUrl"
                type="url"
                required
                placeholder="COMPETITOR URL"
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
                className="w-full bg-[#040201] border border-neutral-800 hover:border-neutral-700 focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/20 px-4 py-3 rounded-xl text-xs focus:outline-none transition-all uppercase tracking-wider text-white placeholder:text-neutral-600 block"
              />
            </div>

            {/* Category selection */}
            <div className="space-y-1 relative">
              <select
                id="category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#040201] border border-neutral-800 text-neutral-300 hover:border-neutral-700 focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/20 px-4 py-3 rounded-xl text-xs focus:outline-none transition-all appearance-none cursor-pointer uppercase tracking-wider font-mono block hover:animate-none"
              >
                <option value="" disabled className="text-neutral-600 bg-neutral-950">SELECT CATEGORY</option>
                <option value="Fashion" className="bg-[#0c0a09] text-white">Fashion & Apparel</option>
                <option value="Beauty" className="bg-[#0c0a09] text-white">Beauty & Cosmetics</option>
                <option value="Food" className="bg-[#0c0a09] text-white">Food & Beverage / Grocery</option>
                <option value="Electronics" className="bg-[#0c0a09] text-white">Electronics & Hardware</option>
                <option value="Home" className="bg-[#0c0a09] text-white">Home & Living decor</option>
                <option value="Other" className="bg-[#0c0a09] text-white">Other Retail Niche</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-500">
                <CornerDownRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Contact Grid: Name & Email */}
            <div className="grid grid-cols-2 gap-3">
              <input
                id="name"
                type="text"
                required
                placeholder="NAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#040201] border border-neutral-800 hover:border-neutral-700 focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/20 px-4 py-3 rounded-xl text-xs focus:outline-none transition-all uppercase tracking-wider text-white placeholder:text-neutral-600"
              />
              <input
                id="email"
                type="email"
                required
                placeholder="EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#040201] border border-neutral-800 hover:border-neutral-700 focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/20 px-4 py-3 rounded-xl text-xs focus:outline-none transition-all uppercase tracking-wider text-white placeholder:text-neutral-600"
              />
            </div>

            {/* START ANALYSIS button */}
            <button
              id="start-analysis-submit"
              type="submit"
              className="w-full bg-[#f97316] hover:bg-[#ea580c] py-4 rounded-xl text-black font-display font-black text-[12px] tracking-[0.18em] transition-all shadow-[0_4px_20px_rgba(249,115,22,0.25)] hover:shadow-[0_4px_25px_rgba(249,115,22,0.45)] uppercase flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              START ANALYSIS <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </form>
        </div>
      </section>

      {/* GOOGLE SHEET / APPS SCRIPT SYNC STATUS BANNER */}
      <section className="max-w-xl mx-auto px-4 pb-8" id="google-apps-script-monitor">
        <div className="bg-[#0c0a09] border border-neutral-900 rounded-2xl p-6 space-y-4 font-mono">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#f97316]/10 text-[#f97316] rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-white font-display uppercase tracking-wider">Sheets Lead Sync Integration</p>
                {appScriptConfig && appScriptConfig.configured ? (
                  <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE Sync Active: <span className="text-emerald-400 select-all underline font-semibold text-[10px] truncate max-w-[200px]" title={appScriptConfig.url || ""}>{appScriptConfig.url}</span>
                  </p>
                ) : (
                  <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    Pending Web Script Connection
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleTestAppScript}
                disabled={isTestingAppScript}
                className="px-3 py-1.5 bg-[#040201] border border-neutral-800 hover:border-[#f97316]/30 text-neutral-300 hover:text-white rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                {isTestingAppScript ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>Verify Setup</>
                )}
              </button>
              
              <button
                onClick={() => setShowSetupGuide(!showSetupGuide)}
                className="px-3 py-1.5 bg-neutral-900 hover:bg-[#f97316]/15 border border-neutral-800 hover:border-[#f97316]/50 text-[#f97316] rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer active:scale-95"
              >
                {showSetupGuide ? "Hide Guide" : "Setup Script"}
              </button>
            </div>
          </div>

          {/* Test results banner */}
          {testResult && (
            <div className={`p-4 rounded-xl border text-xs font-mono animate-fadeIn ${
              (testResult.status === "success" || testResult.status === "connected")
                ? "bg-emerald-950/20 border-emerald-900/30 text-emerald-400" 
                : "bg-red-950/20 border-red-900/30 text-red-400"
            }`}>
              <p className="font-bold uppercase tracking-wider">{(testResult.status === "success" || testResult.status === "connected") ? "✓ CONNECTION VERIFIED" : "✗ SYNC ENCOUNTERED ERROR"}</p>
              <p className="mt-1">{testResult.message}</p>
              {testResult.snippet && (
                <div className="mt-2.5 p-2 bg-black/60 rounded-lg text-[10px] text-neutral-300 max-h-32 overflow-y-auto border border-neutral-900 select-all">
                  Response Log: {testResult.snippet}
                </div>
              )}
            </div>
          )}

          {/* App Script Setup Guide */}
          {showSetupGuide && (
            <div className="border-t border-neutral-900 pt-5 space-y-4 animate-fadeIn text-xs text-neutral-300">
              <h3 className="font-bold text-white uppercase tracking-widest font-display text-xs">Google Apps Script Configuration Tutorial</h3>
              <p className="leading-relaxed text-neutral-400">
                To capture every single generated audit report and sync customer lead requests instantly into a Google Sheet in the background, complete this 2-minute connection:
              </p>
              
              <div className="space-y-2">
                <p className="font-semibold text-[#f97316] font-mono uppercase tracking-wider">Step 1: Code Deployment</p>
                <div className="bg-[#040201] border border-neutral-900 rounded-xl p-4.5 space-y-3 relative">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">Copy Script Engine (doPost standard):</span>
                  <button
                    onClick={handleCopyCode}
                    className="absolute top-4 right-4 p-2 bg-[#0c0a09] hover:bg-[#f97316]/20 border border-neutral-800 hover:border-[#f97316] rounded-lg text-neutral-400 hover:text-white transition-all cursor-pointer"
                    title="Copy Apps Script Source Code"
                  >
                    {copiedCode ? <CheckSquare className="w-4 h-4 text-[#f97316]" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <pre className="text-[10.5px] font-mono text-neutral-400 overflow-x-auto max-h-40 whitespace-pre scrollbar">
                    {APPS_SCRIPT_CODE}
                  </pre>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-[#f97316] font-mono uppercase tracking-wider">Step 2: Activation Setup</p>
                <ol className="list-decimal pl-5 space-y-2.5 text-neutral-400 leading-relaxed font-mono text-[11px]">
                  <li>
                    Open your Google Sheet, and navigate to <strong className="text-white">Extensions &gt; Apps Script</strong>.
                  </li>
                  <li>
                    Delete any existing template script contents inside the code workspace, paste the copied source code above, and save the script project.
                  </li>
                  <li>
                    In Apps Script, click <strong className="text-white">Deploy &gt; New Deployment</strong> (upper right corner).
                  </li>
                  <li>
                    Select deployment type <strong className="text-white">Web App</strong>. Set "Execute as" to <strong className="text-white">Me</strong> and "Who has access" to <strong className="text-white">Anyone</strong> (critical for background pipeline authorization).
                  </li>
                  <li>
                    Click <strong className="text-white">Deploy</strong>, authorize spreadsheet permission dialog alerts when prompted, and copy the final <strong className="text-white">Web App URL</strong> (which ends in `/exec`).
                  </li>
                  <li>
                    Create a new file named <strong className="text-white">.env</strong> in your workspace containing: <br />
                    <code className="text-[#f97316] select-all bg-black px-1.5 py-0.5 rounded font-bold text-[10.5px]">GOOGLE_APPS_SCRIPT_URL=YOUR_COPIED_URL</code>
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* THE GROWTH GUIDE CHEAT SHEET DOWNLOAD */}
      <section className="border-t border-neutral-900 py-16 px-4 text-center text-white space-y-6" id="newsletter-guide">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="inline-flex p-4 bg-[#f97316]/10 text-[#f97316] rounded-full border border-[#f97316]/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
            <CheckSquare className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black uppercase font-display tracking-widest text-white">GROWTH GUIDE</h2>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Get our elite 50-point Shopify conversion playbook for offline reading.
          </p>
          <div className="flex justify-center gap-3">
            {!pdfDownloaded ? (
              <button
                onClick={() => {
                  setPdfDownloaded(true);
                  setTimeout(() => setPdfDownloaded(false), 6000);
                }}
                className="px-6 py-3 bg-[#0c0a09] hover:bg-neutral-900 border border-neutral-800 hover:border-[#f97316]/30 text-white hover:text-[#f97316] rounded-xl text-[11px] font-bold font-mono tracking-widest uppercase transition-all cursor-pointer shadow-lg active:scale-95 animate-pulse hover:animate-none"
              >
                DOWNLOAD PDF PLAYBOOK
              </button>
            ) : (
              <p className="bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 px-5 py-3 rounded-xl text-xs font-mono font-semibold max-w-md animate-fadeIn">
                ✓ Playbook Ready! Check the interactive checklist items in the <span className="underline">CRO Checklist</span> tab above.
              </p>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
