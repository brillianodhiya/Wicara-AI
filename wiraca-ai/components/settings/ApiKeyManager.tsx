import React, { useState, useEffect } from "react";
import KeyInput from "./KeyInput";

interface ApiKeyManagerProps {
  service: "assemblyai" | "gemini";
  label: string;
  description?: string;
}

export default function ApiKeyManager({
  service,
  label,
  description
}: ApiKeyManagerProps) {
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState<"not_configured" | "active" | "error">("not_configured");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch API key status on component mount
    fetchKeyStatus();
  }, []);

  const fetchKeyStatus = async () => {
    try {
      const response = await fetch(`/api/keys?service=${service}`);
      const data = await response.json();
      
      if (data.success) {
        setStatus(data.data.status);
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to fetch API key status");
      }
    } catch (error) {
      console.error(`Error fetching ${service} API key status:`, error);
      setStatus("error");
      setMessage("An error occurred while fetching API key status");
    }
  };

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      setMessage("API key cannot be empty");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service,
          apiKey,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("active");
        setMessage(`${label} API key saved successfully`);
        setApiKey(""); // Clear input for security
      } else {
        setStatus("error");
        setMessage(data.message || `Failed to save ${label} API key`);
      }
    } catch (error) {
      console.error(`Error saving ${service} API key:`, error);
      setStatus("error");
      setMessage("An error occurred while saving the API key");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-2">{label} API Key</h2>
      {description && <p className="text-gray-500 mb-4">{description}</p>}
      
      <div className="space-y-4">
        <KeyInput
          value={apiKey}
          onChange={(value) => setApiKey(value)}
          placeholder={`Enter your ${label} API key`}
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <div className="flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                status === "active"
                  ? "bg-green-500"
                  : status === "error"
                  ? "bg-red-500"
                  : "bg-gray-400"
              }`}
            ></span>
            <span>
              {status === "active"
                ? "Configured"
                : status === "error"
                ? "Error"
                : "Not configured"}
            </span>
          </div>
        </div>
        
        {message && (
          <div
            className={`text-sm ${
              status === "active" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}
        
        <button
          onClick={handleSaveKey}
          disabled={isLoading}
          className={`w-full px-4 py-2 rounded text-white ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Saving..." : "Save API Key"}
        </button>
        
        <p className="text-xs text-gray-500">
          Your API key is encrypted and stored securely using AES-GCM encryption
        </p>
      </div>
    </div>
  );
}
