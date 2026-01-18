import type React from "react";
import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  audioUrl: string;
  onTimeUpdate?: (currentTime: number) => void;
}

export default function AudioPlayer({
  audioUrl,
  onTimeUpdate,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      const time = audio.currentTime;
      setCurrentTime(time);
      if (onTimeUpdate) onTimeUpdate(time);
    };

    // Add event listeners
    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);

    // Cleanup
    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
    };
  }, [onTimeUpdate]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
    if (onTimeUpdate) onTimeUpdate(time);
  };

  const formatTime = (seconds: number) => {
    if (Number.isNaN(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="flex items-center space-x-4 mb-2">
        <button
          type="button"
          onClick={togglePlayPause}
          className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center"
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <rect x="6" y="5" width="3" height="10" />
              <rect x="11" y="5" width="3" height="10" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7 4v12l8-6-8-6z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        <div className="text-sm font-medium">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      <input
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={handleSeek}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
}
