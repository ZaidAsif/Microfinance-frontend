'use client';
import { useState } from "react";
import { BASIC_URL } from "@/constant/constant";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleReset = async () => {
    try {
      await axios.post(`${BASIC_URL}auth/reset-password`, { email });
      setStatus("Password reset link sent to your email.");
    } catch (error) {
      setStatus("Failed to send reset link.");
    }
  }; 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Reset Password</h1>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 mb-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
          onClick={handleReset}
        >
          Send Reset Link
        </button>
        {status && <p className="text-center mt-3">{status}</p>}
      </div>
    </div>
  );
}
