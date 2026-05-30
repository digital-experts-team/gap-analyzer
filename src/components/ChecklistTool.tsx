import { useState, useEffect } from "react";
import { ChecklistItem } from "../types";
import { CRO_CHECKLIST_ITEMS } from "../data";
import { Check, Square, Award, ArrowUpCircle, Gauge, Filter, Zap, ShieldCheck } from "lucide-react";

export default function ChecklistTool() {
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem("cro_checklist_progress");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fall back to defaults
      }
    }
    return CRO_CHECKLIST_ITEMS;
  });

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [impactFilter, setImpactFilter] = useState<string>("All");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");

  useEffect(() => {
    localStorage.setItem("cro_checklist_progress", JSON.stringify(items));
  }, [items]);

  const toggleItem = (id: string) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const resetChecklist = () => {
    if (window.confirm("Are you sure you want to reset all checked items in your CRO checklist?")) {
      setItems(CRO_CHECKLIST_ITEMS.map(i => ({ ...i, checked: false })));
    }
  };

  const importAllMain = () => {
    setItems(items.map(i => ({ ...i, checked: true })));
  };

  // Stats calculation
  const totalCount = items.length;
  const completedCount = items.filter(i => i.checked).length;
  const completionPercent = Math.round((completedCount / totalCount) * 100);

  const categories = ["All", "Homepage", "Product Page", "Cart & Checkout", "SEO & Speed", "Trust & Post-Purchase"];

  const filteredItems = items.filter(item => {
    const matchesCat = activeCategory === "All" || item.category === activeCategory;
    const matchesImpact = impactFilter === "All" || item.impact === impactFilter;
    const matchesDiff = difficultyFilter === "All" || item.difficulty === difficultyFilter;
    return matchesCat && matchesImpact && matchesDiff;
  });

  const highImpactCompleted = items.filter(i => i.impact === "High" && i.checked).length;
  const highImpactTotal = items.filter(i => i.impact === "High").length;

  return (
    <div className="bg-[#040201] text-neutral-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8" id="checklist-tool-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* TOP INTRO */}
        <div className="text-center mb-10">
          <span className="px-3 py-1 bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
            Interactive Playbook
          </span>
          <h1 className="text-3xl font-bold font-display uppercase tracking-tight text-white mt-3 sm:text-4xl">
            The Free E-commerce CRO checklist
          </h1>
          <p className="text-neutral-400 mt-2 max-w-2xl mx-auto text-sm leading-relaxed">
            50 tactical optimization hacks top Shopify & Custom stores implement to secure hyper-efficient shoppers and combat average basket dropoffs.
          </p>
        </div>

        {/* METRICS SUMMARY DUO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          <div className="bg-[#0c0a09] border border-neutral-900 rounded-2xl p-6 flex items-center justify-between shadow-xl relative overflow-hidden" id="metric-completion-card">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-[#f97316]">
              <Gauge className="w-32 h-32" />
            </div>
            <div>
              <p className="text-neutral-400 text-xs font-mono uppercase tracking-wider">Overall CRO Score</p>
              <h3 className="text-5xl font-black font-display text-white mt-1">
                {completionPercent}%
              </h3>
              <p className="text-neutral-500 text-xs mt-2 font-mono">
                {completedCount} of {totalCount} optimizations active
              </p>
            </div>
            <div className="w-24 h-24 relative flex items-center justify-center">
              {/* Custom SVG Circular Progress */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  strokeWidth="8"
                  stroke="#1c1917"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  strokeWidth="8"
                  stroke="#f97316"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - completionPercent / 100)}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-[11px] font-mono font-bold text-neutral-300">
                READY
              </span>
            </div>
          </div>

          <div className="bg-[#0c0a09] border border-neutral-900 rounded-2xl p-6 shadow-xl flex flex-col justify-between" id="metric-high-priority-card">
            <div>
              <div className="flex justify-between items-center">
                <p className="text-neutral-400 text-xs font-mono uppercase tracking-wider">High-Impact Safeguards</p>
                <span className="text-[10px] bg-red-950/30 text-red-400 border border-red-900/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  CRITICAL
                </span>
              </div>
              <h3 className="text-3xl font-bold font-display text-white mt-2">
                {highImpactCompleted} / {highImpactTotal}
              </h3>
              <p className="text-neutral-400 text-xs mt-1 leading-relaxed">
                High-converting stores start with checkout shortcuts.
              </p>
            </div>
            <div className="w-full bg-[#1c1917] h-2 rounded-full overflow-hidden mt-4">
              <div 
                className="bg-[#f97316] h-full transition-all duration-700 shadow-[0_0_8px_rgba(249,115,22,0.5)]" 
                style={{ width: `${(highImpactCompleted / highImpactTotal) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-[#0c0a09] border border-neutral-900 rounded-2xl p-6 shadow-xl flex flex-col justify-between" id="metric-assessment-card">
            <div>
              <p className="text-neutral-400 text-xs font-mono uppercase tracking-wider">Store Grade</p>
              <div className="flex items-center gap-3 mt-2">
                <span className={`text-4xl font-black font-display px-4 py-1.5 rounded-xl ${
                  completionPercent >= 80 ? "bg-emerald-950/30 text-emerald-400 border border-emerald-900/20" :
                  completionPercent >= 50 ? "bg-amber-950/30 text-amber-400 border border-amber-900/20" :
                  "bg-orange-950/30 text-[#f97316] border border-[#f97316]/20"
                }`}>
                  {completionPercent >= 80 ? "A" : completionPercent >= 60 ? "B" : completionPercent >= 35 ? "C" : "D"}
                </span>
                <div>
                  <h4 className="text-sm font-bold font-display uppercase text-white">
                    {completionPercent >= 85 ? "Conversion Engine" :
                     completionPercent >= 60 ? "Growing Performer" :
                     completionPercent >= 35 ? "Moderate Gaps" : "High Risk Area"}
                  </h4>
                  <p className="text-xs text-neutral-500 font-mono mt-0.5">Industry avg: 58%</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4 text-[10px] font-mono text-neutral-500">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#f97316]" /> Actionable items
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#f97316]" /> Fully Localized
              </span>
            </div>
          </div>

        </div>

        {/* CONTROLS BAR */}
        <div className="bg-[#0c0a09] border border-neutral-900 rounded-2xl p-4 sm:p-6 mb-6 shadow-xl">
          <div className="flex flex-col gap-4">
            
            {/* Category selection */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-900 w-full scrollbar-hidden">
              <Filter className="w-4 h-4 text-neutral-600 flex-shrink-0" />
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    activeCategory === cat
                      ? "bg-[#f97316] text-black font-extrabold shadow-md shadow-[#f97316]/15"
                      : "text-neutral-400 hover:text-white hover:bg-[#1c1917]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Filter selectors */}
            <div className="flex flex-wrap items-center justify-between gap-4 font-mono">
              <div className="flex flex-wrap gap-3">
                
                {/* Impact */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Impact:</span>
                  <select
                    value={impactFilter}
                    onChange={(e) => setImpactFilter(e.target.value)}
                    className="bg-[#040201] text-neutral-200 text-xs border border-neutral-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#f97316]"
                  >
                    <option value="All">All Priorities</option>
                    <option value="High">🔴 High Impact</option>
                    <option value="Medium">🟡 Medium Impact</option>
                    <option value="Low">🟢 Low Impact</option>
                  </select>
                </div>

                {/* Difficulty */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Difficulty:</span>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="bg-[#040201] text-neutral-200 text-xs border border-neutral-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#f97316]"
                  >
                    <option value="All">All Difficulties</option>
                    <option value="Easy">Easy (1hr or less)</option>
                    <option value="Medium font-medium">Medium (1-3 days)</option>
                    <option value="Hard">Hard (Requires Developer)</option>
                  </select>
                </div>

              </div>

              {/* Utility actions */}
              <div className="flex gap-2">
                <button
                  onClick={resetChecklist}
                  className="px-3 py-1.5 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg text-xs font-mono tracking-tight transition-all cursor-pointer active:scale-95"
                >
                  Reset Checklist
                </button>
                <button
                  onClick={importAllMain}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-[#1c1917] border border-neutral-800 text-neutral-200 rounded-lg text-xs font-mono tracking-tight transition-all cursor-pointer inline-block active:scale-95"
                >
                  Mark All Completed
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* CHECKLISTS CARDS MATRIX */}
        <div className="space-y-3" id="checklist-items-grid">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-[#0c0a09] border border-neutral-900 rounded-2xl">
              <Award className="w-12 h-12 text-neutral-700 mx-auto mb-3 animate-pulse" />
              <h3 className="text-lg font-bold text-neutral-200 font-display">No optimizations match your filters</h3>
              <p className="text-neutral-500 text-xs max-w-sm mx-auto mt-1 leading-relaxed">
                Try relaxing your impact or difficulty selection parameters to view further Shopify best-practices.
              </p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`group border rounded-xl p-4 flex items-start gap-4 transition-all cursor-pointer ${
                  item.checked
                    ? "bg-[#f97316]/5 border-[#f97316]/25 hover:border-[#f97316]/50"
                    : "bg-[#0c0a09]/60 border-neutral-900 hover:bg-[#0c0a09] hover:border-neutral-800"
                }`}
                id={`check-card-${item.id}`}
              >
                
                {/* Custom Interactive Checkbox Icon */}
                <button 
                  type="button" 
                  aria-label="Toggle Check state"
                  className="mt-0.5 flex-shrink-0 focus:outline-none"
                >
                  {item.checked ? (
                    <div className="w-6 h-6 rounded-lg bg-[#f97316] text-black flex items-center justify-center transition-all scale-100 shadow-lg shadow-[#f97316]/20">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-lg border border-neutral-800 text-neutral-600 flex items-center justify-center transition-all group-hover:border-neutral-600">
                      <Square className="w-4 h-4 opacity-0" />
                    </div>
                  )}
                </button>

                {/* Content */}
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className={`text-sm font-semibold transition-all ${
                      item.checked ? "text-neutral-500 line-through decoration-neutral-700" : "text-white"
                    }`}>
                      {item.title}
                    </h4>

                    {/* Meta-badges styling */}
                    <div className="flex items-center gap-1.5 mt-1 sm:mt-0 flex-wrap">
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#1c1917] text-neutral-400 border border-neutral-800">
                        {item.category}
                      </span>
                      
                      <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border ${
                        item.impact === "High" ? "bg-red-950/20 text-red-400 border-red-900/20" :
                        item.impact === "Medium" ? "bg-amber-950/20 text-amber-400 border-amber-900/20" :
                        "bg-[#f97316]/10 text-[#f97316] border-[#f97316]/20"
                      }`}>
                        {item.impact} Impact
                      </span>

                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        item.difficulty === "Easy" ? "bg-[#1c1917] text-emerald-400" :
                        item.difficulty === "Medium" ? "bg-[#1c1917] text-amber-400" :
                        "bg-[#1c1917] text-orange-400"
                      }`}>
                        {item.difficulty}
                      </span>
                    </div>

                  </div>
                  
                  <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed max-w-3xl">
                    {item.description}
                  </p>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
