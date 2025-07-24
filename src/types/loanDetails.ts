export type LoanDetails = {
    _id?: string;
    category: string;
    subcategory: string;
    amount: number;
    period: number;
    status: string;
    monthlyInstallment?: number;
    createdAt?: Date;
    purpose?: string;
}