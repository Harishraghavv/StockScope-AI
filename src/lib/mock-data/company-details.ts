// Detailed company information for all 20 stocks in the universe.
// Used by the enhanced Company Explorer page for financials, shareholding, etc.

export interface CompanyFinancials {
  symbol: string;
  about: string;
  quarterlyResults: { quarter: string; revenue: number; profit: number; eps: number }[];
  shareholding: { promoter: number; fii: number; dii: number; public: number };
  competitors: string[];
}

const COMPANY_DETAILS: CompanyFinancials[] = [
  {
    symbol: "RELIANCE",
    about: "Reliance Industries is India's largest private-sector company, with interests spanning energy, petrochemicals, retail, and digital services through Jio Platforms. Founded by Dhirubhai Ambani, it's now led by Mukesh Ambani.",
    quarterlyResults: [
      { quarter: "Q1 FY26", revenue: 236_450, profit: 19_820, eps: 29.3 },
      { quarter: "Q4 FY25", revenue: 228_190, profit: 18_950, eps: 28.0 },
      { quarter: "Q3 FY25", revenue: 221_540, profit: 17_420, eps: 25.7 },
      { quarter: "Q2 FY25", revenue: 215_890, profit: 16_890, eps: 24.9 },
    ],
    shareholding: { promoter: 50.3, fii: 23.1, dii: 14.2, public: 12.4 },
    competitors: ["ONGC", "ITC", "BHARTIARTL"],
  },
  {
    symbol: "TCS",
    about: "Tata Consultancy Services is a global leader in IT services, consulting, and business solutions. Part of the Tata Group, TCS operates in 150+ locations across 46 countries, serving clients across banking, retail, telecom, and more.",
    quarterlyResults: [
      { quarter: "Q1 FY26", revenue: 62_380, profit: 12_040, eps: 33.0 },
      { quarter: "Q4 FY25", revenue: 61_230, profit: 11_780, eps: 32.3 },
      { quarter: "Q3 FY25", revenue: 60_580, profit: 11_390, eps: 31.2 },
      { quarter: "Q2 FY25", revenue: 59_690, profit: 11_020, eps: 30.2 },
    ],
    shareholding: { promoter: 72.3, fii: 12.8, dii: 8.4, public: 6.5 },
    competitors: ["INFY", "WIPRO", "LT"],
  },
  {
    symbol: "HDFCBANK",
    about: "HDFC Bank is India's largest private-sector bank by assets, offering a wide range of banking and financial services. Known for robust asset quality and consistent growth, it merged with HDFC Ltd in 2023.",
    quarterlyResults: [
      { quarter: "Q1 FY26", revenue: 85_430, profit: 16_820, eps: 22.1 },
      { quarter: "Q4 FY25", revenue: 82_150, profit: 16_370, eps: 21.5 },
      { quarter: "Q3 FY25", revenue: 79_890, profit: 15_920, eps: 20.9 },
      { quarter: "Q2 FY25", revenue: 77_210, profit: 15_480, eps: 20.3 },
    ],
    shareholding: { promoter: 26.1, fii: 33.4, dii: 24.8, public: 15.7 },
    competitors: ["SBIN", "AXISBANK", "KOTAKBANK"],
  },
  {
    symbol: "INFY",
    about: "Infosys is a global leader in next-generation digital services and consulting. Co-founded by N.R. Narayana Murthy, it is India's second-largest IT services company, known for its strong focus on AI and cloud transformation.",
    quarterlyResults: [
      { quarter: "Q1 FY26", revenue: 39_820, profit: 6_370, eps: 15.4 },
      { quarter: "Q4 FY25", revenue: 38_960, profit: 6_130, eps: 14.8 },
      { quarter: "Q3 FY25", revenue: 38_320, profit: 5_980, eps: 14.4 },
      { quarter: "Q2 FY25", revenue: 37_480, profit: 5_790, eps: 14.0 },
    ],
    shareholding: { promoter: 14.8, fii: 34.2, dii: 28.1, public: 22.9 },
    competitors: ["TCS", "WIPRO", "LT"],
  },
  {
    symbol: "ITC",
    about: "ITC Limited is a diversified conglomerate with leading presence in FMCG, hotels, paperboards, packaging, agri-business, and IT. Its FMCG portfolio includes brands like Aashirvaad, Sunfeast, Bingo!, and Classmate.",
    quarterlyResults: [
      { quarter: "Q1 FY26", revenue: 18_940, profit: 5_210, eps: 4.2 },
      { quarter: "Q4 FY25", revenue: 17_890, profit: 4_980, eps: 4.0 },
      { quarter: "Q3 FY25", revenue: 17_120, profit: 4_780, eps: 3.8 },
      { quarter: "Q2 FY25", revenue: 16_540, profit: 4_530, eps: 3.6 },
    ],
    shareholding: { promoter: 0.0, fii: 40.5, dii: 38.2, public: 21.3 },
    competitors: ["HINDUNILVR", "RELIANCE"],
  },
  {
    symbol: "SBIN",
    about: "State Bank of India is the country's largest public-sector bank with over 22,000 branches. It provides a wide range of banking products including loans, deposits, insurance, and investment services to retail and corporate customers.",
    quarterlyResults: [
      { quarter: "Q1 FY26", revenue: 120_340, profit: 18_620, eps: 20.9 },
      { quarter: "Q4 FY25", revenue: 116_780, profit: 17_540, eps: 19.7 },
      { quarter: "Q3 FY25", revenue: 113_210, profit: 16_980, eps: 19.0 },
      { quarter: "Q2 FY25", revenue: 109_890, profit: 16_210, eps: 18.2 },
    ],
    shareholding: { promoter: 57.5, fii: 11.2, dii: 21.3, public: 10.0 },
    competitors: ["HDFCBANK", "AXISBANK", "KOTAKBANK"],
  },
  {
    symbol: "BHARTIARTL",
    about: "Bharti Airtel is India's second-largest telecom operator, providing mobile, broadband, DTH, and enterprise services. It also has significant operations across Africa through Airtel Africa.",
    quarterlyResults: [
      { quarter: "Q1 FY26", revenue: 41_230, profit: 4_160, eps: 7.1 },
      { quarter: "Q4 FY25", revenue: 39_870, profit: 3_890, eps: 6.6 },
      { quarter: "Q3 FY25", revenue: 38_520, profit: 3_620, eps: 6.2 },
      { quarter: "Q2 FY25", revenue: 37_140, profit: 3_340, eps: 5.7 },
    ],
    shareholding: { promoter: 52.2, fii: 25.8, dii: 12.4, public: 9.6 },
    competitors: ["RELIANCE", "ITC"],
  },
  {
    symbol: "LT",
    about: "Larsen & Toubro is India's largest engineering and construction conglomerate, with interests in technology, manufacturing, and financial services. L&T builds everything from power plants to metro rail systems.",
    quarterlyResults: [
      { quarter: "Q1 FY26", revenue: 55_680, profit: 3_870, eps: 28.2 },
      { quarter: "Q4 FY25", revenue: 67_120, profit: 4_560, eps: 33.3 },
      { quarter: "Q3 FY25", revenue: 53_210, profit: 3_420, eps: 24.9 },
      { quarter: "Q2 FY25", revenue: 51_890, profit: 3_180, eps: 23.2 },
    ],
    shareholding: { promoter: 0.0, fii: 24.6, dii: 38.9, public: 36.5 },
    competitors: ["ADANIPORTS", "NTPC"],
  },
  {
    symbol: "ASIANPAINT",
    about: "Asian Paints is India's largest paint manufacturer and Asia's third-largest. With brands like Asian Paints, Berger, and Apco Coatings, it has a dominant market share in decorative paints across India.",
    quarterlyResults: [
      { quarter: "Q1 FY26", revenue: 8_940, profit: 1_230, eps: 12.8 },
      { quarter: "Q4 FY25", revenue: 8_520, profit: 1_140, eps: 11.9 },
      { quarter: "Q3 FY25", revenue: 8_780, profit: 1_190, eps: 12.4 },
      { quarter: "Q2 FY25", revenue: 8_340, profit: 1_080, eps: 11.3 },
    ],
    shareholding: { promoter: 52.6, fii: 17.3, dii: 12.8, public: 17.3 },
    competitors: ["TITAN", "HINDUNILVR"],
  },
  {
    symbol: "MARUTI",
    about: "Maruti Suzuki India is the country's largest passenger vehicle manufacturer. A subsidiary of Suzuki Motor Corporation, it dominates the Indian automobile market with popular models like Swift, Baleno, and Brezza.",
    quarterlyResults: [
      { quarter: "Q1 FY26", revenue: 38_920, profit: 3_650, eps: 119.7 },
      { quarter: "Q4 FY25", revenue: 37_450, profit: 3_470, eps: 113.8 },
      { quarter: "Q3 FY25", revenue: 36_230, profit: 3_280, eps: 107.5 },
      { quarter: "Q2 FY25", revenue: 35_160, profit: 3_100, eps: 101.6 },
    ],
    shareholding: { promoter: 56.4, fii: 22.1, dii: 11.8, public: 9.7 },
    competitors: ["TATASTEEL", "LT"],
  },
  {
    symbol: "SUNPHARMA",
    about: "Sun Pharmaceutical Industries is the world's fifth-largest specialty generic pharmaceutical company and India's top pharma company by market cap. It manufactures and markets a range of branded and generic formulations.",
    quarterlyResults: [
      { quarter: "Q1 FY26", revenue: 12_890, profit: 2_870, eps: 11.9 },
      { quarter: "Q4 FY25", revenue: 12_340, profit: 2_690, eps: 11.2 },
      { quarter: "Q3 FY25", revenue: 11_980, profit: 2_510, eps: 10.5 },
      { quarter: "Q2 FY25", revenue: 11_540, profit: 2_340, eps: 9.8 },
    ],
    shareholding: { promoter: 54.5, fii: 18.9, dii: 14.3, public: 12.3 },
    competitors: ["WIPRO", "ITC"],
  },
  {
    symbol: "TATASTEEL",
    about: "Tata Steel is one of the world's most geographically diversified steel producers, with operations in 26 countries. Part of the Tata Group, it has a combined crude steel capacity of over 34 million tonnes per annum.",
    quarterlyResults: [
      { quarter: "Q1 FY26", revenue: 55_430, profit: 1_890, eps: 1.6 },
      { quarter: "Q4 FY25", revenue: 54_120, profit: 1_670, eps: 1.4 },
      { quarter: "Q3 FY25", revenue: 52_890, profit: 1_480, eps: 1.2 },
      { quarter: "Q2 FY25", revenue: 51_230, profit: 1_230, eps: 1.0 },
    ],
    shareholding: { promoter: 33.2, fii: 18.4, dii: 22.1, public: 26.3 },
    competitors: ["ADANIPORTS", "NTPC", "ONGC"],
  },
  {
    symbol: "WIPRO",
    about: "Wipro Limited is a leading global IT, consulting, and business process services company. Headquartered in Bangalore, it delivers technology-driven business solutions to clients in 66 countries.",
    quarterlyResults: [
      { quarter: "Q1 FY26", revenue: 22_340, profit: 3_120, eps: 5.9 },
      { quarter: "Q4 FY25", revenue: 22_180, profit: 3_080, eps: 5.9 },
      { quarter: "Q3 FY25", revenue: 21_890, profit: 2_940, eps: 5.6 },
      { quarter: "Q2 FY25", revenue: 21_560, profit: 2_810, eps: 5.4 },
    ],
    shareholding: { promoter: 72.9, fii: 9.8, dii: 10.2, public: 7.1 },
    competitors: ["TCS", "INFY", "LT"],
  },
  {
    symbol: "AXISBANK",
    about: "Axis Bank is India's third-largest private-sector bank, offering a comprehensive suite of financial products for retail, corporate, and SME customers. It has a growing digital banking presence.",
    quarterlyResults: [
      { quarter: "Q1 FY26", revenue: 32_870, profit: 6_540, eps: 21.2 },
      { quarter: "Q4 FY25", revenue: 31_680, profit: 6_240, eps: 20.2 },
      { quarter: "Q3 FY25", revenue: 30_540, profit: 5_980, eps: 19.4 },
      { quarter: "Q2 FY25", revenue: 29_410, profit: 5_720, eps: 18.5 },
    ],
    shareholding: { promoter: 8.2, fii: 46.2, dii: 28.8, public: 16.8 },
    competitors: ["HDFCBANK", "SBIN", "KOTAKBANK"],
  },
  {
    symbol: "ADANIPORTS",
    about: "Adani Ports & SEZ is India's largest port developer and operator, managing 13 ports and terminals. Part of the Adani Group, it handles about 25% of India's total port cargo.",
    quarterlyResults: [
      { quarter: "Q1 FY26", revenue: 7_890, profit: 2_340, eps: 10.8 },
      { quarter: "Q4 FY25", revenue: 7_560, profit: 2_180, eps: 10.1 },
      { quarter: "Q3 FY25", revenue: 7_230, profit: 2_010, eps: 9.3 },
      { quarter: "Q2 FY25", revenue: 6_890, profit: 1_870, eps: 8.7 },
    ],
    shareholding: { promoter: 65.1, fii: 17.2, dii: 10.4, public: 7.3 },
    competitors: ["LT", "NTPC"],
  },
  {
    symbol: "HINDUNILVR",
    about: "Hindustan Unilever is India's largest FMCG company, a subsidiary of Unilever. Its portfolio includes household names like Dove, Surf Excel, Lux, Lifebuoy, Knorr, and Lakme.",
    quarterlyResults: [
      { quarter: "Q1 FY26", revenue: 15_640, profit: 2_690, eps: 11.5 },
      { quarter: "Q4 FY25", revenue: 15_120, profit: 2_580, eps: 11.0 },
      { quarter: "Q3 FY25", revenue: 14_780, profit: 2_470, eps: 10.5 },
      { quarter: "Q2 FY25", revenue: 14_430, profit: 2_350, eps: 10.0 },
    ],
    shareholding: { promoter: 61.9, fii: 14.6, dii: 10.8, public: 12.7 },
    competitors: ["ITC", "ASIANPAINT"],
  },
  {
    symbol: "NTPC",
    about: "NTPC Limited is India's largest power generation company, a Central Public Sector Undertaking. It has a total installed capacity of over 73 GW across coal, gas, hydro, and renewable energy sources.",
    quarterlyResults: [
      { quarter: "Q1 FY26", revenue: 45_680, profit: 5_120, eps: 5.3 },
      { quarter: "Q4 FY25", revenue: 44_320, profit: 4_890, eps: 5.0 },
      { quarter: "Q3 FY25", revenue: 43_180, profit: 4_670, eps: 4.8 },
      { quarter: "Q2 FY25", revenue: 42_010, profit: 4_450, eps: 4.6 },
    ],
    shareholding: { promoter: 51.1, fii: 18.9, dii: 20.3, public: 9.7 },
    competitors: ["ONGC", "TATASTEEL"],
  },
  {
    symbol: "ONGC",
    about: "Oil and Natural Gas Corporation is India's largest crude oil and natural gas company, a Maharatna central public sector enterprise. ONGC contributes around 71% of India's domestic crude oil production.",
    quarterlyResults: [
      { quarter: "Q1 FY26", revenue: 35_420, profit: 8_940, eps: 7.1 },
      { quarter: "Q4 FY25", revenue: 34_560, profit: 8_520, eps: 6.8 },
      { quarter: "Q3 FY25", revenue: 33_780, profit: 8_120, eps: 6.5 },
      { quarter: "Q2 FY25", revenue: 32_940, profit: 7_780, eps: 6.2 },
    ],
    shareholding: { promoter: 58.9, fii: 10.1, dii: 20.8, public: 10.2 },
    competitors: ["RELIANCE", "NTPC"],
  },
  {
    symbol: "TITAN",
    about: "Titan Company is India's leading lifestyle company, a joint venture between the Tata Group and the Tamil Nadu Industrial Development Corporation. Known for brands like Tanishq (jewellery), Titan (watches), and Titan Eye+.",
    quarterlyResults: [
      { quarter: "Q1 FY26", revenue: 12_340, profit: 890, eps: 10.0 },
      { quarter: "Q4 FY25", revenue: 14_560, profit: 1_020, eps: 11.5 },
      { quarter: "Q3 FY25", revenue: 13_890, profit: 980, eps: 11.0 },
      { quarter: "Q2 FY25", revenue: 11_780, profit: 820, eps: 9.2 },
    ],
    shareholding: { promoter: 52.9, fii: 18.4, dii: 14.6, public: 14.1 },
    competitors: ["ASIANPAINT", "HINDUNILVR"],
  },
  {
    symbol: "KOTAKBANK",
    about: "Kotak Mahindra Bank is one of India's leading private sector banks, offering banking and financial services across consumer, corporate, and wealth management segments. Founded by Uday Kotak.",
    quarterlyResults: [
      { quarter: "Q1 FY26", revenue: 28_340, profit: 4_560, eps: 22.9 },
      { quarter: "Q4 FY25", revenue: 27_180, profit: 4_320, eps: 21.7 },
      { quarter: "Q3 FY25", revenue: 26_040, profit: 4_090, eps: 20.6 },
      { quarter: "Q2 FY25", revenue: 24_890, profit: 3_870, eps: 19.5 },
    ],
    shareholding: { promoter: 25.8, fii: 38.9, dii: 20.1, public: 15.2 },
    competitors: ["HDFCBANK", "AXISBANK", "SBIN"],
  },
];

export function getCompanyDetails(symbol: string): CompanyFinancials | undefined {
  return COMPANY_DETAILS.find((c) => c.symbol.toUpperCase() === symbol.toUpperCase());
}

export function getAllCompanyDetails(): CompanyFinancials[] {
  return COMPANY_DETAILS;
}
