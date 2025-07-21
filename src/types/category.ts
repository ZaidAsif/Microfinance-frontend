export type LoanCategory = {
    name: string;
    subcategories: string[];
    maxLoan: number | "Based on Requirement";
    duration: number;
  }