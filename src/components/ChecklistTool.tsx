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
    if (window.confirm("Reset all checked items?")) {
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

  const categories = ["All", "Homepage", "Product Page", "Cart & Checkout", "SEO & Speed", "Trust"];

  const filteredItems = items.filter(item => {
    const matchesCat = activeCategory === "All" || item.category.includes(activeCategory) || (activeCategory === "Trust" && item.category.includes("Trust"));
    const matchesImpact = impactFilter === "All" || item.impact === impactFilter;
    const matchesDiff = difficultyFilter === "All" || item.difficulty === difficultyFilter;
    return matchesCat && matchesImpact && matchesDiff;
  });

  const highImpactCompleted = items.filter(i => i.impact === "High" && i.checked).length;
  const highImpactTotal = items.filter(i => i.impact === "High").length;

  return (
    <div className="bg-black text-zinc-100 min-h-screen py-8 px-4" id="checklist-tool-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* INTRO */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
            CRO <span className="text-amber-500">Playbook</span>
          </h1>
          <p className="text-zinc-500 text-xs font-medium max-w-sm mx-auto">
            Elite tactics for world-class storefronts.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-950 border border-amber-900/30 p-5 rounded-3xl text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Growth Score</p>
            <p className="text-3xl font-black text-amber-500">{completionPercent}%</p>
          </div>
          <div className="bg-zinc-950 border border-amber-900/30 p-5 rounded-3xl text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Critical Hits</p>
            <p className="text-3xl font-black text-white">{highImpactCompleted}/{highImpactTotal}</p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-zinc-900 border border-amber-900/20 rounded-3xl p-4 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat
                    ? "bg-amber-600 text-black shadow-lg shadow-amber-500/10"
                    : "text-zinc-600 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex justify-between items-center bg-black/40 p-3 rounded-2xl">
            <div className="flex gap-4">
              <select
                value={impactFilter}
                onChange={(e) => setImpactFilter(e.target.value)}
                className="bg-transparent text-[10px] font-black uppercase text-amber-500 outline-none cursor-pointer"
              >
                <option value="All">Impact</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="bg-transparent text-[10px] font-black uppercase text-zinc-500 outline-none cursor-pointer"
              >
                <option value="All">Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <button
              onClick={resetChecklist}
              className="text-[9px] font-black uppercase text-zinc-700 hover:text-red-500 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-2">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`group border rounded-2xl p-4 flex items-center gap-4 transition-all cursor-pointer ${
                item.checked
                  ? "bg-zinc-950 border-amber-500/20"
                  : "bg-black border-amber-900/10 hover:border-amber-900/30"
              }`}
            >
              <div className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border transition-all ${
                item.checked ? "bg-amber-600 border-amber-600 text-black" : "border-zinc-800"
              }`}>
                {item.checked && <Check className="w-3.5 h-3.5 stroke-[4]" />}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between gap-2">
                  <h4 className={`text-[11px] font-black uppercase tracking-tight ${
                    item.checked ? "text-zinc-700 line-through" : "text-white"
                  }`}>
                    {item.title}
                  </h4>
                  <span className={`text-[8px] font-bold uppercase rounded px-1.5 py-0.5 ${
                    item.impact === "High" ? "bg-amber-500/10 text-amber-500" : "bg-zinc-900 text-zinc-600"
                  }`}>
                    {item.impact}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-600 leading-tight mt-1 truncate">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
