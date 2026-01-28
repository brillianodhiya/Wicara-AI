import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RecordingInterface } from '../components/RecordingInterface';

export const RecordPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSaved = () => {
        navigate('/history');
    };

    return <RecordingInterface onSaved={handleSaved} />;
};
