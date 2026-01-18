export default function PreferencesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">User Preferences</h1>
      <p className="text-gray-500 mb-6">Customize your Wicara AI experience</p>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">General Settings</h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Language
            </label>
            <select
              id="language"
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="theme"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Theme
            </label>
            <select
              id="theme"
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoSave"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label
              htmlFor="autoSave"
              className="ml-2 block text-sm text-gray-700"
            >
              Auto-save recordings
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Transcription Settings</h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="transcription-language"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Default Language for Transcription
            </label>
            <select
              id="transcription-language"
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="speakerDiarization"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              defaultChecked
            />
            <label
              htmlFor="speakerDiarization"
              className="ml-2 block text-sm text-gray-700"
            >
              Enable speaker diarization
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Privacy Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="localProcessing"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              defaultChecked
            />
            <label
              htmlFor="localProcessing"
              className="ml-2 block text-sm text-gray-700"
            >
              Prioritize local processing when possible
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoDelete"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label
              htmlFor="autoDelete"
              className="ml-2 block text-sm text-gray-700"
            >
              Auto-delete recordings after 30 days
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
