import React, { useState, useEffect, useRef } from "react";
import { animate, motion } from "motion/react";
import { AnalysisResult, AnalysisGap } from "../types";
import { 
  ArrowLeft, RefreshCw, AlertTriangle, CheckSquare, Sparkles, 
  ChevronRight, Calendar, ArrowUpRight, TrendingUp, HelpCircle, 
  Info, Cpu, Star, Gauge, Printer, Compass, Layers, CheckCircle2 
} from "lucide-react";

interface AnimatedScoreNumberProps {
  value: number;
  className?: string;
}

function AnimatedScoreNumber({ value, className = "" }: AnimatedScoreNumberProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(0, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate(val) {
        node.textContent = Math.round(val).toString();
      }
    });

    return () => controls.stop();
  }, [value]);

  return <span ref={nodeRef} className={className}>0</span>;
}

interface AuditDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function AuditDashboard({ result, onReset }: AuditDashboardProps) {
  const [selectedMetricTab, setSelectedMetricTab] = useState<"cro" | "seo" | "visuals" | "trust">("cro");
  const [checkedRoadmapItems, setCheckedRoadmapItems] = useState<Record<string, boolean>>({});

  const toggleRoadmapItem = (key: string) => {
    setCheckedRoadmapItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getSeverityBadgeClass = (severity: "High" | "Medium" | "Low") => {
    switch (severity) {
      case "High":
        return "bg-red-950/30 text-red-400 border border-red-900/40";
      case "Medium":
        return "bg-amber-950/30 text-amber-400 border border-amber-900/40";
      default:
        return "bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20";
    }
  };

  const storeHost = result.input.storeUrl.replace(/https?:\/\/(www\.)?/, '').split('/')[0];
  const competitorHost = result.input.competitorUrl.replace(/https?:\/\/(www\.)?/, '').split('/')[0];

  return (
    <div className="bg-[#040201] text-neutral-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8" id="audit-dashboard-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* UPPER NAVIGATION CONTROLS */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-900 pb-5">
          <div className="space-y-1">
            <button
              onClick={onReset}
              className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>&larr; Back to Scanner Form</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1 uppercase font-display">
              Comparative Audit Report
            </h1>
            <p className="text-neutral-400 text-xs font-mono">
              Report Generated for <span className="text-white font-semibold">{result.input.name}</span> • Category: <span className="text-[#f97316] font-semibold">{result.input.category}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <button
              onClick={() => {
                window.print();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0c0a09] border border-neutral-900 text-xs text-neutral-300 rounded-lg hover:border-neutral-800 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export PDF / Print</span>
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#f97316] hover:bg-[#ea580c] text-black text-xs font-extrabold uppercase tracking-wide rounded-lg cursor-pointer shadow-md shadow-[#f97316]/10 active:scale-95 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Analyze Another</span>
            </button>
          </div>
        </div>

        {/* TOP LEVEL OVERALL SCORE MATCHING CODES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="overall-scores-showcase">
          
          {/* Main comparative score card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#0c0a09] to-[#040201] border border-neutral-900 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-[#f97316]">
              <Cpu className="w-40 h-40 animate-pulse" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center font-mono">
                <span className="px-3 py-0.5 bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20 rounded-full text-[10px] uppercase tracking-wider font-bold">
                  Comparative Strength Quotient
                </span>
                <span className="text-[10px] text-neutral-550">Real-Time Calculus</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                {/* Your card */}
                <div className="bg-[#040201]/95 border border-neutral-900 p-4 rounded-xl space-y-2 relative">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">Your Core Store Strength</span>
                  <div className="flex items-baseline gap-2">
                    <AnimatedScoreNumber value={result.overallScore.yourStore} className="text-5xl font-black text-red-500 font-display" />
                    <span className="text-neutral-500 text-sm font-mono">/ 100</span>
                  </div>
                  <div className="w-full bg-[#1c1917] h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.overallScore.yourStore}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="bg-red-500 h-full rounded-full" 
                    />
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed font-mono mt-2 truncate">
                    {storeHost}
                  </p>
                </div>

                {/* Competitor's card */}
                <div className="bg-[#040201]/95 border border-neutral-900 p-4 rounded-xl space-y-2 relative">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Competitor Index Rating</span>
                  <div className="flex items-baseline gap-2">
                    <AnimatedScoreNumber value={result.overallScore.competitorStore} className="text-5xl font-black text-[#f97316] font-display" />
                    <span className="text-neutral-500 text-sm font-mono">/ 100</span>
                  </div>
                  <div className="w-full bg-[#1c1917] h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.overallScore.competitorStore}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="bg-[#f97316] h-full rounded-full" 
                    />
                  </div>
                  <p className="text-[11px] text-[#f97316] leading-relaxed font-mono mt-2 truncate">
                    {competitorHost}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-neutral-900 pt-4 flex items-center justify-between font-mono">
              <div>
                <p className="text-xs text-neutral-400">Total detected opportunity gap:</p>
                <p className="text-sm font-semibold text-white mt-0.5">
                  Improvement potential of +{result.overallScore.competitorStore - result.overallScore.yourStore} Strength points
                </p>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                ⚠️ OPPORTUNITY EXISTS
              </span>
            </div>
          </div>

          {/* Executive review card */}
          <div className="bg-[#0c0a09] border border-neutral-900 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-mono">
                <Compass className="w-5 h-5 text-[#f97316]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">Executive Brief</h3>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                {result.summary}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-950 text-xs text-neutral-500 flex items-center gap-2 font-mono">
              <div className="bg-[#f97316]/10 p-1 rounded text-[#f97316]">
                <Star className="w-4 h-4" />
              </div>
              <span>Audited with standard 50-point CRO indices schemas.</span>
            </div>
          </div>

        </div>

        {/* DIMENSION TABS AND SIDE BY SIDE RATINGS */}
        <div className="bg-[#0c0a09] border border-neutral-900 rounded-2xl overflow-hidden shadow-xl" id="dimension-deepdive">
          
          {/* Header tabs selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-neutral-900 bg-[#040201]/40 font-mono">
            {[
              { id: "cro", label: "CRO & Funnels" },
              { id: "seo", label: "SEO & Speeds" },
              { id: "visuals", label: "Visual premium" },
              { id: "trust", label: "Security & Trust" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedMetricTab(tab.id as any)}
                className={`py-4 px-4 sm:px-6 text-xs font-semibold uppercase tracking-wider transition-all border-r border-neutral-900 cursor-pointer ${
                  selectedMetricTab === tab.id
                    ? "bg-[#0c0a09] text-[#f97316] border-b-2 border-b-[#f97316]"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900/20"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <div className="p-6">
            {(() => {
              const metricKey = selectedMetricTab;
              const metricData = result.metrics[metricKey];
              const titleMap = {
                cro: "Conversion Rate Optimization Gaps (CRO)",
                seo: "Search Engine Optimization & Core Vitals (SEO)",
                visuals: "Visual Layout & Style Premium Branding (Visuals)",
                trust: "Payment Trust Badging & Security policies (Trust)"
              };

              return (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left column values comparison */}
                  <div className="lg:col-span-1 space-y-6">
                    <h3 className="text-base font-bold text-white uppercase tracking-tight font-display">{titleMap[metricKey]}</h3>
                    
                    <div className="space-y-4">
                      {/* Metric your score */}
                      <div className="space-y-1.5 font-mono">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-neutral-400">Your Boutique Score</span>
                          <span className="text-rose-400 font-bold">{metricData.mine} / 100</span>
                        </div>
                        <div className="w-full bg-[#040201] h-2.5 rounded-full overflow-hidden">
                          <div className="bg-rose-500 h-full transition-all" style={{ width: `${metricData.mine}%` }} />
                        </div>
                      </div>

                      {/* Metric competitor score */}
                      <div className="space-y-1.5 font-mono">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-neutral-400 font-bold">Competitor Benchmark</span>
                          <span className="text-[#f97316] font-bold">{metricData.theirs} / 100</span>
                        </div>
                        <div className="w-full bg-[#040201] h-2.5 rounded-full overflow-hidden">
                          <div className="bg-[#f97316] h-full transition-all" style={{ width: `${metricData.theirs}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#040201] border border-neutral-900 p-4 rounded-xl text-xs flex gap-2 font-mono">
                      <HelpCircle className="w-4 h-4 text-[#f97316] flex-shrink-0 mt-0.5" />
                      <p className="text-neutral-400 leading-relaxed font-sans">
                        This index rating compares active page indicators against industry standards for e-commerce categories.
                      </p>
                    </div>

                  </div>

                  {/* Right column detailed comparison */}
                  <div className="lg:col-span-2 bg-[#040201]/40 border border-neutral-900 p-5 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono tracking-wider font-bold text-neutral-500 uppercase block mb-3">AI Comparison Analysis</span>
                      <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                        {metricData.feedback}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-neutral-900 flex flex-wrap gap-2 text-xs font-mono">
                      <span className="bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-800 text-[10px] text-neutral-400">
                        Target Area: {selectedMetricTab.toUpperCase()} Analysis
                      </span>
                    </div>

                  </div>

                </div>
              );
            })()}
          </div>

        </div>

        {/* COMPREHENSIVE ROADMAP CHANNELS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="gaps-roadmap-grid">
          
          {/* Key detected gaps layout */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#f97316]" />
              <h2 className="text-lg font-bold font-display uppercase tracking-wider text-white">Key Conversion Gaps Detected</h2>
            </div>

            <div className="space-y-3">
              {result.keyGaps.map((gap, index) => (
                <div 
                  key={index} 
                  className={`bg-[#0c0a09] border border-neutral-900 hover:border-[#f97316]/30 p-5 rounded-2xl flex flex-col justify-between gap-4 transition-all relative ${
                    gap.severity === "High" ? "shadow-md shadow-red-500/5 border-l-4 border-l-red-500" : ""
                  }`}
                  id={`gap-item-${index}`}
                >
                  
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider ${getSeverityBadgeClass(gap.severity)}`}>
                        {gap.severity} Priority
                      </span>
                      <h4 className="text-base font-bold font-display uppercase text-white tracking-tight mt-1">{gap.area}</h4>
                    </div>
                    {gap.severity === "High" && <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 animate-bounce mt-1" />}
                  </div>

                  <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                    {gap.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#040201] p-3 rounded-xl font-mono">
                    <div className="space-y-1">
                      <span className="text-neutral-500 font-bold block text-[10px] uppercase tracking-wider">Your Store Status:</span>
                      <span className="text-neutral-300 block">{gap.yourStatus}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[#f97316] font-bold block text-[10px] uppercase tracking-wider">Competitor Advantage:</span>
                      <span className="text-neutral-300 block">{gap.competitorStatus}</span>
                    </div>
                  </div>

                  <div className="border-t border-neutral-950 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                    <div>
                      <span className="text-neutral-500">Impact Opportunity Score:</span>
                      <span className="text-[#f97316] font-bold ml-1">{gap.impactScore} / 100</span>
                    </div>
                    
                    <div className="bg-[#1c1917] border border-neutral-900 text-neutral-200 py-2 px-3 rounded-lg text-xs leading-relaxed max-w-sm">
                      <span className="font-bold text-[10px] uppercase block text-[#f97316] mb-0.5">ACTION ITEM ROADMAP:</span>
                      {gap.actionItem}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Actionable prioritized chronological roadmap */}
          <div className="space-y-4 font-mono">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#f97316]" />
              <h2 className="text-lg font-bold font-display uppercase tracking-wider text-white">AI Implementation</h2>
            </div>

            <div className="bg-[#0c0a09] border border-neutral-900 rounded-2xl p-5 space-y-6 shadow-xl" id="implementation-timeline-card">
              
              {/* Daily priorities */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5">
                  <span className="bg-[#f97316] text-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
                  <h4 className="text-xs font-bold uppercase text-[#f97316] tracking-wider">Immediate (1-Day Actions)</h4>
                </div>
                <div className="space-y-2">
                  {result.roadmap.immediate.map((action, idx) => {
                    const key = `imm_${idx}`;
                    const isChecked = !!checkedRoadmapItems[key];
                    return (
                      <div 
                        key={key}
                        onClick={() => toggleRoadmapItem(key)}
                        className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 cursor-pointer transition-all ${
                          isChecked 
                            ? "bg-[#040201] border-neutral-900 text-neutral-500" 
                            : "bg-[#040201]/60 border-neutral-900 hover:border-neutral-800 hover:bg-[#040201] text-neutral-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="mt-0.5 pointer-events-none accent-[#f97316] cursor-pointer text-[#040201]"
                        />
                        <span className={isChecked ? "line-through decoration-neutral-800" : ""}>{action}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Weekly priorities */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5">
                  <span className="bg-amber-600 text-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
                  <h4 className="text-xs font-bold uppercase text-amber-500 tracking-wider">Tactical (7-Day Adjustments)</h4>
                </div>
                <div className="space-y-2">
                  {result.roadmap.medium.map((action, idx) => {
                    const key = `med_${idx}`;
                    const isChecked = !!checkedRoadmapItems[key];
                    return (
                      <div 
                        key={key}
                        onClick={() => toggleRoadmapItem(key)}
                        className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 cursor-pointer transition-all ${
                          isChecked 
                            ? "bg-[#040201] border-neutral-900 text-neutral-500" 
                            : "bg-[#040201]/60 border-neutral-900 hover:border-neutral-800 hover:bg-[#040201] text-neutral-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="mt-0.5 pointer-events-none accent-amber-500 cursor-pointer text-[#040201]"
                        />
                        <span className={isChecked ? "line-through decoration-neutral-800" : ""}>{action}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Monthly priorities */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5">
                  <span className="bg-[#f97316]/50 text-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">3</span>
                  <h4 className="text-xs font-bold uppercase text-[#f97316]/75 tracking-wider">Strategic (30-Day Redesigns)</h4>
                </div>
                <div className="space-y-2">
                  {result.roadmap.longTerm.map((action, idx) => {
                    const key = `long_${idx}`;
                    const isChecked = !!checkedRoadmapItems[key];
                    return (
                      <div 
                        key={key}
                        onClick={() => toggleRoadmapItem(key)}
                        className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 cursor-pointer transition-all ${
                          isChecked 
                            ? "bg-[#040201] border-neutral-900 text-neutral-500" 
                            : "bg-[#040201]/60 border-neutral-900 hover:border-neutral-800 hover:bg-[#040201] text-neutral-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="mt-0.5 pointer-events-none accent-[#f97316] cursor-pointer text-[#040201]"
                        />
                        <span className={isChecked ? "line-through decoration-neutral-800" : ""}>{action}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
