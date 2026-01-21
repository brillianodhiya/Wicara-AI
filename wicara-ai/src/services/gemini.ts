import { GoogleGenerativeAI } from "@google/generative-ai";

export interface GeminiModel {
    name: string;
    displayName: string;
    description: string;
}

// Fetch available models from Gemini API
export const fetchGeminiModels = async (apiKey: string): Promise<GeminiModel[]> => {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch models: ${response.statusText}`);
        }

        const data = await response.json();

        // Filter to only include models that support generateContent
        const generativeModels = data.models
            .filter((model: any) =>
                model.supportedGenerationMethods?.includes('generateContent') &&
                model.name.includes('gemini')
            )
            .map((model: any) => ({
                name: model.name.replace('models/', ''),
                displayName: model.displayName || model.name.replace('models/', ''),
                description: model.description || ''
            }));

        return generativeModels;
    } catch (error) {
        console.error("Failed to fetch Gemini models:", error);
        throw error;
    }
};

// Generate summary using specified model
export const generateMeetingSummary = async (
    apiKey: string,
    transcriptText: string,
    modelName: string = "gemini-2.0-flash"
) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `
    You are an AI assistant for meeting minutes.
    Based on the following transcript, please generate a structured summary including:
    1. **Executive Summary**: A concise paragraph relative to the content.
    2. **Key Discussion Points**: Bullet points of main topics.
    3. **Action Items**: Who needs to do what (if mentioned).
    
    TRANSCRIPT:
    ${transcriptText}
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Summary Failed:", error);
        throw error;
    }
};
