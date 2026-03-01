import React, { useState, useEffect } from 'react';
import { Select, Typography } from 'antd';
import { CustomerServiceOutlined } from '@ant-design/icons';

const { Text } = Typography;

export type SummaryStyle = 'professional' | 'casual' | 'funny' | 'tegas' | 'friendly';

export const SUMMARY_STYLES = [
    { value: 'professional', label: 'Professional (Default)', isPremium: false },
    { value: 'casual', label: 'Casual & Santai', isPremium: true },
    { value: 'funny', label: 'Funny / Humor', isPremium: true },
    { value: 'tegas', label: 'Tegas & Action-Oriented', isPremium: true },
    { value: 'friendly', label: 'Friendly & Empati', isPremium: true },
];

export const SummaryStyleOptions: React.FC = () => {
    const [selectedStyle, setSelectedStyle] = useState<SummaryStyle>('professional');

    useEffect(() => {
        // Load saved state
        const savedStyle = localStorage.getItem('wicara_summary_style_selection') as SummaryStyle;
        if (savedStyle) setSelectedStyle(savedStyle);
    }, []);

    const handleStyleChange = (value: SummaryStyle) => {
        setSelectedStyle(value);
        localStorage.setItem('wicara_summary_style_selection', value);
    };

    return (
        <div style={{ marginBottom: 16 }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                <CustomerServiceOutlined /> Tone / Gaya Bahasa AI Summary:
            </Text>
            <Select
                value={selectedStyle}
                onChange={handleStyleChange}
                style={{ width: '100%' }}
                options={SUMMARY_STYLES.map(s => ({
                    value: s.value,
                    label: s.label
                }))}
            />
        </div>
    );
};
