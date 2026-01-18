'use client'

import { Button, User, Divider } from "@heroui/react";
import { FileText, Home, LogOut, Mic, Settings } from "lucide-react";
import Link from "next/link";
import type React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-64px)] bg-accent-light/10">
      {/* Sidebar */}
      <div className="w-64 bg-white/70 backdrop-blur-md shadow-sm border-r border-gray-200 hidden md:flex flex-col">

        <div className="p-4">
          <Button
            as={Link}
            href="/new-recording"
            color="primary"
            className="w-full font-semibold shadow-md"
            startContent={<Mic size={20} />}
          >
            New Recording
          </Button>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          <Button
            as={Link}
            href="/dashboard"
            variant="light"
            className="w-full justify-start text-gray-600 hover:text-primary-600 font-medium"
            startContent={<Home size={20} />}
          >
            Dashboard
          </Button>
          <Button
            as={Link}
            href="/meetings"
            variant="light"
            className="w-full justify-start text-gray-600 hover:text-primary-600 font-medium"
            startContent={<FileText size={20} />}
          >
            Meetings
          </Button>
          <Button
            as={Link}
            href="/settings/api-keys"
            variant="light"
            className="w-full justify-start text-gray-600 hover:text-primary-600 font-medium"
            startContent={<Settings size={20} />}
          >
            API Keys (BYOK)
          </Button>
          <Button
            as={Link}
            href="/settings/preferences"
            variant="light"
            className="w-full justify-start text-gray-600 hover:text-primary-600 font-medium"
            startContent={<Settings size={20} />}
          >
            Preferences
          </Button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Button
            as={Link}
            href="/logout"
            variant="light"
            color="danger"
            className="w-full justify-start font-medium"
            startContent={<LogOut size={20} />}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Inner Header - simplified since we have the main header */}
        <header className="bg-white/50 backdrop-blur-md border-b border-gray-100 z-10">
          <div className="px-6 py-3 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-600">
              Workspace
            </h2>
            <div className="flex items-center gap-3">
              <User
                name="User"
                description="Free Plan"
                avatarProps={{
                  src: "https://i.pravatar.cc/150?u=a04258114e29026702d"
                }}
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}
