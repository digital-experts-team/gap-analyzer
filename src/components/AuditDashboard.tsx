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
        return "bg-red-500/10 text-red-400 border border-red-500/30";
      case "Medium":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/30";
      default:
        return "bg-blue-500/10 text-blue-400 border border-blue-500/30";
    }
  };

  const storeHost = result.input.storeUrl.replace(/https?:\/\/(www\.)?/, '').split('/')[0];
  const competitorHost = result.input.competitorUrl.replace(/https?:\/\/(www\.)?/, '').split('/')[0];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8" id="audit-dashboard-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* UPPER NAVIGATION CONTROLS */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <button
              onClick={onReset}
              className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>&larr; Back to Scanner Form</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              Comparative Audit Report
            </h1>
            <p className="text-slate-400 text-xs font-mono">
              Report Generated for <span className="text-white font-semibold">{result.input.name}</span> • Category: <span className="text-white font-semibold">{result.input.category}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                window.print();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs font-mono rounded-lg hover:bg-slate-850 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export PDF / Print</span>
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-md shadow-blue-500/10"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Analyze Another URL</span>
            </button>
          </div>
        </div>

        {/* TOP LEVEL OVERALL SCORE MATCHING CODES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="overall-scores-showcase">
          
          {/* Main comparative score card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-blue-500">
              <Cpu className="w-40 h-40 animate-pulse" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="px-3 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/25 rounded-full text-[10px] font-mono uppercase tracking-wider">
                  Comparative Strength Quotient
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Real-Time Calculus</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                {/* Your card */}
                <div className="bg-slate-950/60 border border-slate-850/60 p-4 rounded-xl space-y-2 relative">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Your Core Store Strength</span>
                  <div className="flex items-baseline gap-2">
                    <AnimatedScoreNumber value={result.overallScore.yourStore} className="text-5xl font-black text-rose-500" />
                    <span className="text-slate-500 text-sm">/ 100</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.overallScore.yourStore}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="bg-rose-500 h-full rounded-full" 
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-2 truncate">
                    {storeHost}
                  </p>
                </div>

                {/* Competitor's card */}
                <div className="bg-slate-950/60 border border-slate-850/60 p-4 rounded-xl space-y-2 relative">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Competitor Index Rating</span>
                  <div className="flex items-baseline gap-2">
                    <AnimatedScoreNumber value={result.overallScore.competitorStore} className="text-5xl font-black text-emerald-400" />
                    <span className="text-slate-500 text-sm">/ 100</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.overallScore.competitorStore}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="bg-emerald-400 h-full rounded-full" 
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-2 truncate">
                    {competitorHost}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-800/60 pt-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Total detected opportunity gap:</p>
                <p className="text-sm font-semibold text-white mt-0.5">
                  Improvement potential of +{result.overallScore.competitorStore - result.overallScore.yourStore} Strength points
                </p>
              </div>
              <span className="text-[10px] font-mono text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full border border-yellow-400/20">
                ⚠️ OPPORTUNITY EXISTS
              </span>
            </div>
          </div>

          {/* Executive review card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">Executive Brief</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {result.summary}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-850 text-xs text-slate-400 flex items-center gap-2">
              <div className="bg-blue-500/15 p-1 rounded text-blue-400">
                <Star className="w-4 h-4" />
              </div>
              <span>Audited with standard 50-point CRO indices schemas.</span>
            </div>
          </div>

        </div>

        {/* DIMENSION TABS AND SIDE BY SIDE RATINGS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl" id="dimension-deepdive">
          
          {/* Header tabs selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-800 bg-slate-950/60">
            {[
              { id: "cro", label: "CRO & Funnels" },
              { id: "seo", label: "SEO & Speeds" },
              { id: "visuals", label: "Visual premium" },
              { id: "trust", label: "Security & Trust" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedMetricTab(tab.id as any)}
                className={`py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold transition-all border-r border-slate-800/60 ${
                  selectedMetricTab === tab.id
                    ? "bg-slate-900 text-blue-400-custom text-blue-400 border-b-2 border-b-blue-500"
                    : "text-slate-400 hover:text-white"
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
                    <h3 className="text-base font-bold text-white tracking-tight">{titleMap[metricKey]}</h3>
                    
                    <div className="space-y-4">
                      {/* Metric your score */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Your Boutique Score</span>
                          <span className="font-mono text-rose-400 font-bold">{metricData.mine} / 100</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-rose-500 h-full transition-all" style={{ width: `${metricData.mine}%` }} />
                        </div>
                      </div>

                      {/* Metric competitor score */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Competitor Benchmark</span>
                          <span className="font-mono text-emerald-400 font-bold">{metricData.theirs} / 100</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full transition-all" style={{ width: `${metricData.theirs}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl text-xs flex gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-400 leading-relaxed leading-normal">
                        This index rating compares active page indicators against industry standards for e-commerce categories.
                      </p>
                    </div>

                  </div>

                  {/* Right column detailed comparison */}
                  <div className="lg:col-span-2 bg-slate-950/40 border border-slate-850 p-5 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono tracking-wider font-bold text-slate-500 uppercase block mb-3">AI Comparison Analysis</span>
                      <p className="text-sm text-slate-300 leading-relaxed font-sans">
                        {metricData.feedback}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-850 flex flex-wrap gap-2 text-xs">
                      <span className="bg-slate-900 px-2 rounded-md border border-slate-800 text-[10px] text-slate-400">
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
              <Layers className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-bold text-white tracking-tight">Key Conversion Gaps Detected</h2>
            </div>

            <div className="space-y-3">
              {result.keyGaps.map((gap, index) => (
                <div 
                  key={index} 
                  className={`bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl flex flex-col justify-between gap-4 transition-all relative ${
                    gap.severity === "High" ? "shadow-md shadow-red-500/5 border-l-4 border-l-red-500" : ""
                  }`}
                  id={`gap-item-${index}`}
                >
                  
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider ${getSeverityBadgeClass(gap.severity)}`}>
                        {gap.severity} Priority
                      </span>
                      <h4 className="text-base font-bold text-white tracking-tight mt-1">{gap.area}</h4>
                    </div>
                    {gap.severity === "High" && <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 animate-bounce mt-1" />}
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {gap.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-xl">
                    <div className="space-y-1">
                      <span className="text-slate-500 font-bold block text-[10px] uppercase font-mono tracking-wider">Your Store Status:</span>
                      <span className="text-slate-300 block">{gap.yourStatus}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-emerald-500 font-bold block text-[10px] uppercase font-mono tracking-wider">Competitor Advantage:</span>
                      <span className="text-slate-300 block">{gap.competitorStatus}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-850 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-slate-400">Impact Opportunity Score:</span>
                      <span className="font-mono text-yellow-400 font-bold ml-1">{gap.impactScore} / 100</span>
                    </div>
                    
                    <div className="bg-blue-950/30 border border-blue-900/30 text-blue-300 py-1.5 px-3 rounded-lg text-xs leading-relaxed max-w-sm">
                      <span className="font-bold text-[10px] uppercase block font-mono text-blue-400">ACTION ITEM ROADMAP:</span>
                      {gap.actionItem}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Actionable prioritized chronological roadmap */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-bold text-white tracking-tight">AI Implementation Roadmap</h2>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6 shadow-xl" id="implementation-timeline-card">
              
              {/* Daily priorities */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5">
                  <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono">1</span>
                  <h4 className="text-xs font-mono font-bold uppercase text-blue-400 tracking-wider">Immediate (1-Day Actions)</h4>
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
                            ? "bg-slate-950 border-slate-800/80 text-slate-500" 
                            : "bg-slate-950/60 border-slate-850 hover:border-slate-800 hover:bg-slate-950 text-slate-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="mt-0.5 pointer-events-none accent-blue-500 cursor-pointer text-slate-800"
                        />
                        <span className={isChecked ? "line-through decoration-slate-700" : ""}>{action}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Weekly priorities */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5">
                  <span className="bg-yellow-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono">2</span>
                  <h4 className="text-xs font-mono font-bold uppercase text-yellow-400 tracking-wider">Tactical (7-Day Adjustments)</h4>
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
                            ? "bg-slate-950 border-slate-800/80 text-slate-500" 
                            : "bg-slate-950/60 border-slate-850 hover:border-slate-800 hover:bg-slate-950 text-slate-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="mt-0.5 pointer-events-none accent-yellow-500 cursor-pointer text-slate-800"
                        />
                        <span className={isChecked ? "line-through decoration-slate-700" : ""}>{action}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Monthly priorities */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5">
                  <span className="bg-emerald-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono">3</span>
                  <h4 className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider">Strategic (30-Day Redesigns)</h4>
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
                            ? "bg-slate-950 border-slate-800/80 text-slate-500" 
                            : "bg-slate-950/60 border-slate-850 hover:border-slate-800 hover:bg-slate-950 text-slate-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="mt-0.5 pointer-events-none accent-emerald-500 cursor-pointer text-slate-800"
                        />
                        <span className={isChecked ? "line-through decoration-slate-700" : ""}>{action}</span>
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
