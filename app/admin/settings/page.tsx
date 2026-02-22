"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Lock,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

type Tab = "profile" | "security";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Profile State
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Password State
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const res = await axios.get("/api/admin/settings/profile");
      setProfileData({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
      });
    } catch (error) {
      toast.error("Failed to load profile details", { id: "profile-fetch" });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProfileUpdating(true);
      await axios.put("/api/admin/settings/profile", profileData);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setProfileUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setPasswordUpdating(true);
      await axios.put("/api/admin/settings/password", passwordData);
      toast.success("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update password");
    } finally {
      setPasswordUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in mt-4 fade-in duration-500">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Settings
        </h1>
        <p className="text-gray-400 mt-1">
          Manage your administrator account preferences and security.
        </p>
      </div>

      {/* Horizontal Tabs */}
      <div className="border-b border-neutral-800">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("profile")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "profile"
                ? "border-emerald-500 text-emerald-500"
                : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700"
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "security"
                ? "border-emerald-500 text-emerald-500"
                : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700"
            }`}
          >
            Security
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <main className="pb-12">
        {activeTab === "profile" && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            {/* Vercel-style Card: Personal Information */}
            <div className="bg-transparent border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
              <form onSubmit={handleProfileUpdate}>
                {/* Header Zone */}
                <div className="p-6 border-b border-neutral-800 bg-neutral-900/20">
                  <h2 className="text-lg font-semibold text-white">
                    Personal Information
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Update your personal details and how we can reach you.
                  </p>
                </div>

                {/* Body Zone */}
                <div className="p-6 space-y-6 bg-transparent">
                  {profileLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                    </div>
                  ) : (
                    <>
                      {/* Name - Full Width */}
                      <div className="max-w-2xl space-y-2">
                        <label className="text-sm font-medium text-gray-300 block">
                          Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={16} className="text-gray-500" />
                          </div>
                          <input
                            type="text"
                            required
                            value={profileData.name}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="w-full max-w-md bg-neutral-900/50 border border-neutral-800 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-600"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>

                      {/* Email & Phone - Split Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300 block">
                            Contact Email
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail size={16} className="text-gray-500" />
                            </div>
                            <input
                              type="email"
                              required
                              value={profileData.email}
                              onChange={(e) =>
                                setProfileData((prev) => ({
                                  ...prev,
                                  email: e.target.value,
                                }))
                              }
                              className="w-full bg-neutral-900/50 border border-neutral-800 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-600"
                              placeholder="admin@example.com"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300 block">
                            Phone Number
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone size={16} className="text-gray-500" />
                            </div>
                            <input
                              type="tel"
                              value={profileData.phone}
                              onChange={(e) =>
                                setProfileData((prev) => ({
                                  ...prev,
                                  phone: e.target.value,
                                }))
                              }
                              className="w-full bg-neutral-900/50 border border-neutral-800 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-600"
                              placeholder="+1 (555) 000-0000"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Footer Zone */}
                <div className="p-4 bg-neutral-900/60 border-t border-neutral-800 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Emails must be unique across all users.
                  </p>
                  <button
                    type="submit"
                    disabled={profileUpdating || profileLoading}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 text-sm rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {profileUpdating ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 size={16} />
                    )}
                    {profileUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            {/* Vercel-style Card: Security Password */}
            <div className="bg-transparent border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
              <form onSubmit={handlePasswordUpdate}>
                {/* Header Zone */}
                <div className="p-6 border-b border-neutral-800 bg-neutral-900/20">
                  <h2 className="text-lg font-semibold text-white">
                    Update Password
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Ensure your account is using a long, random password to stay
                    secure.
                  </p>
                </div>

                {/* Body Zone */}
                <div className="p-6 space-y-6 bg-transparent">
                  <div className="max-w-2xl space-y-6">
                    {/* Current Password */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 block">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={16} className="text-gray-500" />
                        </div>
                        <input
                          type="password"
                          required
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              currentPassword: e.target.value,
                            }))
                          }
                          className="w-full max-w-md bg-neutral-900/50 border border-neutral-800 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-600"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      {/* New Password */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 block">
                          New Password
                        </label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              newPassword: e.target.value,
                            }))
                          }
                          className="w-full bg-neutral-900/50 border border-neutral-800 text-white rounded-lg px-4 py-2 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-600"
                          placeholder="••••••••"
                        />
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 block">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          className="w-full bg-neutral-900/50 border border-neutral-800 text-white rounded-lg px-4 py-2 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-600"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Zone */}
                <div className="p-4 bg-neutral-900/60 border-t border-neutral-800 flex items-center justify-between">
                  <p className="text-xs text-amber-500/80 flex items-center gap-1.5">
                    <AlertCircle size={14} />
                    You will remain logged in after updating your password.
                  </p>
                  <button
                    type="submit"
                    disabled={passwordUpdating}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 text-sm rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {passwordUpdating ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Lock size={16} />
                    )}
                    {passwordUpdating ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
