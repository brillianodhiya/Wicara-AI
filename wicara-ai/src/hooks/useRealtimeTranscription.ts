import { useState, useRef, useCallback } from 'react';
import { message } from 'antd';

export interface RealtimeTranscriptionResult {
  text: string;
  isPartial: boolean; // True if this chunk is just a part of an ongoing sentence
}

export function useRealtimeTranscription() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const workerUrlRef = useRef<string>('');
  const intervalRef = useRef<number | null>(null);

  // Keep track of processing queue to not overwhelm the worker
  const isProcessingRef = useRef(false);
  const chunkQueueRef = useRef<Blob[]>([]);

  // Function to capture a short slice of audio
  const recordChunk = useCallback(() => {
    if (!stream.current) return;
    
    const options = { mimeType: 'audio/webm' };
    const recorder = new MediaRecorder(stream.current, options);
    const localChunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        localChunks.push(e.data);
      }
    };

    recorder.onstop = () => {
      const audioBlob = new Blob(localChunks, { type: 'audio/webm' });
      if (audioBlob.size > 0) {
        chunkQueueRef.current.push(audioBlob);
        processNextChunk();
      }
    };

    recorder.start();
    mediaRecorder.current = recorder;

    // Stop after 3.5 seconds to complete this chunk
    setTimeout(() => {
      if (recorder.state === 'recording') {
        recorder.stop();
      }
    }, 3500);
  }, []);

  const startRecording = useCallback(async (workerUrl: string) => {
    if (!workerUrl) {
      message.error("Please configure your Cloudflare Worker URL first.");
      return;
    }

    try {
      setIsConnecting(true);
      workerUrlRef.current = workerUrl;
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = mediaStream;

      // Start the chunking loop
      recordChunk(); // Start first chunk immediately
      intervalRef.current = window.setInterval(() => {
        recordChunk();
      }, 3600); // slightly longer than the internal timeout to prevent overlap issues
      
      setTranscripts([]);
      setIsRecording(true);
    } catch (err: any) {
      message.error(`Microphone access failed: ${err.message}`);
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  }, [recordChunk]);

  const processNextChunk = async () => {
    if (isProcessingRef.current || chunkQueueRef.current.length === 0) return;

    isProcessingRef.current = true;
    const chunk = chunkQueueRef.current.shift()!;

    try {
      const formData = new FormData();
      // Whisper usually expects wav/mp3/m4a/webm. We send webm buffer
      formData.append('audio', chunk, 'chunk.webm');

      const response = await fetch(workerUrlRef.current, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Worker returned ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.text && result.text.trim() !== '') {
        setTranscripts(prev => [...prev, result.text.trim()]);
      }
    } catch (error) {
      console.error('Failed to transcribe chunk:', error);
      // We don't spam errors to the UI for every chunk, just log it.
      // Often chunks with pure silence or noise might fail model assumptions.
    } finally {
      isProcessingRef.current = false;
      // Process next if queued
      if (chunkQueueRef.current.length > 0) {
        processNextChunk();
      }
    }
  };

  const stopRecording = useCallback(() => {
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }
    
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
    }
    if (stream.current) {
      stream.current.getTracks().forEach(track => track.stop());
    }
    
    setIsRecording(false);
    // Let the remaining chunks process...
  }, []);

  return {
    isRecording,
    isConnecting,
    transcripts,
    startRecording,
    stopRecording,
    fullText: transcripts.join(' ')
  };
}
