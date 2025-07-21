'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import LoanCategories from '@/components/loanCategories';
import LoanCalculator from '@/components/loanCalculator';
import { BASIC_URL } from '@/constant/constant';

export default function LandingPage() {
  const [loanCategories, setLoanCategories] = useState([]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${BASIC_URL}loan/categories`); 
        setLoanCategories(data.data);
      } catch (error) {
        console.error("Error fetching loan categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Introduction Section */}
      <section className="text-center py-24">
        <h1 className="text-5xl font-bold text-blue-700 mb-4">
          Saylani Microfinance
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Empowering individuals through interest-free loans for business, education, home construction, and more.
        </p>
      </section>

      {/* Loan Categories Component */}
      <LoanCategories categories={loanCategories} />

      {/* Loan Calculator */}
      <LoanCalculator categories={loanCategories} />

    </div>
  );
}
