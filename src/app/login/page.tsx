'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BASIC_URL } from "@/constant/constant";
import useAuthStore from "@/store/authstore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser, setToken, loadSession } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    loadSession();
    if (useAuthStore.getState().user) {
      const user = useAuthStore.getState().user;
      router.push(user?.isAdmin ? "/adminPanel" : "/userPortal");
    }
  }, [router]);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${BASIC_URL}login`, { email, password });
      setUser(data.data.user);
      setToken(data.data.token);
      localStorage.setItem('token', JSON.stringify(data.data.token));
      localStorage.setItem('user', JSON.stringify(data.data.user));
      router.push(data.data.user.isAdmin ? "/adminPanel" : "/userPortal");
    } catch (error) {
console.error("Login error:", error);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="min-h-screen flex flex-col lg:flex-row">
    <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-600 via-teal-500 to-green-400 text-white flex flex-col justify-center items-center px-6 py-10">
      <div className="max-w-md text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start mb-6 space-x-3">
          <div className="bg-white rounded-full p-3">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c2.28 0 4 1.72 4 4s-1.72 4-4 4-4-1.72-4-4 1.72-4 4-4z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.364 6.364l-1.414-1.414M6.05 6.05L4.636 4.636m0 14.728l1.414-1.414M17.95 6.05l1.414-1.414" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold">MicroFinance</h2>
        </div>
        <h3 className="text-xl sm:text-2xl font-semibold mb-4">A helping hand with your finances</h3>
        <p className="text-white/90 text-sm sm:text-base leading-relaxed">
          Enter your credentials and track your loan progress. Through MicroFinance, we aim to uplift those in need by offering transparent and easy loan management solutions.
        </p>
      </div>
    </div>

    <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 sm:px-10">
      <div
        className="w-full max-w-md bg-white rounded-xl p-8 sm:p-10 shadow-xl"
        style={{ boxShadow: "20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff" }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-8 text-center">Welcome Back</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded text-sm text-center mb-4">
            {error}
          </div>
        )}
        <button
          className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 text-sm sm:text-base ${
            loading
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  </div>
);
}
