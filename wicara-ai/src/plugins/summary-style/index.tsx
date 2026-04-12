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
            const hookData = data as { transcriptText: string, prompt: string | null, language?: 'id' | 'en' };
            const savedStyle = localStorage.getItem('wicara_summary_style_selection') as SummaryStyle || 'professional';
            
            let toneInstruction = '';
            
            switch (savedStyle) {
                case 'casual':
                    toneInstruction = hookData.language === 'en' 
                        ? 'Use a casual, relaxed tone relevant for youth (Gen Z/Millenial), without losing the essence of the conversation.'
                        : 'Gunakan gaya bahasa santai, kasual, relevan untuk anak muda (Gen Z/Millenial), tanpa mengurangi esensi isi percakapan.';
                    break;
                case 'funny':
                    toneInstruction = hookData.language === 'en'
                        ? 'Use a funny, humorous tone, slightly sarcastic if appropriate, but still convey the message. Avoid overly formal language.'
                        : 'Gunakan gaya bahasa yang lucu, humoris, sedikit sarkas jika cocok, namun tetap menyampaikan pesannya. Hindari bahasa yang terlalu formal.';
                    break;
                case 'tegas':
                    toneInstruction = hookData.language === 'en'
                        ? 'Use a very concise, firm, to the point tone, highly oriented towards action items. No fluff.'
                        : 'Gunakan gaya bahasa yang sangat ringkas, tegas, to the point, dan sangat berorientasi pada action items. Tidak ada basa-basi.';
                    break;
                case 'friendly':
                    toneInstruction = hookData.language === 'en'
                        ? 'Use a friendly, warm, and empathetic tone, like a good friend giving a summary.'
                        : 'Gunakan gaya bahasa yang ramah, hangat, dan penuh empati, seperti seorang teman yang baik sedang memberikan ringkasan.';
                    break;
                case 'professional':
                default:
                    return data;
            }

            // Override the prompt with the selected tone prefixed to the base prompt
            if (hookData.prompt) {
                hookData.prompt = `[STYLE GUIDELINE: ${toneInstruction}]\n\n${hookData.prompt}`;
            }

            return hookData;
        }
    },
    slots: {
        'summary-options': SummaryStyleOptions
    }
};
