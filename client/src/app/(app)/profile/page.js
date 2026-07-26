"use client";

import { useState, useEffect, useRef } from "react";
import { User, Lock, Mail, Save, AlertCircle, CheckCircle2, Camera, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import axios from "@/lib/axios";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const token = useAuthStore((state) => state.token);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  // Avatar upload states
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [nameStatus, setNameStatus] = useState({ loading: false, error: null, success: false });

  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [passStatus, setPassStatus] = useState({ loading: false, error: null, success: false });

  // Sync state with user store once loaded
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setProfilePicture(user.profilePicture || null);
      setAvatarPreview(user.profilePicture || null);
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setNameStatus({ loading: true, error: null, success: false });

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (avatarFile) {
        formData.append("profilePicture", avatarFile);
      }

      const response = await axios.put("/auth/me", formData);

      const data = response.data;
      if (!data.success) {
        throw new Error(data.message || "Failed to update profile details.");
      }

      setUser(data.user);
      setNameStatus({ loading: false, error: null, success: true });
      toast.success("Profile updated successfully!");
      setTimeout(() => setNameStatus((s) => ({ ...s, success: false })), 3000);
    } catch (err) {
      setNameStatus({ loading: false, error: err.message, success: false });
      toast.error(err.message || "Error updating profile details");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setPassStatus({ loading: false, error: "New passwords do not match", success: false });
    }

    setPassStatus({ loading: true, error: null, success: false });

    try {
      const response = await axios.put("/auth/me", {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      const data = response.data;
      if (!data.success) {
        throw new Error(data.message || "Failed to update password.");
      }

      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setPassStatus({ loading: false, error: null, success: true });
      toast.success("Password updated successfully!");
      setTimeout(() => setPassStatus((s) => ({ ...s, success: false })), 3000);
    } catch (err) {
      setPassStatus({ loading: false, error: err.message, success: false });
      toast.error(err.message || "Error updating password");
    }
  };

  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <motion.div
      className="space-y-6 max-w-3xl animate-fadeIn"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Profile</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage your personal account details.</p>
      </motion.div>

      {/* Personal Information */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
      >
        <h2 className="text-[15px] font-semibold text-gray-900 mb-6 flex items-center">
          <User className="mr-2 text-indigo-500" size={18} strokeWidth={2} /> Personal Information
        </h2>

        {nameStatus.error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center text-sm">
            <AlertCircle size={16} className="mr-2" /> {nameStatus.error}
          </div>
        )}
        {nameStatus.success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center text-sm">
            <CheckCircle2 size={16} className="mr-2" /> Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center sm:flex-row gap-6 pb-4 border-b border-gray-50">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border border-gray-200 shadow-sm transition-all group-hover:opacity-85"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#f4f2ff] flex items-center justify-center text-[#5a38ef] font-bold text-3xl border border-gray-150 shadow-sm transition-all group-hover:opacity-85">
                  {initial}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera size={20} />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Profile Picture</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm">
                Click on the avatar to upload a new profile picture. Supports PNG, JPG, or GIF up to 2MB.
              </p>
              {avatarFile && (
                <p className="text-xs text-indigo-555 font-medium mt-2">
                  New picture selected: {avatarFile.name} (uncommitted)
                </p>
              )}
            </div>
          </div>

          {/* Details Forms */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Email cannot be changed.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={nameStatus.loading}
              className="inline-flex items-center bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {nameStatus.loading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Change Password */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
      >
        <h2 className="text-[15px] font-semibold text-gray-900 mb-6 flex items-center">
          <Lock className="mr-2 text-indigo-500" size={18} strokeWidth={2} /> Change Password
        </h2>

        {passStatus.error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center text-sm">
            <AlertCircle size={16} className="mr-2" /> {passStatus.error}
          </div>
        )}
        {passStatus.success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center text-sm">
            <CheckCircle2 size={16} className="mr-2" /> Password updated successfully!
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={16} />
              </div>
              <input
                type="password"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  required
                  minLength={6}
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={passStatus.loading || !passwordForm.oldPassword || !passwordForm.newPassword}
              className="inline-flex items-center bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {passStatus.loading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Lock size={16} className="mr-2" />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
