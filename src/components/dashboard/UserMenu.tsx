"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import LogoutButton from "./LogoutButton"
import type { CurrentUser } from "@/lib/auth/current-user"

export default function UserMenu({ user }: { user: CurrentUser }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const isAdmin = user.email === "demo@stockscope.ai" || user.email === "admin@stockscope.ai"

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/10 font-mono text-xs font-medium text-ink/70 dark:bg-paper/10 dark:text-paper/70 transition-colors hover:bg-ink/20 dark:hover:bg-paper/20"
      >
        {initials}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-paper dark:bg-ink border border-ink/10 dark:border-paper/10 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-ink/10 dark:border-paper/10">
              <p className="text-sm font-medium text-ink dark:text-paper truncate">{user.name}</p>
              <p className="text-xs text-ink/60 dark:text-paper/60 truncate">{user.email}</p>
            </div>
            
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-ink/80 hover:bg-ink/5 dark:text-paper/80 dark:hover:bg-paper/10"
              onClick={() => setIsOpen(false)}
            >
              My Profile
            </Link>
            
            <Link
              href="/settings"
              className="block px-4 py-2 text-sm text-ink/80 hover:bg-ink/5 dark:text-paper/80 dark:hover:bg-paper/10"
              onClick={() => setIsOpen(false)}
            >
              Settings
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="block px-4 py-2 text-sm text-brand-600 hover:bg-brand-500/10 dark:text-brand-400 dark:hover:bg-brand-400/10 font-medium border-t border-ink/10 dark:border-paper/10"
                onClick={() => setIsOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}

            <div className="border-t border-ink/10 dark:border-paper/10 mt-1">
              <div className="px-4 py-2">
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
