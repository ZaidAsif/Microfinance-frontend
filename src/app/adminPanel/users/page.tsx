"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaUsers, FaClipboardList, FaCalendarAlt } from "react-icons/fa";
import { BASIC_URL } from "@/constant/constant";
import { User } from "@/types/user";

export default function Users() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    cnic: "",
    password: "",
    isAdmin: false,
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [updatedUserData, setUpdatedUserData] = useState({
    name: "",
    email: "",
    cnic: "",
    isAdmin: false,
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      const {data} = await axios.get(`${BASIC_URL}admin/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(data.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        `${BASIC_URL}admin/users/create`,
        newUserData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setCreateModalOpen(false);
      fetchUsers();
      setNewUserData({
        name: "",
        email: "",
        cnic: "",
        password: "",
        isAdmin: false,
      });
    } catch (error) {
      console.error("Failed to create user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    setIsUpdating(true);
    try {
      const { data } = await axios.put(
        `${BASIC_URL}admin/users/${selectedUser._id}`,
        updatedUserData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("User updated successfully:", data);
      setEditModalOpen(false);
      fetchUsers(); 
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setIsDeleting(true);
    try {
      const { data } = await axios.delete(
        `${BASIC_URL}admin/users/${selectedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || "''"}`,
          },
        }
      );
      console.log("User deleted successfully:", data);
      setDeleteModalOpen(false);
      fetchUsers(); 
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-gradient-to-br from-green-50 to-blue-50">
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
            All Users
          </h1>
          <p className="text-gray-600 text-sm">
            Manage and update users in your system.
          </p>
        </header>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-sm border border-gray-100 text-sm">
            <thead className="bg-green-100 text-green-800 font-semibold sticky top-0 z-10">
              <tr>
                {["Name", "Email", "CNIC", "Actions"].map(
                  (header, index) => (
                    <th
                      key={index}
                      className="px-3 py-2 text-left whitespace-nowrap"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-green-50 transition">
                  <td className="px-3 py-2">{user.name}</td>
                  <td className="px-3 py-2">{user.email}</td>
                  <td className="px-3 py-2">{user.cnic}</td>

                  <td className="px-3 py-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setUpdatedUserData({
                          name: user.name,
                          email: user.email,
                          cnic: user.cnic,
                          isAdmin: user.isAdmin,
                        });
                        setEditModalOpen(true);
                      }}
                      className="text-blue-600 hover:underline font-medium text-sm mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:underline font-medium text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="mt-6 bg-green-600 text-white px-6 py-2 rounded-md font-semibold text-lg"
        >
          + Create User
        </button>

        {/* Create User Modal */}
        {createModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
              <button
                onClick={() => setCreateModalOpen(false)}
                className="absolute top-3 right-3 text-xl text-gray-400 hover:text-red-500"
              >
                ×
              </button>
              <h2 className="text-xl font-bold text-green-700 mb-4">
                Create User
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={newUserData.name}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-200"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUserData.email}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-200"
                />
                <input
                  type="text"
                  placeholder="CNIC"
                  value={newUserData.cnic}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, cnic: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-200"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newUserData.password}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-200"
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newUserData.isAdmin}
                    onChange={() =>
                      setNewUserData({
                        ...newUserData,
                        isAdmin: !newUserData.isAdmin,
                      })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Is Admin</span>
                </div>
                <button
                  onClick={handleCreateUser}
                  disabled={isLoading}
                  className="w-full mt-4 bg-green-600 text-white py-2 rounded-md font-semibold text-lg disabled:bg-gray-400"
                >
                  {isLoading ? "Creating..." : "Create User"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/*edit user modal*/}
        {editModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
              <button
                onClick={() => setEditModalOpen(false)}
                className="absolute top-3 right-3 text-xl text-gray-400 hover:text-red-500"
              >
                ×
              </button>
              <h2 className="text-xl font-bold text-blue-700 mb-4">
                Edit User
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={updatedUserData.name}
                  onChange={(e) =>
                    setUpdatedUserData({
                      ...updatedUserData,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-200"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={updatedUserData.email}
                  onChange={(e) =>
                    setUpdatedUserData({
                      ...updatedUserData,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-200"
                />
                <input
                  type="text"
                  placeholder="CNIC"
                  value={updatedUserData.cnic}
                  onChange={(e) =>
                    setUpdatedUserData({
                      ...updatedUserData,
                      cnic: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-200"
                />
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={updatedUserData.isAdmin}
                    onChange={() =>
                      setUpdatedUserData({
                        ...updatedUserData,
                        isAdmin: !updatedUserData.isAdmin,
                      })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Make Admin</span>
                </div>

                <button
                  onClick={handleUpdateUser}
                  disabled={isUpdating}
                  className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md font-semibold text-lg disabled:bg-gray-400"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-sm text-center relative">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="absolute top-3 right-3 text-xl text-gray-400 hover:text-red-500"
              >
                ×
              </button>
              <h2 className="text-xl font-semibold text-red-600 mb-3">
                Delete User?
              </h2>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete{" "}
                <strong>{selectedUser?.name}</strong>? This action cannot be
                undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
