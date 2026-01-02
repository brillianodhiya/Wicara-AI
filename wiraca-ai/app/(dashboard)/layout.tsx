import React from "react";
import Link from "next/link";
import { Mic, FileText, Settings, Home, LogOut } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-accent-light/10">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b border-accent-light">
          <Link href="/" className="flex items-center">
            <span className="text-primary-blue font-bold text-xl">Wicara AI</span>
          </Link>
        </div>
        <nav className="mt-6">
          <div className="px-4 mb-3">
            <button className="w-full bg-primary-blue text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-accent-deep transition-colors">
              <Mic className="mr-2 h-5 w-5" />
              New Recording
            </button>
          </div>
          <div className="px-2">
            <Link
              href="/dashboard"
              className="flex items-center px-4 py-2 text-accent-dark hover:bg-accent-light/20 hover:text-primary-slate rounded-lg"
            >
              <Home className="h-5 w-5 mr-3 text-primary-slate" />
              Dashboard
            </Link>
            <Link
              href="/meetings"
              className="flex items-center px-4 py-2 text-accent-dark hover:bg-accent-light/20 hover:text-primary-slate rounded-lg"
            >
              <FileText className="h-5 w-5 mr-3 text-primary-slate" />
              Meetings
            </Link>
            <Link
              href="/settings/api-keys"
              className="flex items-center px-4 py-2 text-accent-dark hover:bg-accent-light/20 hover:text-primary-slate rounded-lg"
            >
              <Settings className="h-5 w-5 mr-3 text-primary-slate" />
              API Keys (BYOK)
            </Link>
            <Link
              href="/settings/preferences"
              className="flex items-center px-4 py-2 text-accent-dark hover:bg-accent-light/20 hover:text-primary-slate rounded-lg"
            >
              <Settings className="h-5 w-5 mr-3 text-primary-slate" />
              Preferences
            </Link>
          </div>
          <div className="px-2 mt-6 pt-6 border-t border-accent-light/30">
            <Link
              href="/logout"
              className="flex items-center px-4 py-2 text-accent-dark hover:bg-accent-light/20 hover:text-primary-slate rounded-lg"
            >
              <LogOut className="h-5 w-5 mr-3 text-primary-slate" />
              Logout
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-accent-dark">Dashboard</h1>
            <div className="flex items-center">
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-primary-blue flex items-center justify-center text-white">
                  U
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-accent-light/10 p-4">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
