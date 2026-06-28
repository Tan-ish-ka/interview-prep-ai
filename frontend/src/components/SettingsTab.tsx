
import { useAuth } from "../contexts/AuthContext";
import { User, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function SettingsTab() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Account Settings</h2>
        <p>Manage your profile, preferences, and view usage statistics.</p>
      </div>

      <div className="settings-grid max-w-4xl">
        <motion.div className="settings-main">
          {/* Profile Section */}
          <div className="settings-card">
            <div className="settings-card-header">
              <span className="text-blue-400"><User size={24} /></span>
              <div>
                <h3>Profile</h3>
                <p>Your personal information</p>
              </div>
            </div>
            
            <div className="settings-card-body p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                  <div className="text-white font-medium bg-gray-800/50 p-3 rounded-lg border border-gray-700">{user.username}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <div className="text-white font-medium bg-gray-800/50 p-3 rounded-lg border border-gray-700">{user.email}</div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                  <div className="text-white font-medium bg-gray-800/50 p-3 rounded-lg border border-gray-700">{user.full_name || "Not set"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Usage & Plan Section */}
          <div className="settings-card mt-6">
            <div className="settings-card-header">
              <span className="text-orange-400"><Zap size={24} /></span>
              <div>
                <h3>Usage & Plan</h3>
                <p>Your current subscription and API usage</p>
              </div>
            </div>
            
            <div className="settings-card-body p-6 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 mb-4">
                <div>
                  <div className="text-sm text-blue-400 font-semibold uppercase tracking-wider mb-1">Current Plan</div>
                  <div className="text-2xl font-bold text-white capitalize">{user.plan} Plan</div>
                </div>
                <div className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium cursor-pointer transition-colors">
                  Upgrade
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-gray-700 bg-gray-800/30 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-white mb-1">{user.reports_generated}</div>
                  <div className="text-sm text-gray-400">Reports Generated</div>
                </div>
                <div className="p-4 rounded-xl border border-gray-700 bg-gray-800/30 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-white mb-1">{user.ai_requests}</div>
                  <div className="text-sm text-gray-400">AI Requests</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Security Section */}
          <div className="settings-card mt-6">
            <div className="settings-card-header">
              <span className="text-green-400"><Shield size={24} /></span>
              <div>
                <h3>Security</h3>
                <p>Manage your account security</p>
              </div>
            </div>
            <div className="settings-card-body p-6">
              <button className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                Change Password
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
