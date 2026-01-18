import { useState, useRef, useCallback } from 'react';

export interface UseAudioRecorderReturn {
    isRecording: boolean;
    recordingTime: number;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    audioBlob: Blob | null;
    clearAudio: () => void;
    visualizerData: Uint8Array;
}

export const useAudioRecorder = (): UseAudioRecorderReturn => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [visualizerData, setVisualizerData] = useState<Uint8Array>(new Uint8Array(0));

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<number | null>(null);
    const requestRef = useRef<number | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Audio Visualizer Setup
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);

            source.connect(analyser);
            analyser.fftSize = 256;

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;
            sourceRef.current = source;

            // Update Visualizer
            const updateVisualizer = () => {
                if (!analyserRef.current) return;
                const bufferLength = analyserRef.current.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                analyserRef.current.getByteFrequencyData(dataArray);
                setVisualizerData(dataArray);
                requestRef.current = requestAnimationFrame(updateVisualizer);
            };
            updateVisualizer();

            // Recorder Setup
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                chunksRef.current = [];

                // Cleanup Audio Context
                if (requestRef.current) cancelAnimationFrame(requestRef.current);
                if (audioContextRef.current) audioContextRef.current.close();

                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);

            // Timer
            setRecordingTime(0);
            timerRef.current = window.setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    }, [isRecording]);

    const clearAudio = useCallback(() => {
        setAudioBlob(null);
        setRecordingTime(0);
        setVisualizerData(new Uint8Array(0));
    }, []);

    return {
        isRecording,
        recordingTime,
        startRecording,
        stopRecording,
        audioBlob,
        clearAudio,
        visualizerData
    };
};
