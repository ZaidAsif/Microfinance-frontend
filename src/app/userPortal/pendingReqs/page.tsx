'use client'

import { useEffect, useState } from "react";
import { LoanDetails } from "@/types/loanDetails";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BASIC_URL } from "@/constant/constant";

export default function PendingReqs() {
    const [pendingReqs, setpendingReqs] = useState<LoanDetails[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchPendingLoans = async () => {
            try {
                const { data } = await axios.get(`${BASIC_URL}loan/myPendingLoans`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token") || '""')}`,
                    },
                })

                setpendingReqs(data.data);
            } catch (error) {
                console.error("Failed to fetch pending loans", error);
            }
        }

        fetchPendingLoans();
    }, []);

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
                    Pending Loan Requests
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mb-6">
                    Click a card to view details of your pending loan requests.
                </p>

                {pendingReqs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {pendingReqs.map((loan) => (
                            <div
                                key={loan._id}
                                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition cursor-pointer flex flex-col p-6 border border-gray-200 hover:border-green-400"
                                onClick={() => router.push(`/userPortal/pendingReqs/${loan._id}`)}
                            >
                                <img
                                    src={`/${(loan.category ?? '').toLowerCase()}.png`}
                                    alt={loan.category}
                                    className="rounded-lg w-full h-32 object-cover mb-4"
                                />
                                <h3 className="text-xl font-semibold text-green-700 mb-2">
                                    {loan.category} <span className="text-gray-500">- {loan.subcategory}</span>
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">{loan.status}</span>
                                </div>
                                <div className="flex flex-col gap-1 text-gray-700 text-sm">
                                    <span><strong>Amount:</strong> PKR {loan.amount}</span>
                                    <span><strong>Period:</strong> {loan.period} years</span>
                                    <span><strong>Installment:</strong> PKR {loan.monthlyInstallment || "N/A"}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No pending loan requests found.</p>
                )}
            </main>
        </div>
    )

}