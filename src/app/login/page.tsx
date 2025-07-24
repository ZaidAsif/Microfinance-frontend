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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
          Login to Your Account
        </h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-3 text-center text-sm">
            {error}
          </div>
        )}
        <button
          className={`w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition font-semibold flex items-center justify-center ${
            loading ? "bg-green-400 cursor-not-allowed" : ""
          }`}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </div>
    </div>
  );
}
