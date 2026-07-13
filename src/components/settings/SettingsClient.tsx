"use client"

import { useState } from "react"
import { Bell, Shield, Monitor, Moon, Sun } from "lucide-react"
import type { CurrentUser } from "@/lib/auth/current-user"

export default function SettingsClient({ user }: { user: CurrentUser }) {
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark")
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    newsletters: false,
    security: true,
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Configure your app preferences and notifications.</p>
      </div>

      <div className="space-y-6">
        {/* Appearance Section */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Monitor className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Appearance</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setTheme("dark")}
                className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-colors ${
                  theme === "dark" ? "bg-indigo-500/10 border-indigo-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-300"
                }`}
              >
                <Moon className="w-6 h-6" />
                <span className="font-medium">Dark Mode</span>
              </button>
              <button
                onClick={() => setTheme("light")}
                className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-colors ${
                  theme === "light" ? "bg-indigo-500/10 border-indigo-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-300 opacity-50 cursor-not-allowed"
                }`}
                disabled
                title="Light mode coming soon"
              >
                <Sun className="w-6 h-6" />
                <span className="font-medium">Light Mode (Soon)</span>
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-colors ${
                  theme === "system" ? "bg-indigo-500/10 border-indigo-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-300 opacity-50 cursor-not-allowed"
                }`}
                disabled
              >
                <Monitor className="w-6 h-6" />
                <span className="font-medium">System (Soon)</span>
              </button>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Bell className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Price Alerts</p>
                <p className="text-sm text-slate-400">Get notified when watchlist stocks hit thresholds</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notifications.priceAlerts} onChange={(e) => setNotifications({...notifications, priceAlerts: e.target.checked})} />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Weekly Newsletter</p>
                <p className="text-sm text-slate-400">Receive a weekly summary of market insights</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notifications.newsletters} onChange={(e) => setNotifications({...notifications, newsletters: e.target.checked})} />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>
        </section>
        
        {/* Security Section */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Security</h2>
          </div>
          <div className="p-6 space-y-4">
            <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700">
              Change Password
            </button>
            <p className="text-xs text-slate-500 mt-2">
              Note: Database changes are currently disabled. Password resets will be functional after the database migration.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
