"use client";

import { useEffect, useState } from "react";
import {
  FaUsers,
  FaClipboardList,
  FaCalendarAlt,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BASIC_URL } from "@/constant/constant";

export default function AdminPanel() {
  const router = useRouter();
  const [filterCity, setFilterCity] = useState("");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchApplications = async (city = "") => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("token") || '""');
      let url = `${BASIC_URL}admin/applications`;
      if (city) {
        url = `${BASIC_URL}admin/applications/filter?city=${encodeURIComponent(
          city
        )}`;
      }
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApplications(data.data || []);
    } catch (error) {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = axios.put(
        `${BASIC_URL}/admin/${id}/updateStatus`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token") || '""'
            )}`,
          },
        }
      );
      console.log(res);
      setSelectedApp(null);
      fetchApplications();
    } catch {}
  };
  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchApplications(filterCity);
    }, 800);
    return () => clearTimeout(delayDebounce);
  }, [filterCity]);

  return (
    <div
      className="min-h-screen w-full flex flex-col lg:flex-row bg-gradient-to-br from-green-50 to-blue-50"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      {/* Sidebar (Desktop only) */}
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
      <nav className="fixed lg:hidden bottom-0 w-full bg-white shadow-lg border-t border-gray-200 z-20 flex justify-around px-4 py-2">
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
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-8 pb-20 overflow-x-auto my-10">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-700 mb-1">
            All Loan Applications
          </h1>
          <p className="text-gray-600 text-sm">
            Manage, filter, and review all user loan applications.
          </p>
        </header>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="City"
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="px-3 py-2 border rounded w-full sm:w-40 text-sm focus:ring-2 focus:ring-green-200"
          />
        </div>

        {/* Applications Table */}
        <div style={{ overflowX: "auto" }}>
          <table className="min-w-[900px] w-full bg-white rounded-xl shadow-sm border border-gray-100 text-sm">
            <thead className="bg-green-100 text-green-800 font-semibold">
              <tr>
                {[
                  "Token",
                  "User",
                  "Email",
                  "City",
                  "Category",
                  "Subcategory",
                  "Amount",
                  "Status",
                  "Date",
                  "",
                ].map((h, i) => (
                  <th key={i} className="px-3 py-2 text-left whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={11} className="text-center py-6 text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : applications.length ? (
                applications.map((app) => (
                  <tr key={app._id} className="hover:bg-green-50 transition">
                    <td className="px-3 py-2 text-blue-700 font-mono">
                      {app.appointmentDetails?.token}
                    </td>
                    <td className="px-3 py-2">{app.userId?.name}</td>
                    <td className="px-3 py-2">{app.userId?.email}</td>
                    <td className="px-3 py-2">{app.city}</td>
                    <td className="px-3 py-2">{app.category}</td>
                    <td className="px-3 py-2">{app.subcategory}</td>
                    <td className="px-3 py-2">
                      PKR {app.amount?.toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                          app.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : app.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {app.createdAt
                        ? new Date(app.createdAt).toLocaleDateString()
                        : ""}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="text-blue-600 hover:underline font-medium text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="text-center py-6 text-gray-400">
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {selectedApp && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-30">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedApp(null)}
                className="absolute top-3 right-4 text-xl text-gray-400 hover:text-red-500"
              >
                &times;
              </button>
              <h3 className="text-xl font-bold mb-4">Application Details</h3>
              <p>
                <strong>Loan Category:</strong> {selectedApp.category}
              </p>
              <p>
                <strong>Subcategory:</strong> {selectedApp.subcategory}
              </p>
              <p>
                <strong>Time:</strong> {selectedApp.appointmentDetails.time}
              </p>
              <p>
                <strong>User:</strong> {selectedApp.userId.name}
              </p>
              <p>
                <strong>User Email:</strong> {selectedApp.userId.email}
              </p>
              <p>
                <strong>Status:</strong> {selectedApp.status}
              </p>
              <p>
                <strong>Phone:</strong> {selectedApp.phone}
              </p>

              <h4 className="mt-4 font-semibold">Guarantors:</h4>
              <p>
                {selectedApp.guarantor1Name} ({selectedApp.guarantor1Cnic})
              </p>
              <p>
                {selectedApp.guarantor2Name} ({selectedApp.guarantor2Cnic})
              </p>

              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => updateStatus(selectedApp._id, "Approved")}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateStatus(selectedApp._id, "Rejected")}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
