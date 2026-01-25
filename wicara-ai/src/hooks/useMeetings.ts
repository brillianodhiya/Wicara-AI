import { useState, useEffect, useCallback } from 'react';
import {
    getMeetings,
    saveMeeting,
    updateMeeting,
    deleteMeeting,
    searchMeetings,
    type Meeting
} from '../services/meetings';

export const useMeetings = () => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Load meetings on mount
    useEffect(() => {
        loadMeetings();
    }, []);

    const loadMeetings = useCallback(() => {
        setLoading(true);
        const data = searchQuery ? searchMeetings(searchQuery) : getMeetings();
        setMeetings(data);
        setLoading(false);
    }, [searchQuery]);

    // Reload when search query changes
    useEffect(() => {
        loadMeetings();
    }, [loadMeetings]);

    const addMeeting = useCallback((meeting: Omit<Meeting, 'id' | 'createdAt'>) => {
        const newMeeting = saveMeeting(meeting);
        setMeetings(prev => [newMeeting, ...prev]);
        return newMeeting;
    }, []);

    const editMeeting = useCallback((id: string, updates: Partial<Meeting>) => {
        const updated = updateMeeting(id, updates);
        if (updated) {
            setMeetings(prev => prev.map(m => m.id === id ? updated : m));
        }
        return updated;
    }, []);

    const removeMeeting = useCallback((id: string) => {
        const success = deleteMeeting(id);
        if (success) {
            setMeetings(prev => prev.filter(m => m.id !== id));
        }
        return success;
    }, []);

    const search = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    return {
        meetings,
        loading,
        searchQuery,
        addMeeting,
        editMeeting,
        removeMeeting,
        search,
        reload: loadMeetings
    };
};
