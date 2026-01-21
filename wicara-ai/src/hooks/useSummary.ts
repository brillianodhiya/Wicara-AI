import { useState } from 'react';
import { generateMeetingSummary } from '../services/gemini';

export const useSummary = () => {
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summary, setSummary] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const requestSummary = async (apiKey: string, transcriptText: string, modelName?: string) => {
        setIsSummarizing(true);
        setError(null);
        try {
            if (!transcriptText || transcriptText.trim().length === 0) {
                throw new Error("Transcript is empty. Please transcribe audio first.");
            }
            const result = await generateMeetingSummary(apiKey, transcriptText, modelName);
            setSummary(result);
        } catch (err: any) {
            setError(err.message || 'Summary generation failed');
        } finally {
            setIsSummarizing(false);
        }
    };

    return {
        isSummarizing,
        summary,
        error,
        requestSummary
    };
};
