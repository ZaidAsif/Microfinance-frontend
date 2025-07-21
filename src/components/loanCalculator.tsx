'use client';

import { useState } from 'react';
import { LoanCategory } from '@/types/category';
import { LoanDetails } from '@/types/loanDetails';
import LoanProceedModal from './proceedModal';

export default function LoanCalculator({ categories }: { categories: LoanCategory[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [loanAmount, setLoanAmount] = useState<number | string>('');
  const [deposit, setDeposit] = useState<number | string>('');
  const [loanDetails, setLoanDetails] = useState<LoanDetails | null>(null);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProceed = () => {
    if (!selectedCategory || !selectedSubcategory) {
      alert("Please select a loan category and subcategory.");
      return;
    }
    setIsModalOpen(true);
  };


  const handleCalculate = () => {
    const category = categories.find(cat => cat.name === selectedCategory);
    if (!category || typeof category.maxLoan !== "number") return;

    // Validate loan amount against the max limit
    if (Number(loanAmount) > category.maxLoan) {
      setError(`Maximum allowed loan for this category is PKR ${category.maxLoan}`);
      return;
    }

    // Clear errors if all good
    setError('');

    // Calculate remaining loan after deposit
    const finalLoanAmount = Number(loanAmount) - Number(deposit);
    setLoanDetails({
      amount: finalLoanAmount,
      period: category.duration,
      monthlyInstallment: Math.ceil(finalLoanAmount / (category.duration * 12)),
    });
  };

  return (
    <section className="py-12 bg-gray-100">
      <h2 className="text-3xl font-semibold text-center text-blue-700 mb-6">Loan Calculator</h2>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">

        {/* Loan Category Dropdown */}
        <div className="mb-4">
          <label className="block text-lg font-semibold">Select Loan Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select --</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Loan Subcategory Dropdown */}
        {selectedCategory && (
          <div className="mb-4">
            <label className="block text-lg font-semibold">Select Subcategory:</label>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">-- Select --</option>
              {categories.find(cat => cat.name === selectedCategory)?.subcategories.map((sub, i) => (
                <option key={i} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        )}

        {/* Loan Amount Input */}
        <div className="mb-4">
          <label className="block text-lg font-semibold">Enter Loan Amount (PKR):</label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="w-full p-2 border rounded"
          />
          {selectedCategory && (
            <p className="text-sm text-gray-600 mt-1">
              Max loan limit for {selectedCategory}: <strong>PKR {categories.find(cat => cat.name === selectedCategory)?.maxLoan}</strong>
            </p>
          )}
        </div>

        {/* Deposit Amount */}
        <div className="mb-4">
          <label className="block text-lg font-semibold">Initial Deposit (PKR):</label>
          <input
            type="number"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Calculate Loan
        </button>

        {/* Loan Breakdown */}
        {
        loanDetails && !error && (
          <>
          <div className="mt-6 p-4 bg-green-100 rounded">
            <p><strong>Total Loan Amount:</strong> PKR {loanDetails.amount}</p>
            <p><strong>Duration:</strong> {loanDetails.period} Years</p>
            <p><strong>Monthly Installment:</strong> PKR {loanDetails.monthlyInstallment !== undefined ? loanDetails.monthlyInstallment.toFixed(2) : 'N/A'}</p>
          </div>
        <button
          onClick={handleProceed}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Proceed
        </button>
  
        <LoanProceedModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          loanCategory={selectedCategory}
          loanSubcategory={selectedSubcategory}
          loanAmount={loanDetails.amount}
          loanPeriod={loanDetails.period}
          monthlyInstallment={Number((loanDetails.monthlyInstallment ?? 0).toFixed(2))}
        />
        </>
        )


 }
    </div>
    </section >
  );
}
