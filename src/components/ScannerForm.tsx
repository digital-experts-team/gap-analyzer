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
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Check if test trigger
    if (data.test) {
      return ContentService.createTextOutput(JSON.stringify({ 
        status: "success", 
        message: "Successfully connected Google sheet to GapAnalyzer.AI lead tracker!" 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Otherwise add new row with data parameters
    sheet.appendRow([
      new Date(),
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

        {/* GOOGLE APPS SCRIPT LINK STATUS CARD */}
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl text-left" id="appscript-status-card">
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
                <Link className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Google Apps Script Status</h3>
                <p className="text-[10px] text-slate-500 font-mono">Lead spreadsheet synchronization</p>
              </div>
            </div>
            {appScriptConfig === null ? (
              <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md text-[10px] font-mono animate-pulse">
                Diagnosing...
              </span>
            ) : appScriptConfig.configured ? (
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                Linked & Active
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-md text-[10px] font-mono">
                Not Connected
              </span>
            )}
          </div>

          {appScriptConfig && (
            <div className="space-y-3">
              {appScriptConfig.configured ? (
                <div className="space-y-2">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-400">Target Web App Endpoint:</span>
                    <p className="text-xs font-mono text-blue-400 break-all select-all">
                      {appScriptConfig.url}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleTestAppScript}
                      disabled={isTestingAppScript}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-lg text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {isTestingAppScript ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Pinging Endpoint...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Test Sync Connection</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSetupGuide(!showSetupGuide)}
                      className="px-3 py-1.5 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-300 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    >
                      {showSetupGuide ? "Hide Setup Steps" : "View Setup Steps"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Automatically write client audits and lead info directly into your custom spreadsheet rows when scans run!
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowSetupGuide(!showSetupGuide)}
                    className="w-full py-2 border border-blue-500/20 hover:border-blue-500/40 bg-blue-500/5 hover:bg-blue-500/10 text-blue-400 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileCode2 className="w-4 h-4" />
                    <span>How to set up and link Google Sheets</span>
                  </button>
                </div>
              )}

              {/* TEST TRIGGER RESULT BARS */}
              {testResult && (
                <div className={`p-4 rounded-xl text-xs space-y-2 border ${
                  testResult.status === "connected" 
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
                    : "bg-red-500/5 border-red-500/20 text-red-300"
                }`} id="appscript-test-feedback">
                  <div className="flex items-center gap-2 font-bold">
                    {testResult.status === "connected" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span>
                      {testResult.status === "connected" ? "✓ CONNECTION VERIFIED" : "❌ INTER-LINK ERROR"}
                    </span>
                  </div>
                  <p className="leading-relaxed opacity-90">{testResult.message}</p>
                  {testResult.snippet && (
                    <div className="bg-slate-950/70 p-2 border border-slate-900 rounded-lg font-mono text-[10px] break-all leading-normal text-slate-400">
                      Response: {testResult.snippet}
                    </div>
                  )}
                </div>
              )}

              {/* DYNAMIC EXPANDABLE STEP SETUP GUIDE */}
              {showSetupGuide && (
                <div className="border-t border-slate-800 pt-4 space-y-4 animate-fadeIn" id="appscript-guide-details">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <FileCode2 className="w-4 h-4 text-blue-400" />
                    Quick Spreadsheet Setup Guide
                  </h4>
                  
                  <ol className="text-xs text-slate-400 space-y-3 list-decimal pl-4 leading-relaxed">
                    <li>
                      Create a new <strong>Google Sheet</strong>.
                    </li>
                    <li>
                      Go to the upper menu, choose <strong>Extensions &gt; Apps Script</strong>.
                    </li>
                    <li>
                      Delete any default sample code, and paste the code template below:
                    </li>
                  </ol>

                  {/* Copy code container */}
                  <div className="space-y-1.5" id="code-copy-container">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-t-lg border-b border-slate-900">
                      <span>apps-script-macro.js</span>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="text-xs hover:text-white transition-colors flex items-center gap-1 px-1.5 py-0.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
                      </button>
                    </div>
                    <pre className="bg-slate-950 text-slate-300 p-3 rounded-b-lg font-mono text-[9px] max-h-48 overflow-y-auto leading-normal whitespace-pre border border-slate-850">
                      {APPS_SCRIPT_CODE}
                    </pre>
                  </div>

                  <ol className="text-xs text-slate-400 space-y-3 list-decimal pl-4 leading-relaxed" start={4}>
                    <li>
                      In Google Apps Script, click <strong>Deploy &gt; New Deployment</strong> (upper right).
                    </li>
                    <li>
                      Select type <strong>Web App</strong>. Set "Execute as" to <strong>Me</strong> and "Who has access" to <strong>Anyone</strong> (this is critical for authorization).
                    </li>
                    <li>
                      Click <strong>Deploy</strong>, grant database access requests when prompted, and copy the final <strong>Web App URL</strong> (which ends in <code className="text-blue-400 font-mono">/exec</code>).
                    </li>
                    <li>
                      Paste this URL in your sandbox configuration or update the <code className="text-blue-400 font-mono">APP_URL</code> environment variable in your AI Studio settings!
                    </li>
                  </ol>
                </div>
              )}
            </div>
          )}
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
