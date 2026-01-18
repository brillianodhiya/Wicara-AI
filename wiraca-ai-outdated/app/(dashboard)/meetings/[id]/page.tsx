interface MeetingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MeetingDetailPage({ params }: MeetingPageProps) {
  const { id } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Meeting Detail</h1>
      <p className="text-gray-500 mb-6">Meeting ID: {id}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-2">Audio Player</h2>
            <div className="bg-gray-100 h-24 rounded flex items-center justify-center">
              <p className="text-gray-500">
                Audio player will be displayed here
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Transcript</h2>
            <div className="bg-gray-100 min-h-[300px] rounded p-4">
              <p className="text-gray-500">Transcript will be displayed here</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-2">Meeting Info</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Date:</span> -
              </p>
              <p>
                <span className="font-medium">Duration:</span> -
              </p>
              <p>
                <span className="font-medium">Speakers:</span> -
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Creative Output</h2>
            <div className="space-y-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
                Generate Summary
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
                Extract Action Items
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
                Create Email Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
