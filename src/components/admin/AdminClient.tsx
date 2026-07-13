"use client"

import { useState } from "react"
import { Users, Server, Database, Activity, ShieldAlert, CheckCircle2 } from "lucide-react"
import type { CurrentUser } from "@/lib/auth/current-user"

export default function AdminClient({ user }: { user: CurrentUser }) {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "system">("overview")

  const metrics = [
    { label: "Total Users", value: "1,248", icon: Users, change: "+12% this week" },
    { label: "Active Sessions", value: "84", icon: Activity, change: "Stable" },
    { label: "Database Load", value: "24%", icon: Database, change: "Healthy" },
    { label: "API Rate Limits", value: "48/1000", icon: Server, change: "Normal" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">Manage users, view system metrics, and configure settings.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50">
          <ShieldAlert className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-medium text-slate-300">Admin Privileges Active</span>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-800 pb-px">
        {(["overview", "users", "system"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-1 text-sm font-medium capitalize transition-colors border-b-2 ${
              activeTab === tab
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => {
              const Icon = metric.icon
              return (
                <div key={metric.label} className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-slate-400">{metric.label}</p>
                      <h3 className="text-2xl font-bold text-white mt-1">{metric.value}</h3>
                    </div>
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <Icon className="w-5 h-5 text-indigo-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-xs">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {metric.change}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent System Logs</h3>
              <div className="space-y-4">
                {[
                  { time: "10 mins ago", event: "Live Data Refresh Completed", status: "Success" },
                  { time: "1 hour ago", event: "New User Registration Spike", status: "Info" },
                  { time: "2 hours ago", event: "API Rate Limit Warning (Twelve Data)", status: "Warning" },
                  { time: "5 hours ago", event: "Database Backup Completed", status: "Success" },
                ].map((log, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-slate-800/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-300">{log.event}</p>
                      <p className="text-xs text-slate-500 mt-1">{log.time}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        log.status === "Success"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : log.status === "Warning"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">API Usage Quotas</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Twelve Data API (Live Prices)</span>
                    <span className="text-slate-400">480 / 800 calls</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Anthropic API (AI Summaries)</span>
                    <span className="text-slate-400">120 / 1000 calls</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "12%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Neon Database Connects</span>
                    <span className="text-slate-400">42 / 100 max</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "42%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">User Management</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            View, edit, and manage registered users. This module will connect directly to the Prisma User model once the database migration is complete.
          </p>
        </div>
      )}

      {activeTab === "system" && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Server className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">System Settings</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            Configure global application settings, cache invalidation rules, and feature flags.
          </p>
        </div>
      )}
    </div>
  )
}
