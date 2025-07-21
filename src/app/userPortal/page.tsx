'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { BASIC_URL } from "@/constant/constant";
import useAuthStore from "@/store/authstore";
import { useRouter } from "next/navigation";
import { FaClock, FaTimesCircle, FaCheckCircle } from "react-icons/fa";

export default function UserDashboard() {
  const [loanRequests, setLoanRequests] = useState([]);
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchLoanRequests = async () => {
      try {
        const { data } = await axios.get(`${BASIC_URL}loan/myLoans`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("token") || '""')}`,
          },
        });
        setLoanRequests(data.data);
      } catch (error) {
        console.error("Failed to fetch loans", error);
      }
    };

    fetchLoanRequests();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return {
          color: "text-yellow-700",
          bg: "bg-yellow-100",
          icon: <FaClock className="text-yellow-600 text-sm sm:text-base" />,
        };
      case "Rejected":
        return {
          color: "text-red-700",
          bg: "bg-red-100",
          icon: <FaTimesCircle className="text-red-600 text-sm sm:text-base" />,
        };
      case "Approved":
        return {
          color: "text-green-700",
          bg: "bg-green-100",
          icon: <FaCheckCircle className="text-green-600 text-sm sm:text-base" />,
        };
      default:
        return {
          color: "text-gray-700",
          bg: "bg-gray-100",
          icon: null,
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
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
        className="block text-gray-700 hover:text-green-600 transition"
        onClick={() => router.push("/userPortal/pendingReqs")}
      >
        📄 Manage Pending Loans
      </button>
      <button
        className="block text-gray-700 hover:text-green-600 transition"
        onClick={() => router.push("/userPortal/changePassword")}
      >
        🔐 Change Password
      </button>
    </nav>
  </aside>

  {/* Main Content */}
  <main className="flex-1 p-6 py-20">
    <h1 className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
      Hi, {user?.name}
    </h1>
    <p className="text-sm sm:text-base text-gray-600 mb-6">
      Here are your submitted loan requests
    </p>

    {loanRequests.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loanRequests.map((loan: any) => {
          const status = getStatusStyle(loan.status);
          return (
            <div
              key={loan._id}
              className="bg-white rounded-lg shadow p-4 flex flex-col"
            >
              <img
                src={`/${loan.category.toLowerCase()}.png`}
                alt={loan.category}
                className="rounded-lg w-full h-32 object-cover mb-4"
              />
              <h3 className="text-lg sm:text-xl font-semibold text-green-700 mb-1">
                {loan.category} - {loan.subcategory}
              </h3>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 text-xs sm:text-sm rounded-full font-medium ${status.bg} ${status.color} mb-2`}
              >
                {status.icon}
                {loan.status}
              </div>
              <p className="text-gray-700 text-sm sm:text-base">
                <strong>Amount:</strong> PKR {loan.amount}
              </p>
              <p className="text-gray-700 text-sm sm:text-base">
                <strong>Period:</strong> {loan.period} years
              </p>
              <p className="text-gray-700 text-sm sm:text-base">
                <strong>Installment:</strong> PKR {loan.monthlyInstallment || "N/A"}
              </p>
            </div>
          );
        })}
      </div>
    ) : (
      <p className="text-gray-500">No loan requests found.</p>
    )}
  </main>
</div>

  );
}
