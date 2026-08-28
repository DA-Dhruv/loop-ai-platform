"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error loading user:", error.message);
        setLoading(false);
        return;
      }

      const user = data.user;

      if (user) {
        setEmail(user.email || "");

        setFullName(user.user_metadata?.full_name || "");
        setCompany(user.user_metadata?.company || "");
        setRole(user.user_metadata?.role || "");
      }

      setLoading(false);
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        company: company,
        role: role,
      },
    });

    if (error) {
      console.error("Error saving settings:", error.message);
      alert("Unable to save settings.");
      setSaving(false);
      return;
    }

    alert("Settings saved successfully!");
    setSaving(false);
  };

  if (loading) {
    return (
      <>
        <h1 className="text-3xl font-bold text-black mb-8">
          Settings
        </h1>

        <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl">
          <p className="text-gray-600">
            Loading settings...
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-black mb-8">
        Settings
      </h1>

      <div className="max-w-2xl">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-xl font-bold text-black mb-2">
            Profile Settings
          </h2>

          <p className="text-gray-600 mb-8">
            Manage your profile information and account details.
          </p>

          <div className="space-y-6">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full border border-gray-300 rounded-lg p-3 text-black outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                disabled
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-500 bg-gray-100 cursor-not-allowed"
              />

              <p className="text-xs text-gray-500 mt-2">
                Email is managed by your authentication account.
              </p>
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company
              </label>

              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Enter your company name"
                className="w-full border border-gray-300 rounded-lg p-3 text-black outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role
              </label>

              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Enter your role"
                className="w-full border border-gray-300 rounded-lg p-3 text-black outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Save */}
            <div className="pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium cursor-pointer hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}