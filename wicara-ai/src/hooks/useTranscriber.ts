import { useState } from 'react';
import { transcribeAudio } from '../services/assemblyAI';
import { AssemblyAI } from 'assemblyai'; // Import type

export const useTranscriber = () => {
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcript, setTranscript] = useState<any | null>(null); // Use any for MVP simplicity or import Transcript type
    const [error, setError] = useState<string | null>(null);

    const startTranscription = async (apiKey: string, audioBlob: Blob) => {
        setIsTranscribing(true);
        setError(null);
        try {
            const result = await transcribeAudio(apiKey, audioBlob);
            setTranscript(result);
        } catch (err: any) {
            setError(err.message || 'Transcription failed');
        } finally {
            setIsTranscribing(false);
        }
    };

    return {
        isTranscribing,
        transcript,
        error,
        startTranscription
    };
};
