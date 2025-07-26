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

    setError('');

    const finalLoanAmount = Number(loanAmount) - Number(deposit);
    setLoanDetails({
      amount: finalLoanAmount,
      period: category.duration,
      monthlyInstallment: Math.ceil(finalLoanAmount / (category.duration * 12)),
    });
  };

  return (
    <section className="py-12 bg-gradient-to-r from-blue-50 to-teal-50">

      {/* Glassmorphism Container */}
      <div className="max-w-3xl mx-auto p-8 bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl shadow-2xl space-y-6">

        {/* Loan Category Dropdown */}
        <div className="mb-4">
          <label className="block text-xl font-semibold text-gray-700">Select Loan Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-3 bg-transparent border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
            <label className="block text-xl font-semibold text-gray-700">Select Subcategory:</label>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="w-full p-3 bg-transparent border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">-- Select --</option>
              {categories.find(cat => cat.name === selectedCategory)?.subcategories.map((sub, i) => (
                <option key={i} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-xl font-semibold text-gray-700">Enter Loan Amount (PKR):</label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="w-full p-3 bg-transparent border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          {selectedCategory && (
            <p className="text-sm text-gray-600 mt-2">
              Max loan limit for {selectedCategory}: <strong>PKR {categories.find(cat => cat.name === selectedCategory)?.maxLoan}</strong>
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-xl font-semibold text-gray-700">Initial Deposit (PKR):</label>
          <input
            type="number"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            className="w-full p-3 bg-transparent border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleCalculate}
          className="w-full bg-green-600 text-white py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-105"
        >
          Calculate Loan
        </button>

        {loanDetails && !error && (
          <div className="mt-6 p-6 bg-green-100 rounded-xl shadow-lg space-y-4">
            <p className="text-lg font-semibold">Loan Breakdown</p>
            <p><strong>Total Loan Amount:</strong> PKR {loanDetails.amount}</p>
            <p><strong>Duration:</strong> {loanDetails.period} Years</p>
            <p><strong>Monthly Installment:</strong> PKR {loanDetails.monthlyInstallment?.toFixed(2) ?? 'N/A'}</p>

            <button
              onClick={handleProceed}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Proceed
            </button>
          </div>
        )}

        {/* Modal */}
        <LoanProceedModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          loanCategory={selectedCategory}
          loanSubcategory={selectedSubcategory}
          loanAmount={loanDetails?.amount ?? 0}
          loanPeriod={loanDetails?.period ?? 0}
          monthlyInstallment={Number((loanDetails?.monthlyInstallment ?? 0).toFixed(2))}
        />
      </div>
    </section>
  );
}
