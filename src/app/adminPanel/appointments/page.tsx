"use client";
import {
  FaClipboardList,
  FaCalendarAlt,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import useApplications from "@/components/appointmentsData";
import { useState } from "react";
import AppDetailModal from "@/components/appDetailModal";
import { Application } from "@/types/application";

export default function ApplicationsPage() {
  const router = useRouter();
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleAppClick = (app: any) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApp(null);
  };

  const {
    applications,
    loading,
    error,
    eventsByDate,
    days,
    month,
    changeMonth,
  } = useApplications();

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-gradient-to-br from-green-50 to-blue-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white shadow-md p-6 h-screen sticky top-0">
        <h2 className="text-blue-700 text-2xl font-bold mb-8">
          Admin Dashboard
        </h2>
        <nav className="space-y-4 text-base">
          <button
            onClick={() => router.push("/adminPanel")}
            className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition font-medium"
          >
            <FaClipboardList className="text-xl" />
            Applications
          </button>
          <button
            onClick={() => router.push("/adminPanel/appointments")}
            className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition font-medium"
          >
            <FaCalendarAlt className="text-xl" />
            Appointments
          </button>
          <button
            onClick={() => router.push("/adminPanel/users")}
            className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition font-medium"
          >
            <FaUsers className="text-xl" />
            Users
          </button>
        </nav>
      </aside>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 w-full bg-white shadow-lg border-t border-gray-200 z-20 flex justify-around px-4 py-2">
        <button
          onClick={() => router.push("/adminPanel")}
          className="flex flex-col items-center text-gray-700 hover:text-green-600 text-xs"
        >
          <FaClipboardList className="text-xl mb-1" />
          Applications
        </button>
        <button
          onClick={() => router.push("/adminPanel/appointments")}
          className="flex flex-col items-center text-gray-700 hover:text-green-600 text-xs"
        >
          <FaCalendarAlt className="text-xl mb-1" />
          Appointments
        </button>
        <button
          onClick={() => router.push("/adminPanel/users")}
          className="flex flex-col items-center text-gray-700 hover:text-green-600 text-xs"
        >
          <FaUsers className="text-xl mb-1" />
          Users
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-10 my-10 overflow-x-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-700">
            Applications Calendar
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => changeMonth(-1)}
              className="bg-white shadow px-3 py-2 rounded-lg hover:bg-green-200 transition ease-in-out transform hover:scale-105"
            >
              <FaChevronLeft className="text-lg" /> {/* Previous month arrow */}
            </button>

            <h2 className="text-xl font-semibold text-green-700">
              {month.format("MMMM YYYY")}
            </h2>

            <button
              onClick={() => changeMonth(1)}
              className="bg-white shadow px-3 py-2 rounded-lg hover:bg-green-200 transition ease-in-out transform hover:scale-105"
            >
              <FaChevronRight className="text-lg" /> {/* Next month arrow */}
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center text-gray-500">
            Loading applications...
          </div>
        )}
        {error && <div className="text-center text-red-500">{error}</div>}

        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-10 my-10 overflow-x-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {days.map((day) => {
              const dateStr = day.format("YYYY-MM-DD");
              const dayApps = eventsByDate[dateStr] || [];

              return (
                <div
                  key={dateStr}
                  className="bg-white rounded-lg p-3 shadow hover:shadow-lg transition"
                >
                  <div className="text-sm font-semibold text-gray-600 mb-2">
                    {day.format("D MMM, ddd")}
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto custom-scroll">
                    {dayApps.length > 0 ? (
                      dayApps.map((app) => (
                        <div
                          key={app._id}
                          className="bg-green-100 text-green-800 px-2 py-1 rounded cursor-pointer"
                          onClick={() => handleAppClick(app)}
                        >
                          <p>
                            {app.userId.name} — {app.category}
                          </p>
                          <p>{app.appointmentDetails.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-400">No apps</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedApp && (
            <AppDetailModal
              showModal={showModal}
              closeModal={closeModal}
              application={selectedApp}
            />
          )}
        </div>
      </div>
    </div>
  );
}
