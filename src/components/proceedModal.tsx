import { BASIC_URL } from "@/constant/constant";
import axios from "axios";
import React, { useState } from "react";

interface LoanProceedModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanCategory: string;
  loanSubcategory: string;
  loanAmount: number | undefined;
  loanPeriod: number | undefined;
  monthlyInstallment: number;
}

const LoanProceedModal: React.FC<LoanProceedModalProps> = ({
  isOpen,
  onClose,
  loanCategory,
  loanSubcategory,
  loanAmount,
  loanPeriod,
  monthlyInstallment
}) => {

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [cnic, setCnic] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 

  const validateCNIC = (cnic: string) => /^[0-9]{13}$/.test(cnic);
  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async () => {
    setError("");
    setSuccessMessage(""); 

    if (!name || !email || !cnic) {
      setError("All fields are required.");
      return;
    }
    if (!validateCNIC(cnic)) {
      setError("Invalid CNIC format. It must be 13 digits.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid email format.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(`${BASIC_URL}loan/apply`, {
        email,
        name,
        cnic,
        category: loanCategory,
        subcategory: loanSubcategory,
        amount: loanAmount,
        period: loanPeriod,
        monthlyInstallment
      });

      console.log(data);

      setSuccessMessage("✅ Loan added in queue. Your account details have been emailed.");

      // Optional: Auto-close modal after delay
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 3000);
    } catch (err) {
      console.error("Error submitting loan application:", err);
      setError("Something went wrong. Please try again later.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    setLoading(false);
    setError("");
    setSuccessMessage(""); 
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold text-green-700 text-center mb-4">Enter Your Details</h2>
        <p className="text-gray-600 text-center mb-4">
          You&apos;re applying for a <strong>{loanCategory} - {loanSubcategory}</strong> loan of <strong>PKR {loanAmount}</strong> for {loanPeriod} years.
        </p>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          name="cnic"
          placeholder="CNIC (13 Digits)"
          value={cnic}
          onChange={(e) => setCnic(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {successMessage && <p className="text-green-600 text-sm text-center mb-2">{successMessage}</p>}

        <div className="flex justify-between mt-4">
          <button
            onClick={handleClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white inline" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Processing...
              </>
            ) : ("Submit")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanProceedModal;
