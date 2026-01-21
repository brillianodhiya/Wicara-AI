import React, { useState } from 'react';
import { Card, List, Tag, Typography, Spin, Alert, Tabs, Button, Input, Space, Select, message } from 'antd';
import { UserOutlined, RobotOutlined, FileTextOutlined, ReloadOutlined } from '@ant-design/icons';
import { useSummary } from '../hooks/useSummary';
import { fetchGeminiModels, type GeminiModel } from '../services/gemini';
import { MarkdownViewer } from './MarkdownViewer';

const { Text } = Typography;

interface TranscriptViewerProps {
    transcript: any;
    isLoading: boolean;
    error: string | null;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({ transcript, isLoading, error }) => {
    const [geminiKey, setGeminiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
    const [models, setModels] = useState<GeminiModel[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>('gemini-2.0-flash');
    const [loadingModels, setLoadingModels] = useState(false);
    const { isSummarizing, summary, error: summaryError, requestSummary } = useSummary();

    const handleFetchModels = async () => {
        if (!geminiKey) {
            message.warning('Masukkan API Key dulu');
            return;
        }
        setLoadingModels(true);
        try {
            const fetchedModels = await fetchGeminiModels(geminiKey);
            setModels(fetchedModels);
            if (fetchedModels.length > 0) {
                // Default to flash model if available
                const flashModel = fetchedModels.find(m => m.name.includes('flash'));
                setSelectedModel(flashModel?.name || fetchedModels[0].name);
            }
            message.success(`${fetchedModels.length} model tersedia`);
        } catch (err: any) {
            message.error('Gagal fetch models: ' + err.message);
        } finally {
            setLoadingModels(false);
        }
    };

    const handleGenerateSummary = () => {
        let textToSummarize = "";
        if (transcript.utterances) {
            textToSummarize = transcript.utterances.map((u: any) => `Speaker ${u.speaker}: ${u.text}`).join('\n');
        } else {
            textToSummarize = transcript.text;
        }
        requestSummary(geminiKey, textToSummarize, selectedModel);
    };

    if (isLoading) {
        return (
            <Card style={{ margin: '20px 0', textAlign: 'center' }}>
                <Spin size="large" tip="Transcribing audio..." />
            </Card>
        );
    }

    if (error) {
        return (
            <Alert message="Transcription Error" description={error} type="error" showIcon style={{ margin: '20px 0' }} />
        );
    }

    if (!transcript) return null;

    const transcriptContent = (
        <>
            <List
                itemLayout="horizontal"
                dataSource={transcript.utterances || []}
                renderItem={(item: any) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Tag icon={<UserOutlined />} color="blue">Speaker {item.speaker}</Tag>}
                            title={<Text type="secondary">{new Date(item.start).toISOString().substr(14, 5)}</Text>}
                            description={<Text>{item.text}</Text>}
                        />
                    </List.Item>
                )}
            />
            {!transcript.utterances && <div style={{ padding: 20 }}><Text>{transcript.text}</Text></div>}
        </>
    );

    const summaryContent = (
        <div style={{ padding: 20 }}>
            {!summary ? (
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Alert message="AI Summary (BYOK)" description="Masukkan API Key Gemini, lalu fetch model yang tersedia." type="info" showIcon />

                    <Space.Compact style={{ width: '100%' }}>
                        <Input.Password
                            placeholder="Enter Google Gemini API Key"
                            value={geminiKey}
                            onChange={e => setGeminiKey(e.target.value)}
                            style={{ width: 'calc(100% - 120px)' }}
                        />
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={handleFetchModels}
                            loading={loadingModels}
                        >
                            Fetch Models
                        </Button>
                    </Space.Compact>

                    {models.length > 0 && (
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Pilih Model"
                            value={selectedModel}
                            onChange={setSelectedModel}
                            options={models.map(m => ({
                                value: m.name,
                                label: `${m.displayName}`
                            }))}
                        />
                    )}

                    <Button
                        type="primary"
                        icon={<RobotOutlined />}
                        onClick={handleGenerateSummary}
                        loading={isSummarizing}
                        disabled={!geminiKey || !selectedModel}
                        block
                    >
                        Generate Meeting Minutes ({selectedModel})
                    </Button>
                    {summaryError && <Alert message="Summary Error" description={summaryError} type="error" showIcon />}
                </Space>
            ) : (
                <MarkdownViewer content={summary} />
            )}
        </div>
    );

    const items = [
        { key: '1', label: <span><FileTextOutlined /> Transcript</span>, children: transcriptContent },
        { key: '2', label: <span><RobotOutlined /> AI Summary</span>, children: summaryContent },
    ];

    return (
        <Card style={{ margin: '20px 0', textAlign: 'left' }}>
            <Tabs defaultActiveKey="1" items={items} />
        </Card>
    );
};
