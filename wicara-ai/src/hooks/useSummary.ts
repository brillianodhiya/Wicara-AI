import { useState } from 'react';
import { generateMeetingSummary } from '../services/gemini';
import { generateOllamaSummary, type OllamaConfig } from '../services/ollama';
import { PluginManager } from '../plugins/core';

export type AIProvider = 'gemini' | 'ollama';

interface SummaryConfig {
    provider: AIProvider;
    geminiApiKey?: string;
    geminiModel?: string;
    ollamaConfig?: OllamaConfig;
}

export const useSummary = () => {
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summary, setSummary] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const requestSummary = async (transcriptText: string, config: SummaryConfig) => {
        setIsSummarizing(true);
        setError(null);

        try {
            if (!transcriptText || transcriptText.trim().length === 0) {
                throw new Error("Transcript is empty. Please transcribe audio first.");
            }

            // 1. Process prompt through plugins
            const hookData = await PluginManager.trigger('summary:prompt', {
                transcriptText,
                prompt: null as string | null
            });
            const finalPrompt = hookData.prompt || undefined;

            let result: string;

            if (config.provider === 'gemini') {
                if (!config.geminiApiKey) {
                    throw new Error("Gemini API Key is required");
                }
                result = await generateMeetingSummary(
                    config.geminiApiKey,
                    transcriptText,
                    config.geminiModel,
                    finalPrompt
                );
            } else if (config.provider === 'ollama') {
                if (!config.ollamaConfig?.model) {
                    throw new Error("Ollama model is required");
                }
                result = await generateOllamaSummary(transcriptText, config.ollamaConfig, finalPrompt);
            } else {
                throw new Error("Invalid AI provider");
            }

            setSummary(result);
        } catch (err: any) {
            setError(err.message || 'Summary generation failed');
        } finally {
            setIsSummarizing(false);
        }
    };

    const clearSummary = () => {
        setSummary(null);
        setError(null);
    };

    return {
        isSummarizing,
        summary,
        error,
        requestSummary,
        clearSummary
    };
};
