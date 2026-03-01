import type { PluginDefinition } from '../core/types';
import { SummaryStyleOptions, type SummaryStyle } from './SummaryStyleOptions';

export const SummaryStylePlugin: PluginDefinition = {
    meta: {
        id: 'summary-style',
        name: 'AI Summary Tone & Style',
        version: '1.0.0',
        author: 'Wicara AI',
        description: 'Pilih gaya bahasa AI Summary (Professional, Casual, Funny, dll). Termasuk simulasi premium freemium model.',
        icon: '🎭',
        category: 'ai',
        price: 50000 // Rp 50.000
    },
    hooks: {
        'summary:prompt': (data: unknown) => {
            const hookData = data as { transcriptText: string, prompt: string | null };
            const savedStyle = localStorage.getItem('wicara_summary_style_selection') as SummaryStyle || 'professional';
            
            let toneInstruction = '';
            
            switch (savedStyle) {
                case 'casual':
                    toneInstruction = 'Gunakan gaya bahasa santai, kasual, relevan untuk anak muda (Gen Z/Millenial), tanpa mengurangi esensi isi percakapan.';
                    break;
                case 'funny':
                    toneInstruction = 'Gunakan gaya bahasa yang lucu, humoris, sedikit sarkas jika cocok, namun tetap menyampaikan pesannya. Hindari bahasa yang terlalu formal.';
                    break;
                case 'tegas':
                    toneInstruction = 'Gunakan gaya bahasa yang sangat ringkas, tegas, to the point, dan sangat berorientasi pada action items. Tidak ada basa-basi.';
                    break;
                case 'friendly':
                    toneInstruction = 'Gunakan gaya bahasa yang ramah, hangat, dan penuh empati, seperti seorang teman yang baik sedang memberikan ringkasan.';
                    break;
                case 'professional':
                default:
                    // Return the data unchanged to use the default service prompt
                    return data;
            }

            // Override the prompt with the selected tone
            hookData.prompt = `You are an AI assistant for meeting minutes.
${toneInstruction}

Based on the following transcript, please generate a structured summary including:
1. **Executive Summary**: A concise paragraph relative to the content.
2. **Key Discussion Points**: Bullet points of main topics.
3. **Action Items**: Who needs to do what (if mentioned).

TRANSCRIPT:
${hookData.transcriptText}`;

            return hookData;
        }
    },
    slots: {
        'summary-options': SummaryStyleOptions
    }
};
