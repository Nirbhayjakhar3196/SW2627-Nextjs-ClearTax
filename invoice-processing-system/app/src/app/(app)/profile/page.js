"use client";

import { useState } from "react";
import { User, Lock, Mail, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [name, setName] = useState("hakuna");
  const email = "muehehe790@gmail.com";
  const [nameStatus, setNameStatus] = useState({ loading: false, error: null, success: false });

  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [passStatus, setPassStatus] = useState({ loading: false, error: null, success: false });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setNameStatus({ loading: true, error: null, success: false });
    
    // MOCK DATA STANDIN
    setTimeout(() => {
      setNameStatus({ loading: false, error: null, success: true });
      setTimeout(() => setNameStatus(s => ({ ...s, success: false })), 3000);
    }, 800);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setPassStatus({ loading: false, error: "New passwords do not match", success: false });
    }
    
    setPassStatus({ loading: true, error: null, success: false });
    
    // MOCK DATA STANDIN
    setTimeout(() => {
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setPassStatus({ loading: false, error: null, success: true });
      setTimeout(() => setPassStatus(s => ({ ...s, success: false })), 3000);
    }, 800);
  };

  return (
    <motion.div 
      className="space-y-6 max-w-3xl"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Profile</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage your personal account details.</p>
      </motion.div>

      {/* Personal Information */}
      <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="bg-white border border-gray-200 rounded-2xl p-6">
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

        <form onSubmit={handleUpdateProfile} className="space-y-4">
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={nameStatus.loading}
              className="inline-flex items-center bg-indigo-400 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Save size={16} className="mr-2" />
              {nameStatus.loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Change Password */}
      <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="bg-white border border-gray-200 rounded-2xl p-6">
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
                onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
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
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
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
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
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
              <Lock size={16} className="mr-2" />
              {passStatus.loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
