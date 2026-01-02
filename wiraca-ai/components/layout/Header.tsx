'use client'
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="shadow-sm" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <span className="font-bold text-xl" style={{ color: '#0474C4' }}>Wicara AI</span>
              </Link>
            </div>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                href="/features"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium"
                style={{ color: '#262B40' }}
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium"
                style={{ color: '#262B40' }}
              >
                Pricing
              </Link>
              <Link
                href="/plugins"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium"
                style={{ color: '#262B40' }}
              >
                Plugins
              </Link>
            </nav>
          </div>
          <div className="hidden md:flex items-center">
            <Link
              href="/(auth)/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md"
              style={{ backgroundColor: '#A8C4EC', color: '#262B40' }}
            >
              Log in
            </Link>
            <Link
              href="/(auth)/register"
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white"
              style={{ backgroundColor: '#0474C4' }}
            >
              Sign up
            </Link>
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset"
              style={{ color: '#262B40', borderColor: '#0474C4' }}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/features"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
              style={{ color: '#262B40' }}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
              style={{ color: '#262B40' }}
            >
              Pricing
            </Link>
            <Link
              href="/plugins"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
              style={{ color: '#262B40' }}
            >
              Plugins
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t" style={{ borderColor: '#A8C4EC' }}>
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#5379AE' }}>
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium" style={{ color: '#262B40' }}>Account</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                href="/(auth)/login"
                className="block px-4 py-2 text-base font-medium"
                style={{ color: '#262B40' }}
              >
                Log in
              </Link>
              <Link
                href="/(auth)/register"
                className="block px-4 py-2 text-base font-medium"
                style={{ color: '#262B40' }}
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
