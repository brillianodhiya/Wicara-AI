import { useRef, useState } from "react";

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
}

export default function AudioRecorder({
  onRecordingComplete,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        onRecordingComplete(audioBlob);

        // Stop all tracks to release the microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      console.error("Error accessing microphone. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-100 w-full h-24 rounded-lg mb-4 flex items-center justify-center">
        {isRecording ? (
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-red-600 rounded-full animate-pulse mr-2"></span>
              <span className="text-red-600 font-medium">Recording</span>
            </div>
            <span className="text-2xl font-bold mt-2">
              {formatTime(recordingTime)}
            </span>
          </div>
        ) : (
          <span className="text-gray-500">Ready to record</span>
        )}
      </div>

      <div className="flex space-x-4">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            className="bg-blue-600 text-white px-6 py-2 rounded-full flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <circle cx="10" cy="10" r="6" />
            </svg>
            Start Recording
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="bg-red-600 text-white px-6 py-2 rounded-full flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <rect x="6" y="6" width="8" height="8" />
            </svg>
            Stop Recording
          </button>
        )}
      </div>
    </div>
  );
}
