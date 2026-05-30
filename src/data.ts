import { ChecklistItem, AnalysisResult } from "./types";

export const SAMPLE_SCANS: Record<string, AnalysisResult> = {
  Fashion: {
    id: "sample_fashion",
    timestamp: "2026-05-30T00:00:00Z",
    input: {
      storeUrl: "https://yourboutiquefashion.com",
      competitorUrl: "https://gymshark.com",
      category: "Fashion",
      name: "Alex Johnson",
      email: "alex@yourboutiquefashion.com"
    },
    overallScore: {
      yourStore: 67,
      competitorStore: 91
    },
    metrics: {
      cro: {
        mine: 62,
        theirs: 93,
        feedback: "Your PDP (Product Detail Page) is missing express checkouts, size visualizers, and reviews grids. Gymshark features an streamlined slide cart drawer that handles sizing instantly."
      },
      seo: {
        mine: 73,
        theirs: 89,
        feedback: "Web core vitals show some render-blocking scripts on your boutique homepage. Gymshark loads high-compression WebP images with custom visual aspect ratios."
      },
      visuals: {
        mine: 65,
        theirs: 94,
        feedback: "Gymshark uses a strong monospace font for technical labels and high-impact lifestyle videos on hover. Your store has flat, static elements with overlapping alignments on mobile."
      },
      trust: {
        mine: 68,
        theirs: 88,
        feedback: "Gymshark promotes standard hassle-free return labels and customer fitness goals transparency. Your store does not explicitly state shipping fees until the checkout pages."
      }
    },
    keyGaps: [
      {
        area: "Frictionless Express Checkout",
        severity: "High",
        description: "Customers must navigate 4 separate pages of form formulas to complete checkout, causing elevated cart dropouts. The competitor offers 1-tap Apple Pay and Shop Pay.",
        yourStatus: "Multi-page form validation requirements for guest checkouts.",
        competitorStatus: "Express digital wallet buttons featured directly on product slides and cart sliders.",
        impactScore: 94,
        actionItem: "Integrate a quick cart-slide overlay with Shop Pay and Apple Pay shortcuts prominently positioned."
      },
      {
        area: "Interactive Fit Assistant",
        severity: "High",
        description: "Your product page links to a static unstyled text sizing table, forcing mobile buyers to guess sizes. The competitor features an immersive digital sizing questionnaire.",
        yourStatus: "Flat HTML table sizing grid requiring manual measure calculations.",
        competitorStatus: "Smart size recommendation helper based on height and body type averages.",
        impactScore: 89,
        actionItem: "Deploy an interactive fit plugin (e.g., WAIR, Kiwisizing) to recommend accurate sizes, decreasing return rates."
      },
      {
        area: "Dynamic Hover Video Catalog",
        severity: "Medium",
        description: "Listing pages display flat clothing layouts on plain white. Gymshark displays short loops of models moving in garments when hovering over catalog items.",
        yourStatus: "Plain flat lays and static isolated studio photos.",
        competitorStatus: "Immersive video hover loops and video style grids detailing fabric motion.",
        impactScore: 78,
        actionItem: "Replace secondary catalog image grids with short wear-test video loops and lifestyle hover structures."
      }
    ],
    roadmap: {
      immediate: [
        "Deploy Shop Pay, Apple Pay and Google Pay shortcuts on product listings.",
        "Add an interactive Size Guide link adjacent to the clothing size inputs."
      ],
      medium: [
        "Optimize all listing-grid image sizes and serve modern WebP/AVIF compressions.",
        "Include 3 visual trust banners highlighting 30-day returns on product cards."
      ],
      longTerm: [
        "Reconfigure the shopping cart UI to use a modern slide-out drawer.",
        "Structure automated follow-up emails asking for media-enriched buyer reviews."
      ]
    },
    summary: "Alex, your boutique store has an amazing selection, but technical checkout friction and sizing uncertainties are causing customers to bounce. Eliminating these structural barriers brings massive conversion lifts immediately."
  },
  Beauty: {
    id: "sample_beauty",
    timestamp: "2026-05-30T00:00:00Z",
    input: {
      storeUrl: "https://pureskinessentials.co",
      competitorUrl: "https://sephora.com",
      category: "Beauty",
      name: "Elena Rostova",
      email: "elena@pureskinessentials.co"
    },
    overallScore: {
      yourStore: 69,
      competitorStore: 88
    },
    metrics: {
      cro: {
        mine: 64,
        theirs: 91,
        feedback: "Sephora prominently promotes auto-replenishment subscriptions and multi-buy bundling. Your store relies entirely on single-unit transactions."
      },
      seo: {
        mine: 70,
        theirs: 85,
        feedback: "Sephora ranks high across skincare tags through semantic blog interlinking. Your site possesses brief meta descriptions and missing descriptive product tags."
      },
      visuals: {
        mine: 72,
        theirs: 90,
        feedback: "Sephora utilizes luxury editorial serif headers paired with clean ingredients breakdowns. Your design is generic with plain layout structures."
      },
      trust: {
        mine: 70,
        theirs: 86,
        feedback: "Your brand claims skin safety, but lacks dermatological badges. Sephora showcases clinical results diagrams and certification credentials near checkout."
      }
    },
    keyGaps: [
      {
        area: "Skin Tone Diagnostic Quiz",
        severity: "High",
        description: "Choosing skin products online is stressful without guidance. Sephora leverages a brief 30-second tone match quiz widget, while you expect buyers to select blindly.",
        yourStatus: "Static color swatch picker circles with zero matching assistance.",
        competitorStatus: "Guided multi-step skin routine builder scoring skin oiliness, concerns, and matching tones.",
        impactScore: 91,
        actionItem: "Implement a beautiful type-form diagnostic quiz recommending tailored product bundles."
      },
      {
        area: "Formulation Transparency Badging",
        severity: "High",
        description: "Your ingredient list is hidden in secondary tabs. Sephora highlights Clean Clean labels, Vegan claims, and Active percentage concentrations on beautiful visual icons.",
        yourStatus: "Undecorated plain block text ingredients list on the footer page.",
        competitorStatus: "Clean chemical safety badges, dermatological certifications, and active raw product highlights.",
        impactScore: 84,
        actionItem: "Add 3-4 custom formulation badges (e.g., 'Cruelty-Free', 'Phthalate-Free') right below the purchase button."
      },
      {
        area: "Auto-Replenish Subscription Portal",
        severity: "Medium",
        description: "Skincare is a recurring need, but your store ignores repeat-buyer channels. The competitor offers continuous subscription discounts.",
        yourStatus: "One-time purchase checkout limits.",
        competitorStatus: "Auto-replenish order option with persistent sub-pricing incentives (save 10%).",
        impactScore: 76,
        actionItem: "Integrate Recharge or similar auto-fulfillment platform to establish recurring revenue streams."
      }
    ],
    roadmap: {
      immediate: [
        "Incorporate dermatological validation icons below buy triggers.",
        "Add skin concern filters on catalog pages (Oily, Dry, Sensitive)."
      ],
      medium: [
        "Establish an interactive sub-pricing checkbox for automated refill delivery.",
        "Add micro-influencer product application shots on active listings."
      ],
      longTerm: [
        "Build a custom 5-step guided skincare routine advisor wizard.",
        "Optimize packaging descriptions and structural ingredients index schemas inside product micro-data."
      ]
    },
    summary: "Elena, integrating strong formulation transparency badges and subscription channels will stabilize your beauty brand's retention metrics. Buyers need clarity on materials to build skincare confidence."
  }
};

export const CRO_CHECKLIST_ITEMS: ChecklistItem[] = [
  // Homepage
  {
    id: "hm_1",
    category: "Homepage",
    title: "Clear 5-Second Value Proposition",
    description: "Can a visitor understand exactly what you sell and why it matters within 5 seconds of loading the page?",
    impact: "High",
    difficulty: "Easy",
    checked: false
  },
  {
    id: "hm_2",
    category: "Homepage",
    title: "Single Focus Call to Action (CTA)",
    description: "Your main hero banner has one prominent, high-contrast button like 'Shop New Arrivals' instead of competing links.",
    impact: "High",
    difficulty: "Easy",
    checked: false
  },
  {
    id: "hm_3",
    category: "Homepage",
    title: "Best Sellers Featured in Top Fold",
    description: "Display your top 3-4 highest-converting products directly on the homepage with review stars.",
    impact: "High",
    difficulty: "Medium",
    checked: false
  },
  {
    id: "hm_4",
    category: "Homepage",
    title: "Optimized Mobile Navigation Header",
    description: "Keep the mobile header super clean: just logo, search bar, and a cart icon with an active count badge.",
    impact: "High",
    difficulty: "Medium",
    checked: false
  },
  {
    id: "hm_5",
    category: "Homepage",
    title: "Visible Trust Announcement Bar",
    description: "Dynamic top announcement bar clearly highlighting 'Free Shipping on Orders over $50' or '30-Day Happiness Guarantee'.",
    impact: "Medium",
    difficulty: "Easy",
    checked: false
  },
  {
    id: "hm_6",
    category: "Homepage",
    title: "Real Customer Face/Video Proof",
    description: "Faces build trust. Include an Instagram grid or video reels featuring human beings wearing or using your products.",
    impact: "Medium",
    difficulty: "Medium",
    checked: false
  },
  {
    id: "hm_7",
    category: "Homepage",
    title: "Interactive Category Visual Links",
    description: "Instead of plain dropdown texts, show nice circular visual badges representing Fashion, Accessories, Sale, etc.",
    impact: "Medium",
    difficulty: "Medium",
    checked: false
  },
  {
    id: "hm_8",
    category: "Homepage",
    title: "Search Bar Auto-Suggestions",
    description: "The search box shows visual thumbnails of popular matching items as Soon as the user starts typing.",
    impact: "Medium",
    difficulty: "Hard",
    checked: false
  },
  {
    id: "hm_9",
    category: "Homepage",
    title: "Exit-Intent Discount Overlay",
    description: "Show a gentle modal overlay offering a 10% discount in exchange for their email just as they prepare to close the tab.",
    impact: "High",
    difficulty: "Medium",
    checked: false
  },
  {
    id: "hm_10",
    category: "Homepage",
    title: "No Auto-Rotating Carousel Banners",
    description: "Carousels lower conversions. Use a single beautiful static image banner with clear editorial typography.",
    impact: "Medium",
    difficulty: "Easy",
    checked: false
  },

  // Product Page (PDP)
  {
    id: "pd_1",
    category: "Product Page",
    title: "Sticky Buy Button on Mobile Scroll",
    description: "When mobile users scroll down to inspect product details, a sticky 'Add to Cart' bar anchors at the top or bottom.",
    impact: "High",
    difficulty: "Hard",
    checked: false
  },
  {
    id: "pd_2",
    category: "Product Page",
    title: "Clean High-Contrast Sizing Selectors",
    description: "Avoid standard microscopic drop-down menus; use large touch-friendly button swatches for sizes and colors.",
    impact: "High",
    difficulty: "Medium",
    checked: false
  },
  {
    id: "pd_3",
    category: "Product Page",
    title: "Dynamic Size Recommendation Guide",
    description: "Interactive sizing links with direct explanations or quizzes, lowering buyer hesitation and size returns.",
    impact: "High",
    difficulty: "Medium",
    checked: false
  },
  {
    id: "pd_4",
    category: "Product Page",
    title: "Reviews Rich Snippets & Media",
    description: "Show summary star counts right next to the product heading, with selectable photos from past buyers.",
    impact: "High",
    difficulty: "Medium",
    checked: false
  },
  {
    id: "pd_5",
    category: "Product Page",
    title: "Interactive Color Swatches Update",
    description: "Selecting a color swatch dynamically filters and changes the carousel main product photo to the exact match.",
    impact: "High",
    difficulty: "Hard",
    checked: false
  },
  {
    id: "pd_6",
    category: "Product Page",
    title: "Transparent Return & Delivery Timelines",
    description: "Include a small icon section under the checkout button: 'Free Delivery by Friday' or 'Hassle-free 30 Day Returns'.",
    impact: "High",
    difficulty: "Easy",
    checked: false
  },
  {
    id: "pd_7",
    category: "Product Page",
    title: "USP Accordion Menus",
    description: "Never dump massive text walls. Use collapsable sections for 'Fit & Sizing', 'Shipping & Returns', and 'Materials'.",
    impact: "Medium",
    difficulty: "Easy",
    checked: false
  },
  {
    id: "pd_8",
    category: "Product Page",
    title: "Dynamic Inventory Urgency Trigger",
    description: "Show 'Only 3 left in stock - ordering soon!' when stock drops, driving immediate scarcity actions.",
    impact: "Medium",
    difficulty: "Medium",
    checked: false
  },
  {
    id: "pd_9",
    category: "Product Page",
    title: "Social Proof Live Viewers Count",
    description: "Displays a subtle notification: '🔥 14 other shoppers are inspecting this dress right now' to simulate retail buzz.",
    impact: "Low",
    difficulty: "Medium",
    checked: false
  },
  {
    id: "pd_10",
    category: "Product Page",
    title: "Clear Out-of-Stock Notification Sign-up",
    description: "If an item is sold out, let users enter their email to get instantly notified when restocked, capturing prospects.",
    impact: "Medium",
    difficulty: "Medium",
    checked: false
  },

  // Cart & Checkout
  {
    id: "cc_1",
    category: "Cart & Checkout",
    title: "Slide-Out Drawer Cart Overlay",
    description: "When clicking 'Add to Cart', open a sleek slide-out drawer on the side instead of reloading or navigating.",
    impact: "High",
    difficulty: "Hard",
    checked: false
  },
  {
    id: "cc_2",
    category: "Cart & Checkout",
    title: "Express Payment Shortcuts First",
    description: "Position Apple Pay, Google Pay, and Shop Pay shortcuts directly at checkout page entrances or initial cart drawers.",
    impact: "High",
    difficulty: "Medium",
    checked: false
  },
  {
    id: "cc_3",
    category: "Cart & Checkout",
    title: "Free Shipping Milestone Progress Bar",
    description: "Show a beautiful visual tracker in the cart: 'Refill another $12 to unlock FREE Standard Shipping!'.",
    impact: "High",
    difficulty: "Medium",
    checked: false
  },
  {
    id: "cc_4",
    category: "Cart & Checkout",
    title: "Remove Checkout Header Menus",
    description: "Secure checkout conversion by stripping logo links, navigation, and promotional banners during billing steps.",
    impact: "Medium",
    difficulty: "Easy",
    checked: false
  },
  {
    id: "cc_5",
    category: "Cart & Checkout",
    title: "Transparent Promo Code Entry Box",
    description: "Keep coupon forms collapsed or secondary, so customers don't abandon your cart to hunt for codes online.",
    impact: "Medium",
    difficulty: "Easy",
    checked: false
  },
  {
    id: "cc_6",
    category: "Cart & Checkout",
    title: "No Surprise Fees at Shipping Page",
    description: "A major cause of cart abandonment is shipping costs calculated at payment. Display fee structures early.",
    impact: "High",
    difficulty: "Easy",
    checked: false
  },
  {
    id: "cc_7",
    category: "Cart & Checkout",
    title: "In-Cart Product Cross-Sells",
    description: "Suggest miniature add-ons (like socks for shoes, or lip liner for lipstick) directly inside the sliding cart drawer.",
    impact: "Medium",
    difficulty: "Hard",
    checked: false
  },
  {
    id: "cc_8",
    category: "Cart & Checkout",
    title: "Auto-Fill Billing Address Fields",
    description: "Integrate Google Places API to auto-fill shipping addresses as soon as the shopper types the street name.",
    impact: "Medium",
    difficulty: "Hard",
    checked: false
  },
  {
    id: "cc_9",
    category: "Cart & Checkout",
    title: "Guest Checkout Enabled by Default",
    description: "Never force users to register password combinations to complete standard merchandise transactions.",
    impact: "High",
    difficulty: "Easy",
    checked: false
  },
  {
    id: "cc_10",
    category: "Cart & Checkout",
    title: "Trust Badge Security seals",
    description: "Display Norton, Stripe, PayPal, or generic '256-bit SSL Encrypted Transaction Lock' visual logos near checkouts.",
    impact: "Medium",
    difficulty: "Easy",
    checked: false
  },

  // SEO & Speed
  {
    id: "ss_1",
    category: "SEO & Speed",
    title: "Optimized Mobile Speed Under 2 Seconds",
    description: "Audit page speed so visual elements settle within 1.5 - 2 seconds on cellular setups.",
    impact: "High",
    difficulty: "Hard",
    checked: false
  },
  {
    id: "ss_2",
    category: "SEO & Speed",
    title: "Dynamic Next-Gen WebP/AVIF Image Codecs",
    description: "Convert bulky master PNG/JPG product assets into light, responsive WebP equivalents to save loads of CPU.",
    impact: "High",
    difficulty: "Medium",
    checked: false
  },
  {
    id: "ss_3",
    category: "SEO & Speed",
    title: "Structured Breadcrumbs for Categories",
    description: "Enable nested visual traces: Home > Men's Apparel > Shirts > Organic Tee, clarifying taxonomy search rankings.",
    impact: "Medium",
    difficulty: "Easy",
    checked: false
  },
  {
    id: "ss_4",
    category: "SEO & Speed",
    title: "Unique Product Meta-Tags",
    description: "Add rich keyword meta titles and descriptions detailing product size, colors, and direct value keywords.",
    impact: "Medium",
    difficulty: "Easy",
    checked: false
  },
  {
    id: "ss_5",
    category: "SEO & Speed",
    title: "Product Schema Rich Snippets",
    description: "Configure JSON-LD structural microdata highlighting price, rating stars, and stocks in Google organic cards.",
    impact: "High",
    difficulty: "Medium",
    checked: false
  },
  {
    id: "ss_6",
    category: "SEO & Speed",
    title: "Clean Semantic Header Structuring",
    description: "Each landing page contains only one main H1 tag, with clean organized subheaders hierarchy (H2, H3, H4).",
    impact: "Medium",
    difficulty: "Easy",
    checked: false
  },
  {
    id: "ss_7",
    category: "SEO & Speed",
    title: "Compress Static Render Javascripts",
    description: "Lazy-load third party support script files (trackers, chats, quizzes) until primary page assets resolve.",
    impact: "High",
    difficulty: "Hard",
    checked: false
  },
  {
    id: "ss_8",
    category: "SEO & Speed",
    title: "Alt Text Tags on Every Showcase",
    description: "Complete clear descriptive image tags ('Black organic cotton long-sleeve dress') aiding image search indexes.",
    impact: "Medium",
    difficulty: "Easy",
    checked: false
  },
  {
    id: "ss_9",
    category: "SEO & Speed",
    title: "No Intrusive Immediate Interstitial Modals",
    description: "Google penalizes sites showing newsletter popups on initial mobile loads. Wait till shoppers view 2 pages.",
    impact: "Medium",
    difficulty: "Easy",
    checked: false
  },
  {
    id: "ss_10",
    category: "SEO & Speed",
    title: "Auto-Optimized CSS Stylesheet Assets",
    description: "Remove duplicate stylesheets or third-party web fonts slowing initial critical visual load steps.",
    impact: "Medium",
    difficulty: "Medium",
    checked: false
  },

  // Trust & Post-Purchase
  {
    id: "tp_1",
    category: "Trust & Post-Purchase",
    title: "Visible Founder/team story Card",
    description: "Tell your audience who keeps the inventory! Human connection raises beauty-brand conversions indices.",
    impact: "Medium",
    difficulty: "Easy",
    checked: false
  },
  {
    id: "tp_2",
    category: "Trust & Post-Purchase",
    title: "Detailed FAQs Separated by Topics",
    description: "Group sizing, materials, delivery, and refund inquiries under beautiful dropdown drawers near buy buttons.",
    impact: "Medium",
    difficulty: "Easy",
    checked: false
  },
  {
    id: "tp_3",
    category: "Trust & Post-Purchase",
    title: "Post-Purchase Email Tracking Setup",
    description: "Send automated updates detailing raw tracking progression logs on custom carrier interfaces.",
    impact: "Medium",
    difficulty: "Medium",
    checked: false
  },
  {
    id: "tp_4",
    category: "Trust & Post-Purchase",
    title: "Money-Back Happiness Guarantee",
    description: "Provide explicit peace of mind: 'Hassle-free refunds or product swaps within 30 days if you don't love it.'",
    impact: "High",
    difficulty: "Easy",
    checked: false
  },
  {
    id: "tp_5",
    category: "Trust & Post-Purchase",
    title: "Social Impact or Environmental Causes",
    description: "State matching donations or localized supply ethical standards (e.g., '1% For The Planet' or ethical carbon sets).",
    impact: "Low",
    difficulty: "Easy",
    checked: false
  },
  {
    id: "tp_6",
    category: "Trust & Post-Purchase",
    title: "Real Verified Trustpilot / Google Ratings",
    description: "Embed live review widgets linking to authoritative external certification properties.",
    impact: "High",
    difficulty: "Medium",
    checked: false
  },
  {
    id: "tp_7",
    category: "Trust & Post-Purchase",
    title: "Easy 1-Click Support Channel Access",
    description: "Keep a simple messaging bubble or dynamic contact form clickable on any screen section.",
    impact: "High",
    difficulty: "Medium",
    checked: false
  },
  {
    id: "tp_8",
    category: "Trust & Post-Purchase",
    title: "Legal Terms & Privacy Declarations",
    description: "Display transparent links for Terms of Service, Shipping Policies, and Privacy laws in footer columns.",
    impact: "Low",
    difficulty: "Easy",
    checked: false
  },
  {
    id: "tp_9",
    category: "Trust & Post-Purchase",
    title: "Dynamic Customer Retargeting Flow",
    description: "Deploy targeted coupon offers for abandoners through structured recovery flows.",
    impact: "High",
    difficulty: "Medium",
    checked: false
  },
  {
    id: "tp_10",
    category: "Trust & Post-Purchase",
    title: "Self-Service Exchanges Portal",
    description: "Automate delivery of return labels (via platforms like Loop) without needing support tickets.",
    impact: "Medium",
    difficulty: "Hard",
    checked: false
  }
];
