import React from "react";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Dashboard utama Wicara AI</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Recent Meetings</h2>
          <p className="text-gray-500 mt-2">No meetings yet</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">API Usage</h2>
          <p className="text-gray-500 mt-2">BYOK enabled</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded mt-2 w-full">
            New Recording
          </button>
        </div>
      </div>
    </div>
  );
}
