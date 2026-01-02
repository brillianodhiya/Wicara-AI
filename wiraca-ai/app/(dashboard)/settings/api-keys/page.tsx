import React from "react";

export default function ApiKeysPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">API Keys Management (BYOK)</h1>
      <p className="text-gray-500 mb-6">
        Manage your AssemblyAI and Gemini API keys for unlimited usage
      </p>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">AssemblyAI API Key</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <div className="flex">
              <input
                type="password"
                className="flex-1 border border-gray-300 rounded-l px-3 py-2"
                placeholder="Enter your AssemblyAI API key"
              />
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-r">
                Show
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Your API key is encrypted and stored securely
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
              <span>Not configured</span>
            </div>
          </div>
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Save API Key
          </button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Gemini API Key</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <div className="flex">
              <input
                type="password"
                className="flex-1 border border-gray-300 rounded-l px-3 py-2"
                placeholder="Enter your Gemini API key"
              />
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-r">
                Show
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Your API key is encrypted and stored securely
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
              <span>Not configured</span>
            </div>
          </div>
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Save API Key
          </button>
        </div>
      </div>
    </div>
  );
}
