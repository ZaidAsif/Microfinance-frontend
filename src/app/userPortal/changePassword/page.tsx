'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BASIC_URL } from "@/constant/constant";

export default function ChangePassword() {
    const router = useRouter();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!oldPassword) newErrors.oldPassword = "Old password is required";
        if (!newPassword) newErrors.newPassword = "New password is required";
        if (newPassword.length < 8) newErrors.newPassword = "Password must be at least 8 characters";
        if (newPassword === oldPassword) newErrors.newPassword = "New password must be different";
        if (confirmPassword !== newPassword) newErrors.confirmPassword = "Passwords do not match";
        setErrors(newErrors);
        setFormError(null);
        setFormSuccess(null);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setFormError(null);
        setFormSuccess(null);
        try {
            const token = JSON.parse(localStorage.getItem("token") || '""');
            await axios.post(
                `${BASIC_URL}auth/changePassword`,
                { oldPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            setFormSuccess("Password changed successfully!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            setFormError("Failed to change password");
            console.error("error changing password:", error);
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
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h1 className="text-2xl sm:text-3xl font-bold text-green-700 mb-2 text-center">Change Password</h1>
                    <p className="text-gray-600 text-center mb-8">
                        A system-generated password was sent to your email. You can change it here by entering your old password and a new one.
                    </p>
                    <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
                        {formError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-2 text-center text-sm">
                                {formError}
                            </div>
                        )}
                        {formSuccess && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded mb-2 text-center text-sm">
                                {formSuccess}
                            </div>
                        )}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Old Password</label>
                            <input
                                type="password"
                                className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-200 transition ${errors.oldPassword ? "border-red-500" : ""}`}
                                value={oldPassword}
                                onChange={e => setOldPassword(e.target.value)}
                                placeholder="Enter old password"
                                required
                            />
                            {errors.oldPassword && <p className="text-red-500 text-xs mt-1">{errors.oldPassword}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">New Password</label>
                            <input
                                type="password"
                                className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-200 transition ${errors.newPassword ? "border-red-500" : ""}`}
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                required
                            />
                            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-200 transition ${errors.confirmPassword ? "border-red-500" : ""}`}
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                required
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                        </div>
                        <button
                            type="submit"
                            className={`w-full py-3 rounded font-bold text-lg transition
                                ${loading
                                    ? "bg-green-400 cursor-not-allowed text-white"
                                    : "bg-green-600 hover:bg-green-700 text-white"}
                            `}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Changing...
                                </span>
                            ) : (
                                "Change Password"
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}