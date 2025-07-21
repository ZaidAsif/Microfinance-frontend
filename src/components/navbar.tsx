'use client'

import useAuthStore from "@/store/authstore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Navbar () {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const loadSession = useAuthStore((state) => state.loadSession);

    useEffect(() => {
        loadSession();
    }, [])

    const handleLogout = () => {
        logout();
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/login')
    }

    return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Left: Logo / App Name */}
        <h1
          className="text-2xl font-bold cursor-pointer text-green-800 drop-shadow"
          onClick={() => router.push('/')}
        >
          Saylani Microfinance
        </h1>

        {/* Right: Conditional Button */}
        <div>
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300 shadow"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300 shadow"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}