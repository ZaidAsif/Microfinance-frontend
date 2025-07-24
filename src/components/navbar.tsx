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
    };

    const handleDashboardbtn = () => {
        if (user?.isAdmin === true) {
            router.push('/adminPanel');
        }
        else {
            router.push('/userPortal');
        }
    };

    return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg text-white z-50">
      <div
        className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 flex flex-row items-center justify-between gap-2"
        style={{
          minHeight: "56px"
        }}
      >
        {/* Left: Logo / App Name */}
        <h1
          className="text-lg sm:text-2xl font-bold cursor-pointer text-green-800 drop-shadow truncate max-w-[60vw] sm:max-w-none"
          onClick={() => router.push('/')}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
           Microfinance
        </h1>

        {/* Right: Conditional Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {user && (
            <button
              onClick={handleDashboardbtn}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition duration-300 shadow text-xs sm:text-sm font-semibold"
              style={{
                minWidth: 90
              }}
            >
              Dashboard
            </button>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition duration-300 shadow text-xs sm:text-sm font-semibold"
              style={{
                minWidth: 70
              }}
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition duration-300 shadow text-xs sm:text-sm font-semibold"
              style={{
                minWidth: 70
              }}
            >
              Login
            </button>
          )}
        </div>
      </div>
      <style jsx global>{`
        @media (max-width: 600px) {
          nav h1 {
            font-size: 1.1rem !important;
            max-width: 70vw !important;
          }
          nav .flex.items-center.gap-2 {
            gap: 0.5rem !important;
          }
          nav button {
            font-size: 0.95rem !important;
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
            min-width: 0 !important;
          }
        }
      `}</style>
    </nav>
  );
}