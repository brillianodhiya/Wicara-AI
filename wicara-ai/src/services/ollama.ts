export interface OllamaModel {
    name: string;
    modified_at: string;
    size: number;
}

export interface OllamaConfig {
    endpoint: string;
    model: string;
    apiKey?: string; // For Ollama Cloud
}

const DEFAULT_LOCAL_ENDPOINT = 'http://localhost:11434';
const OLLAMA_CLOUD_ENDPOINT = 'https://api.ollama.com'; // Ollama Cloud API

// Fetch available models from Ollama (local or cloud)
export const fetchOllamaModels = async (
    endpoint: string = DEFAULT_LOCAL_ENDPOINT,
    apiKey?: string
): Promise<OllamaModel[]> => {
    try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (apiKey) {
            headers['Authorization'] = `Bearer ${apiKey}`;
        }

        const response = await fetch(`${endpoint}/api/tags`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch models: ${response.statusText}`);
        }

        const data = await response.json();
        return data.models || [];
    } catch (error) {
        console.error("Failed to fetch Ollama models:", error);
        throw error;
    }
};

// Generate summary using Ollama
export const generateOllamaSummary = async (
    transcriptText: string,
    config: OllamaConfig
): Promise<string> => {
    const { endpoint = DEFAULT_LOCAL_ENDPOINT, model, apiKey } = config;

    const prompt = `You are an AI assistant for meeting minutes.
Based on the following transcript, please generate a structured summary including:
1. **Executive Summary**: A concise paragraph relative to the content.
2. **Key Discussion Points**: Bullet points of main topics.
3. **Action Items**: Who needs to do what (if mentioned).

TRANSCRIPT:
${transcriptText}`;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
    }

    try {
        const response = await fetch(`${endpoint}/api/generate`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model,
                prompt,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama request failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("Ollama Summary Failed:", error);
        throw error;
    }
};

// Check if Ollama is running locally
export const checkOllamaHealth = async (
    endpoint: string = DEFAULT_LOCAL_ENDPOINT,
    apiKey?: string
): Promise<boolean> => {
    try {
        const headers: Record<string, string> = {};
        if (apiKey) {
            headers['Authorization'] = `Bearer ${apiKey}`;
        }

        const response = await fetch(`${endpoint}/api/tags`, {
            method: 'GET',
            headers,
            signal: AbortSignal.timeout(3000),
        });
        return response.ok;
    } catch {
        return false;
    }
};

export const OLLAMA_CLOUD_DEFAULT_ENDPOINT = OLLAMA_CLOUD_ENDPOINT;
export const OLLAMA_LOCAL_DEFAULT_ENDPOINT = DEFAULT_LOCAL_ENDPOINT;
