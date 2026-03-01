import { useState, useEffect } from 'react';

export interface SavedApiKeys {
    assemblyai: string;
    gemini: string;
    ollamaCloud: string;
    ollamaEndpoint: string;
    elevenlabs: string;
    voiceProvider: string;
    llmProvider: string;
}

const STORAGE_KEY = 'wicara_api_keys';

const defaultKeys: SavedApiKeys = {
    assemblyai: '',
    gemini: '',
    ollamaCloud: '',
    ollamaEndpoint: 'http://localhost:11434',
    elevenlabs: '',
    voiceProvider: 'assemblyai',
    llmProvider: 'gemini',
};

export const useApiKeys = () => {
    const [keys, setKeys] = useState<SavedApiKeys>(defaultKeys);
    const [loaded, setLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setKeys({ ...defaultKeys, ...parsed });
            } catch (e) {
                console.error('Failed to parse saved API keys');
            }
        }
        setLoaded(true);
    }, []);

    // Save to localStorage
    const saveKeys = (newKeys: Partial<SavedApiKeys>) => {
        const updated = { ...keys, ...newKeys };
        setKeys(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    // Clear all keys
    const clearKeys = () => {
        setKeys(defaultKeys);
        localStorage.removeItem(STORAGE_KEY);
    };

    return {
        keys,
        loaded,
        saveKeys,
        clearKeys
    };
};
