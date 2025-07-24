"use client";

import { BASIC_URL } from "@/constant/constant";
import type { LoanDetails } from "@/types/loanDetails";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function LoanDetails() {
  const { id }: { id: string } = useParams();
  const router = useRouter();
  const [loanDetails, setLoanDetails] = useState<LoanDetails | null>(null);

  const [guarantor1Name, setGuarantor1Name] = useState("");
  const [guarantor1Email, setGuarantor1Email] = useState("");
  const [guarantor1Location, setGuarantor1Location] = useState("");
  const [guarantor1Cnic, setGuarantor1Cnic] = useState("");

  const [guarantor2Name, setGuarantor2Name] = useState("");
  const [guarantor2Email, setGuarantor2Email] = useState("");
  const [guarantor2Location, setGuarantor2Location] = useState("");
  const [guarantor2Cnic, setGuarantor2Cnic] = useState("");

  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [pdfLoading, setPdfLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const { data } = await axios.post(
          `${BASIC_URL}loan/pendingLoanDetail`,
          { id },
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("token") || '""'
              )}`,
            },
          }
        );
        setLoanDetails(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLoanDetails();
  }, [id]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!/^\d{13}$/.test(guarantor1Cnic))
      newErrors.guarantor1Cnic = "CNIC must be 13 digits";
    if (!/^\d{13}$/.test(guarantor2Cnic))
      newErrors.guarantor2Cnic = "CNIC must be 13 digits";
    if (!/^\d{11,13}$/.test(phone))
      newErrors.phone = "Phone must be 11-13 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const generatePdfSlip = async (
    userId: string,
    loanId: string,
    token: string
  ) => {
    setPdfLoading(true);
    try {
      await axios.post(
        `${BASIC_URL}slip/generate`,
        {
          userId,
          loanId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFormSuccess(
        "Appointment slip generated! You can check your email inbox."
      );
    } catch (error) {
      setFormError(
          "Failed to generate slip."
      );
      console.error(error);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    if (!validate()) return;
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("token") || '""');
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      await axios.post(
        `${BASIC_URL}loan/additionalInfo`,
        {
          id,
          city,
          phone,
          guarantor1Name,
          guarantor1Cnic,
          guarantor1Email,
          guarantor1Location,
          guarantor2Name,
          guarantor2Cnic,
          guarantor2Email,
          guarantor2Location,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFormSuccess("Additional info added successfully!");

      await generatePdfSlip(user._id, id, token);
      
    } catch (error) {
      console.error("Error submitting details:", error);
      setFormError(
          "Failed to submit details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col md:flex-row">
      {/* Custom Mobile Quick Actions */}
      <div className="fixed bottom-4 left-0 w-full flex justify-center z-30 md:hidden">
        <div className="bg-white shadow-lg rounded-full px-6 py-3 flex gap-8 border border-gray-200">
          <button
            className="flex flex-col items-center text-sm font-medium text-gray-700 hover:text-green-600 transition"
            onClick={() => router.push("/userPortal/pendingReqs")}
          >
            <span className="text-xl mb-1">📄</span>
            <span>Pending Loans</span>
          </button>
          <button
            className="flex flex-col items-center text-sm font-medium text-gray-700 hover:text-green-600 transition"
            onClick={() => router.push("/userPortal/changePassword")}
          >
            <span className="text-xl mb-1">🔐</span>
            <span>Change Password</span>
          </button>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white shadow-md p-6 sticky top-0 h-screen py-20">
        <h2 className="text-blue-700 text-2xl font-bold mb-6">User Portal</h2>
        <nav className="space-y-4 text-base">
          <button
            className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition font-medium"
            onClick={() => router.push("/userPortal/pendingReqs")}
          >
            <span className="text-xl">📄</span>
            <span>Manage Pending Loans</span>
          </button>
          <button
            className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition font-medium"
            onClick={() => router.push("/userPortal/changePassword")}
          >
            <span className="text-xl">🔐</span>
            <span>Change Password</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 py-20 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Loan Request Details
        </h1>
        {!loanDetails ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
            <span className="text-gray-500">Loading loan details...</span>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-gray-100 transition hover:shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-blue-800 mb-1">
                  {loanDetails.category}{" "}
                  <span className="text-gray-500">
                    ({loanDetails.subcategory})
                  </span>
                </h2>
                <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
                  {loanDetails.status}
                </span>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-lg font-bold text-green-600">
                  PKR {loanDetails.amount}
                </span>
                <span className="text-gray-600 text-sm">
                  Period: {loanDetails.period} years
                </span>
                <span className="text-gray-600 text-sm">
                  Installment: PKR {loanDetails.monthlyInstallment || "N/A"}
                </span>
              </div>
            </div>
            <div className="text-gray-700 text-sm">
              <div>
                <strong>Applied On:</strong>{" "}
                {loanDetails.createdAt
                  ? new Date(loanDetails.createdAt).toLocaleDateString()
                  : "N/A"}
              </div>
              <div>
                <strong>Purpose:</strong> {loanDetails.purpose || "N/A"}
              </div>
            </div>
          </div>
        )}

        <form
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            Guarantors Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition">
              <h3 className="font-semibold text-green-700 mb-2">Guarantor 1</h3>
              <input
                className="w-full mb-2 px-3 py-2 border rounded focus:ring-2 focus:ring-green-200 transition"
                placeholder="Name"
                value={guarantor1Name}
                onChange={(e) => setGuarantor1Name(e.target.value)}
                required
              />
              <input
                className="w-full mb-2 px-3 py-2 border rounded focus:ring-2 focus:ring-green-200 transition"
                placeholder="Email"
                type="email"
                value={guarantor1Email}
                onChange={(e) => setGuarantor1Email(e.target.value)}
                required
              />
              <input
                className="w-full mb-2 px-3 py-2 border rounded focus:ring-2 focus:ring-green-200 transition"
                placeholder="Location"
                value={guarantor1Location}
                onChange={(e) => setGuarantor1Location(e.target.value)}
                required
              />
              <input
                className={`w-full mb-2 px-3 py-2 border rounded focus:ring-2 focus:ring-green-200 transition ${
                  errors.guarantor1Cnic ? "border-red-500" : ""
                }`}
                placeholder="CNIC"
                value={guarantor1Cnic}
                onChange={(e) =>
                  setGuarantor1Cnic(
                    e.target.value.replace(/\D/g, "").slice(0, 13)
                  )
                }
                maxLength={13}
                required
              />
              {errors.guarantor1Cnic && (
                <p className="text-red-500 text-xs mb-2">
                  {errors.guarantor1Cnic}
                </p>
              )}
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition">
              <h3 className="font-semibold text-green-700 mb-2">Guarantor 2</h3>
              <input
                className="w-full mb-2 px-3 py-2 border rounded focus:ring-2 focus:ring-green-200 transition"
                placeholder="Name"
                value={guarantor2Name}
                onChange={(e) => setGuarantor2Name(e.target.value)}
                required
              />
              <input
                className="w-full mb-2 px-3 py-2 border rounded focus:ring-2 focus:ring-green-200 transition"
                placeholder="Email"
                type="email"
                value={guarantor2Email}
                onChange={(e) => setGuarantor2Email(e.target.value)}
                required
              />
              <input
                className="w-full mb-2 px-3 py-2 border rounded focus:ring-2 focus:ring-green-200 transition"
                placeholder="Location"
                value={guarantor2Location}
                onChange={(e) => setGuarantor2Location(e.target.value)}
                required
              />
              <input
                className={`w-full mb-2 px-3 py-2 border rounded focus:ring-2 focus:ring-green-200 transition ${
                  errors.guarantor2Cnic ? "border-red-500" : ""
                }`}
                placeholder="CNIC"
                value={guarantor2Cnic}
                onChange={(e) =>
                  setGuarantor2Cnic(
                    e.target.value.replace(/\D/g, "").slice(0, 13)
                  )
                }
                maxLength={13}
                required
              />
              {errors.guarantor2Cnic && (
                <p className="text-red-500 text-xs mb-2">
                  {errors.guarantor2Cnic}
                </p>
              )}
            </div>
          </div>

          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <input
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-200 transition"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <input
              className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-200 transition ${
                errors.phone ? "border-red-500" : ""
              }`}
              placeholder="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 13))
              }
              maxLength={13}
              required
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mb-2">{errors.phone}</p>
            )}
          </div>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4 text-center text-sm">
              {formError}
            </div>
          )}
          {formSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded mb-4 text-center text-sm">
              {formSuccess}
            </div>
          )}

          <button
            className={`w-full py-3 rounded font-bold text-lg transition
                            ${
                              loading || pdfLoading
                                ? "bg-green-400 cursor-not-allowed text-white"
                                : "bg-green-600 hover:bg-green-700 text-white"
                            }
                        `}
            disabled={loading || pdfLoading}
          >
            {loading || pdfLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                {loading ? "Submitting..." : "Generating Slip..."}
              </span>
            ) : (
              "Submit & Generate Slip"
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
