export interface Meeting {
    id: string;
    title: string;
    createdAt: string;
    duration: number; // in seconds
    status: 'recording' | 'processing' | 'completed' | 'failed';
    audioUrl?: string; // blob URL or base64
    transcript?: {
        text: string;
        utterances?: Array<{
            speaker: string;
            text: string;
            start: number;
            end: number;
        }>;
    };
    summary?: string;
}

const STORAGE_KEY = 'wicara_meetings';

// Get all meetings
export const getMeetings = (): Meeting[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

// Get single meeting by ID
export const getMeeting = (id: string): Meeting | undefined => {
    const meetings = getMeetings();
    return meetings.find(m => m.id === id);
};

// Save a new meeting
export const saveMeeting = (meeting: Omit<Meeting, 'id' | 'createdAt'>): Meeting => {
    const meetings = getMeetings();
    const newMeeting: Meeting = {
        ...meeting,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
    };
    meetings.unshift(newMeeting); // Add to beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
    return newMeeting;
};

// Update an existing meeting
export const updateMeeting = (id: string, updates: Partial<Meeting>): Meeting | undefined => {
    const meetings = getMeetings();
    const index = meetings.findIndex(m => m.id === id);
    if (index === -1) return undefined;

    meetings[index] = { ...meetings[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
    return meetings[index];
};

// Delete a meeting
export const deleteMeeting = (id: string): boolean => {
    const meetings = getMeetings();
    const filtered = meetings.filter(m => m.id !== id);
    if (filtered.length === meetings.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
};

// Search meetings
export const searchMeetings = (query: string): Meeting[] => {
    const meetings = getMeetings();
    const lowerQuery = query.toLowerCase();
    return meetings.filter(m =>
        m.title.toLowerCase().includes(lowerQuery) ||
        m.transcript?.text.toLowerCase().includes(lowerQuery) ||
        m.summary?.toLowerCase().includes(lowerQuery)
    );
};

// Convert audio blob to base64 for storage
export const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

// Convert base64 back to blob
export const base64ToBlob = (base64: string): Blob => {
    const parts = base64.split(',');
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'audio/webm';
    const bstr = atob(parts[1]);
    const arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) {
        arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([arr], { type: mime });
};
