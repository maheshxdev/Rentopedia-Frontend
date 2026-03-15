// src/pages/Settings.jsx
import { useUser } from "../context/UserData";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Settings = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem("notificationsEnabled");
    return saved ? saved === "true" : true;
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Profile upload & preview
  const [profileFile, setProfileFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    user?.profileImageURL || ""
  );

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      setPreviewImage(URL.createObjectURL(file)); // preview before upload
    }
  };

  const handleProfileUpload = async () => {
    if (!profileFile) return toast.warn("Please select a file!");

    const formData = new FormData();
    formData.append("profileImage", profileFile);

    try {
      const res = await axios.put(
        "https://rentopedia-backend.onrender.com/api/user/upload-profile",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(res.data.message);
      setUser(res.data.user); // update context with new user data
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload profile photo");
    }
  };

  const updatePassword = async () => {
    try {
      const res = await axios.put(
        "https://rentopedia-backend.onrender.com/api/user/change-password",
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      );

      toast.success(res.data.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed");
    }
  };

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const toggleNotifications = () => setNotificationsEnabled((prev) => !prev);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("notificationsEnabled", String(notificationsEnabled));
  }, [notificationsEnabled]);

  const handleDeleteAccount = async () => {
    try {
      await axios.delete("https://rentopedia-backend.onrender.com/api/user/delete", {
        withCredentials: true,
      });
      toast.success("Account deleted!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete account.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "https://rentopedia-backend.onrender.com/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout failed:", err);
    }
    setUser("");
    navigate("/login");
  };

  

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 mt-10 mb-20 bg-white shadow-2xl rounded-3xl border border-purple-200 animate-fade-in">
      <h1 className="text-4xl font-bold text-purple-700 mb-10 border-b pb-4">
        ⚙️ Settings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 👤 Profile Info */}
        <div className="p-6 rounded-xl border bg-gray-50 shadow">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">
            👤 Profile Info
          </h2>
          <p>
            <span className="font-medium text-gray-700">Username:</span>{" "}
            {user.username}
          </p>
          <p>
            <span className="font-medium text-gray-700">Email:</span>{" "}
            {user.email}
          </p>
        </div>

        {/* 📷 Profile Photo */}
        <div className="p-6 rounded-xl border bg-gray-50 shadow">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">
            📷 Upload Profile Photo
          </h2>

          {/* Preview */}
          {previewImage && (
            <img
              src={previewImage}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover mb-3 shadow-md"
            />
          )}

          <input
            type="file"
            accept="image/*"
            className="block w-full mb-3 text-sm text-gray-600 border-1 p-2 rounded-md"
            onChange={handleProfileChange}
          />
          <button
            onClick={handleProfileUpload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition w-full"
          >
            Upload Photo
          </button>
        </div>

        {/* 🌗 Theme Toggle */}
        <div className="p-6 rounded-xl border bg-gray-50 shadow">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">
            🌗 Theme
          </h2>
          <button
            onClick={toggleTheme}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition w-full"
          >
            Switch to {theme === "light" ? "Dark" : "Light"} Mode
          </button>
        </div>

        {/* 🔔 Notifications */}
        <div className="p-6 rounded-xl border bg-gray-50 shadow">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">
            🔔 Notifications
          </h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={toggleNotifications}
              className="w-5 h-5 text-purple-600 accent-purple-600"
            />
            <span className="text-gray-700">
              {notificationsEnabled ? "Enabled" : "Disabled"}
            </span>
          </label>
        </div>

        {/* 🔒 Change Password */}
        <div className="p-[10px] rounded-xl border bg-gray-50 shadow md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">
            🔒 Change Password
          </h2>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2 w-full"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2 w-full"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2 w-full"
          />
          <button
            onClick={updatePassword}
            className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition"
          >
            Update Password
          </button>
        </div>

        {/* 🗑️ Delete Account */}
        <div className="p-6 rounded-xl border bg-gray-50 shadow">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            🗑️ Delete My Account
          </h2>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition w-full"
          >
            Delete Account
          </button>
        </div>

        {/* 🚪 Logout */}
        <div className="p-6 rounded-xl border bg-gray-50 shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🚪 Logout
          </h2>
          <button
            onClick={logout}
            className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-md transition w-full"
          >
            Logout
          </button>
        </div>

        {/* 📄 Terms & Privacy */}
        <div className="p-6 rounded-xl border bg-gray-50 shadow md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">
            📄 Terms & Privacy
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            By using Rentopedia, you agree to our terms of service and privacy
            policies. Please review them carefully before continuing.
          </p>
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-2 text-red-600">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 mb-4">This action will archive your data and delete all your properties. This cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded border">Cancel</button>
              <button onClick={handleDeleteAccount} className="px-4 py-2 rounded bg-red-600 text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
