import { useState } from "react";

interface Speaker {
  speaker: string;
  start: number;
  end: number;
  text: string;
}

interface TranscriptViewerProps {
  transcript: Speaker[];
  currentTime?: number;
  onSpeakerClick?: (start: number) => void;
}

export default function TranscriptViewer({
  transcript,
  currentTime = 0,
  onSpeakerClick,
}: TranscriptViewerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTranscript = searchQuery
    ? transcript.filter((segment) =>
        segment.text.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : transcript;

  const handleSpeakerClick = (start: number) => {
    if (onSpeakerClick) {
      onSpeakerClick(start);
    }
  };

  const isActive = (segment: Speaker) => {
    return currentTime >= segment.start && currentTime <= segment.end;
  };

  const highlightSearchQuery = (text: string) => {
    if (!searchQuery) return text;

    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search transcript..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {filteredTranscript.length > 0 ? (
          filteredTranscript.map((segment, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                isActive(segment) ? "bg-blue-100" : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => handleSpeakerClick(segment.start)}
            >
              <div className="flex items-center mb-1">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                  {segment.speaker}
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  {formatTime(segment.start)} - {formatTime(segment.end)}
                </span>
              </div>
              <p className="text-gray-800">
                {highlightSearchQuery(segment.text)}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? "No results found" : "No transcript available"}
          </div>
        )}
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}
