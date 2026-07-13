// Mock earnings calendar data for illustrative purposes.
// Dates are generated relative to "today" so the calendar always looks current.

export interface EarningsEvent {
  symbol: string;
  name: string;
  date: string;
  quarter: string;
  estimatedEPS?: number;
  actualEPS?: number;
  estimatedRevenue?: number;
  actualRevenue?: number;
  status: "upcoming" | "reported";
  surprise?: number;
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function getEarningsCalendar(): EarningsEvent[] {
  return [
    // Recent past (reported)
    { symbol: "TCS", name: "Tata Consultancy Services", date: daysFromNow(-18), quarter: "Q1 FY26", estimatedEPS: 32.5, actualEPS: 33.0, estimatedRevenue: 61_800, actualRevenue: 62_380, status: "reported", surprise: 1.5 },
    { symbol: "INFY", name: "Infosys", date: daysFromNow(-16), quarter: "Q1 FY26", estimatedEPS: 15.8, actualEPS: 15.4, estimatedRevenue: 40_200, actualRevenue: 39_820, status: "reported", surprise: -2.5 },
    { symbol: "HDFCBANK", name: "HDFC Bank", date: daysFromNow(-14), quarter: "Q1 FY26", estimatedEPS: 21.8, actualEPS: 22.1, estimatedRevenue: 84_000, actualRevenue: 85_430, status: "reported", surprise: 1.4 },
    { symbol: "RELIANCE", name: "Reliance Industries", date: daysFromNow(-12), quarter: "Q1 FY26", estimatedEPS: 28.5, actualEPS: 29.3, estimatedRevenue: 232_000, actualRevenue: 236_450, status: "reported", surprise: 2.8 },
    { symbol: "WIPRO", name: "Wipro", date: daysFromNow(-10), quarter: "Q1 FY26", estimatedEPS: 6.0, actualEPS: 5.9, estimatedRevenue: 22_500, actualRevenue: 22_340, status: "reported", surprise: -1.7 },
    { symbol: "SBIN", name: "State Bank of India", date: daysFromNow(-8), quarter: "Q1 FY26", estimatedEPS: 20.2, actualEPS: 20.9, estimatedRevenue: 118_000, actualRevenue: 120_340, status: "reported", surprise: 3.5 },
    { symbol: "AXISBANK", name: "Axis Bank", date: daysFromNow(-6), quarter: "Q1 FY26", estimatedEPS: 20.8, actualEPS: 21.2, estimatedRevenue: 32_200, actualRevenue: 32_870, status: "reported", surprise: 1.9 },
    { symbol: "ITC", name: "ITC Limited", date: daysFromNow(-4), quarter: "Q1 FY26", estimatedEPS: 4.0, actualEPS: 4.2, estimatedRevenue: 18_400, actualRevenue: 18_940, status: "reported", surprise: 5.0 },
    { symbol: "MARUTI", name: "Maruti Suzuki", date: daysFromNow(-2), quarter: "Q1 FY26", estimatedEPS: 115.0, actualEPS: 119.7, estimatedRevenue: 37_800, actualRevenue: 38_920, status: "reported", surprise: 4.1 },

    // Upcoming
    { symbol: "SUNPHARMA", name: "Sun Pharmaceutical", date: daysFromNow(2), quarter: "Q1 FY26", estimatedEPS: 11.5, estimatedRevenue: 12_700, status: "upcoming" },
    { symbol: "TATASTEEL", name: "Tata Steel", date: daysFromNow(4), quarter: "Q1 FY26", estimatedEPS: 1.5, estimatedRevenue: 55_000, status: "upcoming" },
    { symbol: "LT", name: "Larsen & Toubro", date: daysFromNow(6), quarter: "Q1 FY26", estimatedEPS: 27.5, estimatedRevenue: 54_800, status: "upcoming" },
    { symbol: "BHARTIARTL", name: "Bharti Airtel", date: daysFromNow(8), quarter: "Q1 FY26", estimatedEPS: 6.8, estimatedRevenue: 40_800, status: "upcoming" },
    { symbol: "TITAN", name: "Titan Company", date: daysFromNow(10), quarter: "Q1 FY26", estimatedEPS: 9.8, estimatedRevenue: 12_100, status: "upcoming" },
    { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", date: daysFromNow(12), quarter: "Q1 FY26", estimatedEPS: 22.5, estimatedRevenue: 28_000, status: "upcoming" },
    { symbol: "HINDUNILVR", name: "Hindustan Unilever", date: daysFromNow(14), quarter: "Q1 FY26", estimatedEPS: 11.2, estimatedRevenue: 15_400, status: "upcoming" },
    { symbol: "NTPC", name: "NTPC Limited", date: daysFromNow(16), quarter: "Q1 FY26", estimatedEPS: 5.2, estimatedRevenue: 45_200, status: "upcoming" },
    { symbol: "ADANIPORTS", name: "Adani Ports & SEZ", date: daysFromNow(18), quarter: "Q1 FY26", estimatedEPS: 10.5, estimatedRevenue: 7_700, status: "upcoming" },
    { symbol: "ASIANPAINT", name: "Asian Paints", date: daysFromNow(20), quarter: "Q1 FY26", estimatedEPS: 12.5, estimatedRevenue: 8_800, status: "upcoming" },
    { symbol: "ONGC", name: "Oil & Natural Gas Corp", date: daysFromNow(22), quarter: "Q1 FY26", estimatedEPS: 6.9, estimatedRevenue: 35_000, status: "upcoming" },
  ];
}
