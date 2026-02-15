import { useState, useRef, useCallback } from 'react';
import { PluginManager } from '../plugins/core/PluginManager';

export interface AudioDevice {
    deviceId: string;
    label: string;
}

export interface UseAudioRecorderReturn {
    isRecording: boolean;
    recordingTime: number;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    audioBlob: Blob | null;
    clearAudio: () => void;
    visualizerData: Uint8Array;
    devices: AudioDevice[];
    selectedDeviceId: string;
    setSelectedDeviceId: (id: string) => void;
    getAudioDevices: () => Promise<void>;
}

export const useAudioRecorder = (): UseAudioRecorderReturn => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [visualizerData, setVisualizerData] = useState<Uint8Array>(new Uint8Array(0));
    
    const [devices, setDevices] = useState<AudioDevice[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<number | null>(null);
    const requestRef = useRef<number | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const getAudioDevices = useCallback(async () => {
        try {
            // Request permission first to get labels
            await navigator.mediaDevices.getUserMedia({ audio: true });
            
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioInputs = devices
                .filter(device => device.kind === 'audioinput')
                .map(device => ({
                    deviceId: device.deviceId,
                    label: device.label || `Microphone ${device.deviceId.slice(0, 5)}...`
                }));
            
            setDevices(audioInputs);
            if (audioInputs.length > 0 && !selectedDeviceId) {
                setSelectedDeviceId(audioInputs[0].deviceId);
            }
        } catch (err) {
            console.error('Error fetching audio devices:', err);
        }
    }, [selectedDeviceId]);

    const startRecording = useCallback(async () => {
        try {
            // Check if any plugin wants to provide the stream (e.g. system audio)
            let stream = await PluginManager.trigger<MediaStream | null>('audio:get-stream', null);

            // Fallback to microphone if no plugin provided stream
            if (!stream) {
                const constraints: MediaStreamConstraints = {
                    audio: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true
                };
                stream = await navigator.mediaDevices.getUserMedia(constraints);
            }

            // Audio Visualizer Setup
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);

            source.connect(analyser);
            analyser.fftSize = 256;

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;
            sourceRef.current = source;
            
            // ... (rest of visualizer setup)

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
                
                // Stop all tracks
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
    }, [selectedDeviceId]);

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
        visualizerData,
        devices,
        selectedDeviceId,
        setSelectedDeviceId,
        getAudioDevices
    };
};
