"use client"

import { User } from "lucide-react"
import type { CurrentUser } from "@/lib/auth/current-user"

export default function ProfileClient({ user }: { user: CurrentUser }) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">My Profile</h1>
        <p className="text-slate-400 mt-1">Manage your account details and personal information.</p>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <User className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{user.name || "User"}</h2>
            <p className="text-slate-400">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
              <input
                type="text"
                disabled
                value={user.name || ""}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none opacity-75 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none opacity-75 cursor-not-allowed"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Profile editing is currently disabled while we upgrade our database infrastructure.
          </p>
        </div>
      </div>
    </div>
  )
}
