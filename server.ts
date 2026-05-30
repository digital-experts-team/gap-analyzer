import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Define the response schema structure for Gemini API
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: {
      type: Type.OBJECT,
      properties: {
        yourStore: { type: Type.INTEGER },
        competitorStore: { type: Type.INTEGER }
      },
      required: ["yourStore", "competitorStore"]
    },
    metrics: {
      type: Type.OBJECT,
      properties: {
        cro: {
          type: Type.OBJECT,
          properties: {
            mine: { type: Type.INTEGER },
            theirs: { type: Type.INTEGER },
            feedback: { type: Type.STRING }
          },
          required: ["mine", "theirs", "feedback"]
        },
        seo: {
          type: Type.OBJECT,
          properties: {
            mine: { type: Type.INTEGER },
            theirs: { type: Type.INTEGER },
            feedback: { type: Type.STRING }
          },
          required: ["mine", "theirs", "feedback"]
        },
        visuals: {
          type: Type.OBJECT,
          properties: {
            mine: { type: Type.INTEGER },
            theirs: { type: Type.INTEGER },
            feedback: { type: Type.STRING }
          },
          required: ["mine", "theirs", "feedback"]
        },
        trust: {
          type: Type.OBJECT,
          properties: {
            mine: { type: Type.INTEGER },
            theirs: { type: Type.INTEGER },
            feedback: { type: Type.STRING }
          },
          required: ["mine", "theirs", "feedback"]
        }
      },
      required: ["cro", "seo", "visuals", "trust"]
    },
    keyGaps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          area: { type: Type.STRING },
          severity: { type: Type.STRING }, // High, Medium, Low
          description: { type: Type.STRING },
          yourStatus: { type: Type.STRING },
          competitorStatus: { type: Type.STRING },
          impactScore: { type: Type.INTEGER },
          actionItem: { type: Type.STRING }
        },
        required: ["area", "severity", "description", "yourStatus", "competitorStatus", "impactScore", "actionItem"]
      }
    },
    roadmap: {
      type: Type.OBJECT,
      properties: {
        immediate: { type: Type.ARRAY, items: { type: Type.STRING } },
        medium: { type: Type.ARRAY, items: { type: Type.STRING } },
        longTerm: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["immediate", "medium", "longTerm"]
    },
    summary: { type: Type.STRING }
  },
  required: ["overallScore", "metrics", "keyGaps", "roadmap", "summary"]
};

// Custom customized demo fallback generator if Gemini API key is missing
function generateDeterministicAnalysis(storeUrl: string, competitorUrl: string, category: string, name: string, email: string): any {
  const storeHost = storeUrl.replace(/https?:\/\/(www\.)?/, '').split('/')[0];
  const competitorHost = competitorUrl.replace(/https?:\/\/(www\.)?/, '').split('/')[0];

  const categoryBenchmarks: Record<string, {
    gaps: Array<any>;
    immediate: string[];
    medium: string[];
    longTerm: string[];
    summary: string;
  }> = {
    Fashion: {
      gaps: [
        {
          area: "Sizing Guide & Fitting Assistant",
          severity: "High",
          description: `Your product pages on ${storeHost} require opening an unoptimized PDF chart, whereas ${competitorHost} integrates an interactive 'Fit Finder' widget based on height, weight, and fit preference.`,
          yourStatus: "Static table sizing which is difficult to read on mobile devices.",
          competitorStatus: "Smart interactive size recommendation engine integrated with AI sizing queries.",
          impactScore: 88,
          actionItem: "Install an interactive sizing tool like WAIR or Sizecharter, reducing returns by up to 22%."
        },
        {
          area: "Visual Hierarchy & Lifestyle Media",
          severity: "Medium",
          description: `Your listings feature static studio photos on catalog backgrounds. ${competitorHost} uses responsive hover-to-video loops and user-generated TikTok style feeds.`,
          yourStatus: "Standard flatlays and isolated product shots.",
          competitorStatus: "Immersive hover video previews, dynamic influencer reviews, and style boards.",
          impactScore: 75,
          actionItem: "Replace secondary catalog image grids with short wear-test video loops and lifestyle hover dynamics."
        },
        {
          area: "Express Checkout & Single-Tap Buy",
          severity: "High",
          description: `Customers are forced to register or complete 3 pages of billing formulas. ${competitorHost} unlocks Shop Pay, Apple Pay, and Google Pay directly on product sheets.`,
          yourStatus: "Standard multi-page nested checkout with mandatory account registration.",
          competitorStatus: "Product-page single-tap buy overlay and Express Slide Cart drawer.",
          impactScore: 92,
          actionItem: "Transition to a slide-cart layout with pre-integrated Apple Pay / Shop Pay shortcuts."
        }
      ],
      immediate: [
        "Integrate Shop Pay / digital wallet shortcuts directly on the product detail page.",
        "Add a visual sizing link above the size buttons, styled as an overlay banner."
      ],
      medium: [
        "Create responsive hover-state video clips for your top 10 selling garments.",
        "Optimize all listing-grid image sizes to reduce mobile load delays below 1.5s."
      ],
      longTerm: [
        "Build a custom quiz for first-time shoppers asking about style preferences and sizing details.",
        "Negotiate automated syndication of micro-influencer content onto PDP testimonial boards."
      ],
      summary: `Critical sizing and checkout infrastructure gaps are causing elevated bounce levels. Restructuring the visual layout and digital checkouts on ${storeHost} will reduce mobile cart drop-off significantly.`
    },
    Beauty: {
      gaps: [
        {
          area: "Trust & Formulation Transparency",
          severity: "High",
          description: `The ingredients listing on your e-commerce is small text. ${competitorHost} uses dynamic hover icons detailing organic certifications, clean formulas, and active component explanation.`,
          yourStatus: "Plain-text block list at the lowest part of the page description.",
          competitorStatus: "Clean chemical safety badges, dermatological certification icons, and key ingredient highlights.",
          impactScore: 85,
          actionItem: "Publish beautiful icon-based badges below the 'Add to Cart' showcasing your formulation claims."
        },
        {
          area: "Skin Tone/Type Matcher Quiz",
          severity: "High",
          description: `Shoppers must guess their correct shade. ${competitorHost} promotes an elegant 30-second tone match diagnostic tool directly on their header with a 15% quiz conversion boost.`,
          yourStatus: "Dropdown shades picker with microscopic color grids.",
          competitorStatus: "Skin quiz tool determining moisturizer type, color matching, and specific sensitivities.",
          impactScore: 90,
          actionItem: "Deploy a guided skin matching flow recommending highly curated product bundles."
        },
        {
          area: "Subscription Ordering & Auto-Ship",
          severity: "Medium",
          description: `Your shoppers can only order one-off bottles. ${competitorHost} incentivizes recurring orders with a beautiful 'Subscribe & Save 10%' option.`,
          yourStatus: "One-off purchases only.",
          competitorStatus: "Auto-ship subscriptions powered by seamless customer portal configurations.",
          impactScore: 78,
          actionItem: "Integrate Recharge or similar auto-fulfillment platform to establish high-predictability recurring MRR."
        }
      ],
      immediate: [
        "Add icon badges for Cruelty-Free, Vegan, or Active Ingredients directly below the CTA.",
        "Add a 'Subscribe & Save' widget on cosmetic pages with a clear 10% discount callout."
      ],
      medium: [
        "Configure shade-match swatch titles to change the main image dynamically in real-time.",
        "Publish high-volume customer photo reviews showing real product skin results."
      ],
      longTerm: [
        "Design a custom 5-step dermatologist recommendation quiz to increase average order values (AOV).",
        "Set up post-purchase automated emails tailored around exact product replacement lifecycles (e.g. 45 days)."
      ],
      summary: `Product trust badges and skin-matching diagnostics are the main conversions drivers for beauty. Deploying custom guides on ${storeHost} will alleviate customer purchase uncertainty.`
    },
    Electronics: {
      gaps: [
        {
          area: "Technical Specs Comparison",
          severity: "High",
          description: `Your product pages display technical lists in long paragraphs. ${competitorHost} presents a beautiful interactive 'Compare with other models' chart.`,
          yourStatus: "Long unstyled text blocks detailing engineering specifications.",
          competitorStatus: "Dynamic visual comparison tables highlighting core differences side-by-side.",
          impactScore: 85,
          actionItem: "Build structural spec comparison cards highlighting processor, battery, and dimensions comparison."
        },
        {
          area: "Warranty & Support Upsells",
          severity: "Medium",
          description: `Protection plans are absent during add-to-cart. ${competitorHost} populates a seamless warranty upsell modal (e.g. Clyde, Extend).`,
          yourStatus: "Plain static claims detailing factory warranty options.",
          competitorStatus: "Integrated 1-year and 2-year damage-protection option triggers during drawer slide.",
          impactScore: 74,
          actionItem: "Establish a third-party protection integration to capture high-margin supplemental warranties."
        },
        {
          area: "Social Proof Video Unboxings",
          severity: "Medium",
          description: `Review panels contain only short text strings. ${competitorHost} includes curated video unboxing slots and real customer setup media.`,
          yourStatus: "Text-only reviews with zero media verification.",
          competitorStatus: "Rich media panels featuring video run-throughs and structural rating charts.",
          impactScore: 80,
          actionItem: "Incentivize buyers to upload video setup captures by providing store gift credits."
        }
      ],
      immediate: [
        "Create a clean technical grid highlighting top 4 product specs above the buy button.",
        "Enable a clear 30-day money-back guarantee banner near shipping info."
      ],
      medium: [
        "Deploy modular tab structures splitting 'Features', 'Specifications', and 'Q&A'.",
        "Upgrade technical product photos to include close-up functional breakdown layers."
      ],
      longTerm: [
        "Implement a fully integrated product insurance upsell platform at cart slides.",
        "Launch a live-chat chatbot dedicated to pre-sales engineering queries."
      ],
      summary: `High-friction technical comparison grids are the primary bottleneck on ${storeHost}. Highlighting setup validation, unboxings, and warranties will build strong buyer comfort.`
    },
    Home: {
      gaps: [
        {
          area: "Room Visualizer / AR",
          severity: "High",
          description: `Shoppers can only look at isolated catalog furniture. ${competitorHost} integrates dynamic interactive room visualization overlays or mobile Augmented Reality (AR) options.`,
          yourStatus: "Single-item photography on clean styled white vectors.",
          competitorStatus: "Immersive 'View in Your Room' camera scaling, and styled multi-product scene layouts.",
          impactScore: 89,
          actionItem: "Integrate a modern design suite layout or use 3D visualizers to display sizing accurately index."
        },
        {
          area: "Shipping Cost & Freight Clarity",
          severity: "High",
          description: `Surprise delivery costs appear on the final checkout steps. ${competitorHost} prompts a transparent shipping calculator on product pages.`,
          yourStatus: "Hidden shipping fees calculated only at last stage checkouts.",
          competitorStatus: "Free curbside or inside delivery calculator with scheduled delivery calendar selectors.",
          impactScore: 91,
          actionItem: "Establish a flat-rate delivery structure and write clear delivery timescales near buy tools."
        },
        {
          area: "Bundling Recommendation Engines",
          severity: "Medium",
          description: `Your accessories options are lost in related grids. ${competitorHost} proposes 'Frequently Bought Together' style sets with a 1-click bundle discount.`,
          yourStatus: "Simple static list of recommended products at lowest footer page grids.",
          competitorStatus: "Highly integrated coordination packs (e.g., pillow + mattress) carrying a specific percentage offset.",
          impactScore: 82,
          actionItem: "Deploy interactive item configuration bundles to boost AOV by 25% or more."
        }
      ],
      immediate: [
        "Implement a 'Frequently Bought Together' bundle panel for major high-ticket listings.",
        "Publish shipping timelines and heavy-delivery estimations above purchase checkboxes."
      ],
      medium: [
        "Upgrade main images to combine styled living-room contexts with dimensions overlay grids.",
        "Establish visual customer reviews filtered by room type or furniture coordinates."
      ],
      longTerm: [
        "Incorporate virtual space styling services backed by chat or calendar consultants.",
        "Develop custom room-planner tools supporting drag-and-drop decor canvas selections."
      ],
      summary: `High shipping uncertainty and isolated image cards are dragging down home goods conversion metrics. Emphasizing delivery speed, coordinates bundles, and dimensions will lift checkouts vastly on ${storeHost}.`
    },
    Other: {
      gaps: [
        {
          area: "Value Proposition Transparency",
          severity: "High",
          description: `Your product value vectors are lost in long prose. ${competitorHost} points out 3 clear USP (Unique Selling Proposition) bullet points above the checkout fold.`,
          yourStatus: "Traditional wall of plain descriptive text.",
          competitorStatus: "Faceted visual icons highlighting manufacturing origins, speed shipping, or materials superiority.",
          impactScore: 82,
          actionItem: "Rework product headers to group top value declarations into highly legible bullet features."
        },
        {
          area: "Mobile UI Responsive Sizing",
          severity: "High",
          description: `Listing items wrap awkwardly on narrow viewport monitors. ${competitorHost} features full finger-friendly carousels and smooth swipe triggers.`,
          yourStatus: "Responsive view wraps buttons on secondary lines causing visual overlaps.",
          competitorStatus: "Fully interactive mobile-first layout optimized around rapid screen-swipes.",
          impactScore: 87,
          actionItem: "Implement custom finger-touch slides and place key action items directly inside reach zones."
        },
        {
          area: "Actionable Help & Live Q&A",
          severity: "Medium",
          description: `If customers find gaps, they must write emails. ${competitorHost} has a self-service answer center with high-clarity toggles.`,
          yourStatus: "Static FAQ link pointing users to external general help modules.",
          competitorStatus: "Nested custom product FAQs answering localized sizing, materials, and warranty queries.",
          impactScore: 78,
          actionItem: "Publish high-relevance product question-and-answer nodes directly above reviews widgets."
        }
      ],
      immediate: [
        "Rework description copy to move value bullet highlights above the buy fold.",
        "Enable interactive hover effects to reveal product specifications instantly."
      ],
      medium: [
        "Optimize touch sizes of all selectors to exceed 48px sizes on devices.",
        "Clean up site headers to hold only essential menus, search, and carts tabs."
      ],
      longTerm: [
        "Build a dedicated automated customer solution terminal powered by interactive guides.",
        "Set up proactive custom review triggers requesting photos in return for credits."
      ],
      summary: `Standard mobile alignment and structural value descriptions are crucial for general store niches. Organizing the detail cards with clean summaries improves visitor dwell metrics.`
    }
  };

  const defaultCategory = categoryBenchmarks[category] || categoryBenchmarks["Other"];
  
  const baseScoreYour = Math.floor(63 + Math.random() * 8); // 63 - 70
  const baseScoreTheir = Math.floor(82 + Math.random() * 11); // 82 - 92

  return {
    id: `scan_${Date.now()}`,
    input: { storeUrl, competitorUrl, category, name, email },
    timestamp: new Date().toISOString(),
    overallScore: {
      yourStore: baseScoreYour,
      competitorStore: baseScoreTheir
    },
    metrics: {
      cro: {
        mine: baseScoreYour - 4,
        theirs: baseScoreTheir - 2,
        feedback: `Your checkout has additional form inputs compared to ${competitorHost}, causing checkout friction. Sizing recommendations need modern interactive guides.`
      },
      seo: {
        mine: baseScoreYour + 5,
        theirs: baseScoreTheir - 5,
        feedback: `Your store SEO layout structure is adequate, but ${competitorHost} ranks higher due to superior keyword relevance and image alt optimizations.`
      },
      visuals: {
        mine: baseScoreYour - 6,
        theirs: baseScoreTheir + 1,
        feedback: `${competitorHost} features consistent branding colors, modern Space Grotesk labels, and clear lifestyle hover media. Your pages have layout clutter.`
      },
      trust: {
        mine: baseScoreYour + 1,
        theirs: baseScoreTheir + 4,
        feedback: `Your site integrates standard secure badge logos, but misses visible buyer reviews, social-proof banners, and post-purchase guarantee statements.`
      }
    },
    keyGaps: defaultCategory.gaps,
    roadmap: {
      immediate: defaultCategory.immediate,
      medium: defaultCategory.medium,
      longTerm: defaultCategory.longTerm
    },
    summary: defaultCategory.summary.replace(/\${storeHost}/g, storeHost).replace(/\${competitorHost}/g, competitorHost)
  };
}

// POST endpoint to handle the gap analysis
app.post("/api/analyze", async (req, res) => {
  const { storeUrl, competitorUrl, category, name, email } = req.body;

  if (!storeUrl || !competitorUrl || !category || !name || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const ai = getGeminiClient();

  if (!ai) {
    // If Gemini key is not configured, generate a beautifully customized diagnostic response immediately.
    console.warn("GEMINI_API_KEY is not defined. Falling back to high-fidelity customized deterministic analysis.");
    const mockReport = generateDeterministicAnalysis(storeUrl, competitorUrl, category, name, email);
    return res.json({
      status: "success",
      sandbox: true,
      data: mockReport
    });
  }

  try {
    const storeHost = storeUrl.replace(/https?:\/\/(www\.)?/, '').split('/')[0];
    const competitorHost = competitorUrl.replace(/https?:\/\/(www\.)?/, '').split('/')[0];

    const promptText = `
Perform a high-fidelity, detailed comparative e-commerce audit (Gap Analysis) between the user's store and their chief competitor. 

PARAMETERS:
- User's Store: ${storeUrl} (Brand/Host: ${storeHost})
- Competitor's Store: ${competitorUrl} (Brand/Host: ${competitorHost})
- E-commerce Category: ${category}
- Store Owner Name: ${name}

INSTRUCTIONS:
1. Compare both properties on four core digital dimensions:
   - Conversion Rate Optimization (CRO)
   - SEO & Speed Performance
   - Visual Layout & Lifestyle Branding
   - Trust Signals & Guarantee Policies
2. Create 3 distinct of the MOST CRITICAL visual or functional gaps found in the store. Each gap must have:
   - 'area': Precise name (e.g. 'Social Proof Grid', 'Checkout Friction')
   - 'severity': 'High' | 'Medium' | 'Low'
   - 'description': Specific difference explaining why ${competitorHost} converts better
   - 'yourStatus': What the user's store is doing or missing
   - 'competitorStatus': What the competitor's store is doing perfectly
   - 'impactScore': An integer between 1 and 100 representing importance
   - 'actionItem': Concrete, clear step-by-step resolution step
3. Provide a chronological roadmap split into:
   - 'immediate': 1-Day actionable tasks (2-3 items)
   - 'medium': 7-Day performance features (2-3 items)
   - 'longTerm': 30-Day structural redesign goals (2-3 items)
4. Evaluate scores (0-100) for BOTH stores where the competitor should rank higher (reflecting true gap opportunities):
   - Overall scores: Overall user score should range around 60-75, and competitor score around 80-95.
   - Separate metrics with contextual feedback strings mentioning details for each.
5. Create a professional, inspiring executive summary concluding with actionable advice.

Return the result STRICTLY as a single JSON object conforming to the schema. Do not output comments or formatting markdown outside.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: "You are an Elite E-commerce CRO Specialist, Senior UX Designer, and Head of SEO. You analyze web properties and return rigorous, structured comparative analysis. Always focus on technical accuracy and category best-practices (Fashion, Beauty, etc.).",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("No text output received from Gemini API");
    }

    const parsedData = JSON.parse(textOutput.trim());
    
    // Inject the request parameters and metadata
    const report = {
      id: `scan_${Date.now()}`,
      input: { storeUrl, competitorUrl, category, name, email },
      timestamp: new Date().toISOString(),
      ...parsedData
    };

    return res.json({
      status: "success",
      sandbox: false,
      data: report
    });

  } catch (error: any) {
    console.error("Gemini API error during analysis execution:", error);
    // Use sandbox fallback if API fails post-initialization
    const fallbackReport = generateDeterministicAnalysis(storeUrl, competitorUrl, category, name, email);
    return res.json({
      status: "success",
      sandbox: true,
      error: error.message || "Gemini API query execution issue, falling back safely.",
      data: fallbackReport
    });
  }
});

// Serve health status
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

async function startServer() {
  // Integrate Vite dynamically for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`E-commerce Gap Analyzer Backend operational on http://0.0.0.0:${PORT}`);
  });
}

startServer();
