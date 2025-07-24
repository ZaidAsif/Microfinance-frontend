'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import LoanCategories from '@/components/loanCategories';
import LoanCalculator from '@/components/loanCalculator';
import { BASIC_URL } from '@/constant/constant';

export default function LandingPage() {
  const [loanCategories, setLoanCategories] = useState([]);
  const loanCalculatorRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${BASIC_URL}loan/categories`);
        setLoanCategories(data.data);
      } catch (error) {
        console.error('Error fetching loan categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const scrollToCalculator = () => {
    loanCalculatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-blue-50 to-green-50">

      {/* Hero Section - Introduction */}
      <section className="text-center py-20 sm:py-28">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-800 tracking-wide">
            Empower Your Future with Saylani Microfinance
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            We provide *interest-free loans* for business, education, home construction, and more to help you build a better future.
          </p>
          
          {/* CTA Button */}
          <div className="flex justify-center gap-4">
            <button 
              className="bg-green-600 text-white py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105"
              onClick={scrollToCalculator} // Scroll to calculator when clicked
            >
              Apply for a Loan
            </button>
          </div>
        </div>
      </section>

      {/* Loan Categories Section */}
      <section className="py-16 sm:py-20 bg-white bg-opacity-90 backdrop-blur-md shadow-lg rounded-lg mx-4 sm:mx-8 lg:mx-16 mb-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-blue-700 mb-12">
            Explore Our Loan Categories
          </h2>

          {/* Loan Categories Component */}
          <LoanCategories categories={loanCategories} />
        </div>
      </section>

      {/* Loan Calculator Section */}
      <section ref={loanCalculatorRef} className="py-16 sm:py-20 bg-gradient-to-r from-green-50 to-teal-50">
        <div className="max-w-6xl mx-auto text-center space-y-10">
          <h2 className="text-3xl sm:text-4xl font-semibold text-green-700">
            Use Our Loan Calculator
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed max-w-xl mx-auto">
            Calculate your loan installments and understand your financial commitment before you apply.
          </p>

          {/* Loan Calculator Component */}
          <LoanCalculator categories={loanCategories} />
        </div>
      </section>

    </div>
  );
}
