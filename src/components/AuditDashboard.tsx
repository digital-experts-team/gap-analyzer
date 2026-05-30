import React, { useState } from "react";
import { AnalysisResult, AnalysisGap } from "../types";
import { 
  ArrowLeft, RefreshCw, AlertTriangle, CheckSquare, Sparkles, 
  ChevronRight, Calendar, ArrowUpRight, TrendingUp, HelpCircle, 
  Info, Cpu, Star, Gauge, Printer, Compass, Layers, CheckCircle2 
} from "lucide-react";

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

  const storeHost = result.input.storeUrl.replace(/https?:\/\/(www\.)?/, '').split('/')[0];
  const competitorHost = result.input.competitorUrl.replace(/https?:\/\/(www\.)?/, '').split('/')[0];

  return (
    <div className="bg-black text-zinc-100 min-h-screen py-6 px-4" id="audit-dashboard-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* ACTION BAR */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-500/60 hover:text-amber-500 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>New Scan</span>
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 bg-zinc-900 border border-amber-900/20 text-amber-500 rounded-lg"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>

        {/* HEADER AREA */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white">
            Audit Result
          </h1>
          <p className="text-[10px] font-bold font-mono text-zinc-500 uppercase tracking-widest">
            {storeHost} vs {competitorHost}
          </p>
        </div>

        {/* OVERALL SCORE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="overall-scores-showcase">
          <div className="bg-zinc-950 border border-amber-900/30 p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 text-amber-500">
              <Cpu className="w-24 h-24" />
            </div>
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/60">Strength Index</span>
              <div className="flex items-center gap-6">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-zinc-500 uppercase">You</p>
                  <p className="text-4xl font-black text-white">{result.overallScore.yourStore}</p>
                </div>
                <div className="h-10 w-px bg-amber-900/20" />
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-zinc-500 uppercase">Target</p>
                  <p className="text-4xl font-black text-amber-500">{result.overallScore.competitorStore}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-amber-900/30 p-6 rounded-3xl flex flex-col justify-center">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white mb-2">Review</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-medium line-clamp-3">
              {result.summary}
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="bg-zinc-950 border border-amber-900/30 rounded-3xl overflow-hidden" id="dimension-deepdive">
          <div className="grid grid-cols-4 border-b border-amber-900/20 bg-black/40">
            {["cro", "seo", "visuals", "trust"].map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedMetricTab(tab as any)}
                className={`py-3 text-[9px] font-black uppercase tracking-widest transition-all ${
                  selectedMetricTab === tab ? "bg-amber-600 text-black" : "text-zinc-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-6">
            <div className="space-y-4 text-center">
              <div className="flex justify-around items-center gap-4">
                <div className="text-center">
                  <span className="text-[8px] font-bold text-zinc-600 uppercase block mb-1">Your Store</span>
                  <span className="text-2xl font-black text-white">{result.metrics[selectedMetricTab].mine}</span>
                </div>
                <div className="text-center">
                  <span className="text-[8px] font-bold text-zinc-600 uppercase block mb-1">Target</span>
                  <span className="text-2xl font-black text-amber-500">{result.metrics[selectedMetricTab].theirs}</span>
                </div>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed max-w-lg mx-auto">
                {result.metrics[selectedMetricTab].feedback}
              </p>
            </div>
          </div>
        </div>

        {/* GAPS */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-amber-500 pl-2">Critical Gaps</h2>
          <div className="space-y-3">
            {result.keyGaps.map((gap, index) => (
              <div 
                key={index} 
                className="bg-zinc-950 border border-amber-900/20 p-5 rounded-3xl space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-[11px] font-black uppercase text-white tracking-widest">{gap.area}</h4>
                  <span className="text-[8px] font-black uppercase bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20">
                    {gap.severity}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-tight">{gap.description}</p>
                <div className="bg-black/50 p-3 rounded-2xl border border-amber-900/10">
                  <p className="text-[9px] font-bold text-amber-500 mb-1 uppercase tracking-tighter">Fix Strategy</p>
                  <p className="text-[10px] text-zinc-300 font-medium">{gap.actionItem}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROADMAP */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-amber-500 pl-2">Growth Plan</h2>
          <div className="bg-zinc-900 border border-amber-900/30 rounded-3xl p-6 space-y-6">
            {[
              { title: "Day 1", list: result.roadmap.immediate, color: "text-amber-500" },
              { title: "Week 1", list: result.roadmap.medium, color: "text-amber-400" },
              { title: "Month 1", list: result.roadmap.longTerm, color: "text-amber-300" }
            ].map(stage => (
              <div key={stage.title} className="space-y-3">
                <h4 className={`text-[10px] font-black uppercase tracking-widest ${stage.color}`}>{stage.title}</h4>
                <div className="space-y-2">
                  {stage.list.map((item, i) => {
                    const key = `${stage.title}_${i}`;
                    const isDone = !!checkedRoadmapItems[key];
                    return (
                      <div 
                        key={key}
                        onClick={() => toggleRoadmapItem(key)}
                        className={`p-3 rounded-xl text-[10px] font-medium border flex items-center gap-3 transition-all cursor-pointer ${
                          isDone ? "bg-black/40 border-zinc-800 text-zinc-700" : "bg-black border-amber-900/10 text-zinc-400"
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-sm border ${isDone ? "bg-amber-600 border-amber-600" : "border-amber-900/40"}`} />
                        <span className={isDone ? "line-through" : ""}>{item}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
