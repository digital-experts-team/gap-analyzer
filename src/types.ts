export interface AnalysisInput {
  storeUrl: string;
  competitorUrl: string;
  category: string;
  name: string;
  email: string;
}

export interface AnalysisGap {
  area: string;
  severity: "High" | "Medium" | "Low";
  description: string;
  yourStatus: string;
  competitorStatus: string;
  impactScore: number; // 0 to 100
  actionItem: string;
}

export interface MetricDetail {
  mine: number;
  theirs: number;
  feedback: string;
}

export interface AnalysisResult {
  id: string;
  input: AnalysisInput;
  timestamp: string;
  overallScore: {
    yourStore: number;
    competitorStore: number;
  };
  metrics: {
    cro: MetricDetail;
    seo: MetricDetail;
    visuals: MetricDetail;
    trust: MetricDetail;
  };
  keyGaps: AnalysisGap[];
  roadmap: {
    immediate: string[];
    medium: string[];
    longTerm: string[];
  };
  summary: string;
}

export interface ChecklistItem {
  id: string;
  category: "Homepage" | "Product Page" | "Cart & Checkout" | "SEO & Speed" | "Trust & Post-Purchase";
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  difficulty: "Easy" | "Medium" | "Hard";
  checked: boolean;
}
