import React from "react";

export default function MeetingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Meetings</h1>
      <p>Daftar semua meetings yang telah direkam</p>
      
      <div className="mt-6">
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-semibold">No meetings yet</h2>
          <p className="text-gray-500 mt-2">
            Start recording your first meeting to see it here
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
            New Recording
          </button>
        </div>
      </div>
    </div>
  );
}
