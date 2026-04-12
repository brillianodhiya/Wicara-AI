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
    language?: 'id' | 'en';
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

            const language = config.language || 'id';
            
            const defaultPromptId = `Anda adalah asisten AI untuk notulensi rapat.
Berdasarkan transkrip berikut, tolong buatkan ringkasan terstruktur yang mencakup:
1. **Ringkasan Eksekutif**: Paragraf singkat yang merangkum keseluruhan sesi.
2. **Poin-Poin Utama**: Poin-poin dari topik utama yang dibahas.
3. **Tindakan Lanjutan**: Siapa perlu melakukan apa (jika disebutkan).
Harap tulis seluruh ringkasan dalam Bahasa Indonesia yang baik dan benar.

TRANSKRIP:
${transcriptText}`;

            const defaultPromptEn = `You are an AI assistant for meeting minutes.
Based on the following transcript, please generate a structured summary including:
1. **Executive Summary**: A concise paragraph relative to the content.
2. **Key Discussion Points**: Bullet points of main topics.
3. **Action Items**: Who needs to do what (if mentioned).
Please write the entire summary in English.

TRANSCRIPT:
${transcriptText}`;

            const basePrompt = language === 'id' ? defaultPromptId : defaultPromptEn;

            // 1. Process prompt through plugins
            const hookData = await PluginManager.trigger('summary:prompt', {
                transcriptText,
                prompt: basePrompt,
                language
            });
            const finalPrompt = hookData.prompt || basePrompt;

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
