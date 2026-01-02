import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold">Wicara AI</h3>
            <p className="mt-2 text-gray-400">
              Your meeting assistant with data sovereignty
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
              Product
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/features" className="text-base text-gray-400 hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-base text-gray-400 hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/plugins" className="text-base text-gray-400 hover:text-white">
                  Plugins
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
              Resources
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/docs" className="text-base text-gray-400 hover:text-white">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-base text-gray-400 hover:text-white">
                  API
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-base text-gray-400 hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/about" className="text-base text-gray-400 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-base text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-base text-gray-400 hover:text-white">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-base text-gray-400 hover:text-white">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Wicara AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
