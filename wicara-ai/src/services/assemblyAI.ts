import { AssemblyAI } from 'assemblyai';

export const transcribeAudio = async (apiKey: string, audioBlob: Blob) => {
    const client = new AssemblyAI({
        apiKey: apiKey,
    });

    // Convert Blob to File
    const audioFile = new File([audioBlob], "recording.webm", { type: 'audio/webm' });

    try {
        const transcript = await client.transcripts.transcribe({
            audio: audioFile,
            speaker_labels: true,
            language_code: 'id', // Default to Indonesian for this MVP
        });

        return transcript;
    } catch (error) {
        console.error("Transcription failed:", error);
        throw error;
    }
};
