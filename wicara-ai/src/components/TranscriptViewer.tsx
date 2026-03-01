import React, { useState, useEffect } from 'react';
import { Card, List, Tag, Typography, Spin, Alert, Tabs, Button, Input, Space, Select, message, Segmented, Badge } from 'antd';
import { UserOutlined, RobotOutlined, FileTextOutlined, ReloadOutlined, CloudOutlined, DesktopOutlined, ApiOutlined } from '@ant-design/icons';
import { useSummary } from '../hooks/useSummary';
import { useApiKeys } from '../hooks/useApiKeys';
import { fetchGeminiModels, type GeminiModel } from '../services/gemini';
import { fetchOllamaModels, checkOllamaHealth, type OllamaModel, OLLAMA_LOCAL_DEFAULT_ENDPOINT, OLLAMA_CLOUD_DEFAULT_ENDPOINT } from '../services/ollama';
import { MarkdownViewer } from './MarkdownViewer';
import { PluginSlot } from '../plugins/core';

const { Text } = Typography;

type ProviderOption = 'gemini' | 'ollama-local' | 'ollama-cloud';

export interface TranscriptSession {
    sessionIndex: number;
    transcript: any;
}

interface TranscriptViewerProps {
    transcript: any;
    isLoading: boolean;
    error: string | null;
    onSummaryGenerated?: (summary: string) => void;
    mode?: 'tabs' | 'transcript-only' | 'summary-only';
    sessions?: TranscriptSession[];
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({ transcript, isLoading, error, onSummaryGenerated, mode = 'tabs', sessions }) => {
    const { keys, loaded } = useApiKeys();

    // Provider selection
    const [provider, setProvider] = useState<ProviderOption>('gemini');

    // Gemini state
    const [geminiKey, setGeminiKey] = useState('');
    const [geminiModels, setGeminiModels] = useState<GeminiModel[]>([]);
    const [selectedGeminiModel, setSelectedGeminiModel] = useState<string>('gemini-2.0-flash');

    // Ollama state
    const [ollamaEndpoint, setOllamaEndpoint] = useState(OLLAMA_LOCAL_DEFAULT_ENDPOINT);
    const [ollamaApiKey, setOllamaApiKey] = useState('');
    const [ollamaModels, setOllamaModels] = useState<OllamaModel[]>([]);
    const [selectedOllamaModel, setSelectedOllamaModel] = useState<string>('');
    const [ollamaOnline, setOllamaOnline] = useState<boolean | null>(null);

    const [loadingModels, setLoadingModels] = useState(false);
    const { isSummarizing, summary, error: summaryError, requestSummary, clearSummary } = useSummary();

    // Notify parent when summary is generated
    useEffect(() => {
        if (summary && onSummaryGenerated) {
            onSummaryGenerated(summary);
        }
    }, [summary, onSummaryGenerated]);

    // Load saved keys and provider selection when hook is ready
    useEffect(() => {
        if (loaded) {
            setGeminiKey(keys.gemini || import.meta.env.VITE_GEMINI_API_KEY || '');
            setOllamaApiKey(keys.ollamaCloud || '');
            setOllamaEndpoint(keys.ollamaEndpoint || OLLAMA_LOCAL_DEFAULT_ENDPOINT);

            // Restore saved LLM provider from Settings
            if (keys.llmProvider) {
                setProvider(keys.llmProvider as ProviderOption);
            }
        }
    }, [loaded, keys]);

    // Auto-fetch models when provider and credentials are ready
    useEffect(() => {
        if (!loaded) return;

        if (provider === 'gemini' && geminiKey && geminiModels.length === 0) {
            handleFetchGeminiModels();
        } else if ((provider === 'ollama-local' || provider === 'ollama-cloud') && ollamaModels.length === 0) {
            handleFetchOllamaModels();
        }
    }, [loaded, provider, geminiKey]);

    // Update endpoint based on provider
    useEffect(() => {
        if (provider === 'ollama-cloud') {
            setOllamaEndpoint(OLLAMA_CLOUD_DEFAULT_ENDPOINT);
        } else if (provider === 'ollama-local') {
            setOllamaEndpoint(keys.ollamaEndpoint || OLLAMA_LOCAL_DEFAULT_ENDPOINT);
        }
    }, [provider, keys.ollamaEndpoint]);

    // Check Ollama health when provider changes
    useEffect(() => {
        if (provider === 'ollama-local' || provider === 'ollama-cloud') {
            const apiKey = provider === 'ollama-cloud' ? ollamaApiKey : undefined;
            checkOllamaHealth(ollamaEndpoint, apiKey).then(setOllamaOnline);
        }
    }, [provider, ollamaEndpoint, ollamaApiKey]);

    const handleFetchGeminiModels = async () => {
        if (!geminiKey) {
            message.warning('Masukkan API Key dulu');
            return;
        }
        setLoadingModels(true);
        try {
            const fetchedModels = await fetchGeminiModels(geminiKey);
            setGeminiModels(fetchedModels);
            if (fetchedModels.length > 0) {
                const flashModel = fetchedModels.find(m => m.name.includes('flash'));
                setSelectedGeminiModel(flashModel?.name || fetchedModels[0].name);
            }
            message.success(`${fetchedModels.length} Gemini model tersedia`);
        } catch (err: any) {
            message.error('Gagal fetch Gemini models: ' + err.message);
        } finally {
            setLoadingModels(false);
        }
    };

    const handleFetchOllamaModels = async () => {
        setLoadingModels(true);
        try {
            const apiKey = provider === 'ollama-cloud' ? ollamaApiKey : undefined;
            const fetchedModels = await fetchOllamaModels(ollamaEndpoint, apiKey);
            setOllamaModels(fetchedModels);
            if (fetchedModels.length > 0) {
                setSelectedOllamaModel(fetchedModels[0].name);
            }
            setOllamaOnline(true);
            message.success(`${fetchedModels.length} Ollama model tersedia`);
        } catch (err: any) {
            setOllamaOnline(false);
            message.error('Gagal fetch Ollama models: ' + err.message);
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

        if (provider === 'gemini') {
            requestSummary(textToSummarize, {
                provider: 'gemini',
                geminiApiKey: geminiKey,
                geminiModel: selectedGeminiModel
            });
        } else {
            const apiKey = provider === 'ollama-cloud' ? ollamaApiKey : undefined;
            requestSummary(textToSummarize, {
                provider: 'ollama',
                ollamaConfig: {
                    endpoint: ollamaEndpoint,
                    model: selectedOllamaModel,
                    apiKey
                }
            });
        }
    };

    if (isLoading) {
        return (
            <Card style={{ textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spin size="large" />
            </Card>
        );
    }

    if (error) {
        return (
            <Card style={{ height: '100%' }}>
                <Alert message="Transcription Error" description={error} type="error" showIcon />
            </Card>
        );
    }

    if (!transcript) {
        return (
            <Card style={{ height: '100%' }}>
                <Tabs
                    defaultActiveKey="1"
                    items={[
                        {
                            key: '1',
                            label: <span><FileTextOutlined /> Transcript</span>,
                            children: (
                                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
                                    <FileTextOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }} />
                                    <div>Belum ada transcript</div>
                                    <Text type="secondary">Rekam audio lalu klik "Transcribe Now"</Text>
                                </div>
                            )
                        },
                        {
                            key: '2',
                            label: <span><RobotOutlined /> AI Summary</span>,
                            children: (
                                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
                                    <RobotOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }} />
                                    <div>Belum ada summary</div>
                                    <Text type="secondary">Generate setelah transcript tersedia</Text>
                                </div>
                            )
                        }
                    ]}
                />
            </Card>
        );
    }

    const renderSingleTranscript = (t: any) => (
        <>
            <List
                itemLayout="horizontal"
                dataSource={t.utterances || []}
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
            {!t.utterances && <div style={{ padding: 20 }}><Text>{t.text}</Text></div>}
        </>
    );

    const transcriptContent = (
        <div>
            {sessions && sessions.length > 1 ? (
                sessions.map((session) => (
                    <div key={session.sessionIndex} style={{ marginBottom: 16 }}>
                        <div style={{ 
                            padding: '8px 12px', 
                            background: '#e6f4ff', 
                            borderRadius: '6px 6px 0 0',
                            borderBottom: '2px solid #1677ff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        }}>
                            <Tag color="blue">Sesi {session.sessionIndex}</Tag>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {session.transcript?.text?.length || 0} karakter
                            </Text>
                        </div>
                        <div style={{ padding: '0 4px' }}>
                            {renderSingleTranscript(session.transcript)}
                        </div>
                    </div>
                ))
            ) : (
                renderSingleTranscript(transcript)
            )}
        </div>
    );

    const geminiConfig = (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Space.Compact style={{ width: '100%' }}>
                <Input.Password
                    placeholder="Gemini API Key"
                    value={geminiKey}
                    onChange={e => setGeminiKey(e.target.value)}
                    style={{ width: 'calc(100% - 120px)' }}
                />
                <Button
                    icon={<ReloadOutlined />}
                    onClick={handleFetchGeminiModels}
                    loading={loadingModels}
                >
                    Fetch
                </Button>
            </Space.Compact>

            {geminiModels.length > 0 && (
                <Select
                    style={{ width: '100%' }}
                    placeholder="Pilih Model Gemini"
                    value={selectedGeminiModel}
                    onChange={setSelectedGeminiModel}
                    options={geminiModels.map(m => ({
                        value: m.name,
                        label: m.displayName
                    }))}
                />
            )}
        </Space>
    );

    const ollamaLocalConfig = (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Space.Compact style={{ width: '100%' }}>
                <Input
                    placeholder="Ollama Endpoint"
                    value={ollamaEndpoint}
                    onChange={e => setOllamaEndpoint(e.target.value)}
                    style={{ width: 'calc(100% - 100px)' }}
                    addonBefore={
                        <Badge
                            status={ollamaOnline === true ? 'success' : ollamaOnline === false ? 'error' : 'default'}
                        />
                    }
                />
                <Button
                    icon={<ReloadOutlined />}
                    onClick={handleFetchOllamaModels}
                    loading={loadingModels}
                >
                    Fetch
                </Button>
            </Space.Compact>

            {ollamaModels.length > 0 && (
                <Select
                    style={{ width: '100%' }}
                    placeholder="Pilih Model Ollama"
                    value={selectedOllamaModel}
                    onChange={setSelectedOllamaModel}
                    options={ollamaModels.map(m => ({
                        value: m.name,
                        label: `${m.name} (${(m.size / 1e9).toFixed(1)} GB)`
                    }))}
                />
            )}

            {ollamaOnline === false && (
                <Alert
                    message="Ollama tidak terdeteksi"
                    description="Pastikan Ollama sudah running (ollama serve)"
                    type="warning"
                    showIcon
                />
            )}
        </Space>
    );

    const ollamaCloudConfig = (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Space.Compact style={{ width: '100%' }}>
                <Input.Password
                    placeholder="Ollama Cloud API Key"
                    value={ollamaApiKey}
                    onChange={e => setOllamaApiKey(e.target.value)}
                    style={{ width: 'calc(100% - 100px)' }}
                    addonBefore={
                        <Badge
                            status={ollamaOnline === true ? 'success' : ollamaOnline === false ? 'error' : 'default'}
                        />
                    }
                />
                <Button
                    icon={<ReloadOutlined />}
                    onClick={handleFetchOllamaModels}
                    loading={loadingModels}
                    disabled={!ollamaApiKey}
                >
                    Fetch
                </Button>
            </Space.Compact>

            {ollamaModels.length > 0 && (
                <Select
                    style={{ width: '100%' }}
                    placeholder="Pilih Model"
                    value={selectedOllamaModel}
                    onChange={setSelectedOllamaModel}
                    options={ollamaModels.map(m => ({
                        value: m.name,
                        label: m.name
                    }))}
                />
            )}
        </Space>
    );

    const getProviderConfig = () => {
        switch (provider) {
            case 'gemini': return geminiConfig;
            case 'ollama-local': return ollamaLocalConfig;
            case 'ollama-cloud': return ollamaCloudConfig;
        }
    };

    const isGenerateDisabled = () => {
        if (provider === 'gemini') return !geminiKey || !selectedGeminiModel;
        if (provider === 'ollama-cloud') return !ollamaApiKey || !selectedOllamaModel;
        return !selectedOllamaModel || ollamaOnline !== true;
    };

    const getButtonLabel = () => {
        const model = provider === 'gemini' ? selectedGeminiModel : selectedOllamaModel || 'Select Model';
        return `Generate (${model})`;
    };

    const summaryContent = (
        <div style={{ padding: 20 }}>
            {!summary ? (
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Alert
                        message="AI Summary (BYOK)"
                        description="Pilih provider AI dan model untuk generate summary"
                        type="info"
                        showIcon
                    />

                    <Segmented
                        value={provider}
                        onChange={(val) => {
                            setProvider(val as ProviderOption);
                            setOllamaModels([]); // Reset models when switching
                            setSelectedOllamaModel('');
                        }}
                        options={[
                            { value: 'gemini', label: <span><CloudOutlined /> Gemini</span> },
                            { value: 'ollama-local', label: <span><DesktopOutlined /> Ollama Local</span> },
                            { value: 'ollama-cloud', label: <span><ApiOutlined /> Ollama Cloud</span> },
                        ]}
                        block
                    />

                    <PluginSlot name="summary-options" context={{ transcriptText: transcript.text }} />

                    {getProviderConfig()}

                    <Button
                        type="primary"
                        icon={<RobotOutlined />}
                        onClick={handleGenerateSummary}
                        loading={isSummarizing}
                        disabled={isGenerateDisabled()}
                        block
                    >
                        {getButtonLabel()}
                    </Button>

                    {summaryError && <Alert message="Summary Error" description={summaryError} type="error" showIcon />}
                </Space>
            ) : (
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Button onClick={clearSummary} size="small">
                        ← Generate Ulang
                    </Button>
                    <MarkdownViewer content={summary} />
                </Space>
            )}
        </div>
    );

    const items = [
        { key: '1', label: <span><FileTextOutlined /> Transcript</span>, children: transcriptContent },
        { key: '2', label: <span><RobotOutlined /> AI Summary</span>, children: summaryContent },
    ];

    if (mode === 'transcript-only') {
        return (
            <Card style={{ margin: '20px 0', textAlign: 'left' }}>
                <div style={{ fontWeight: 600, marginBottom: 12 }}><FileTextOutlined /> Transcript</div>
                {transcriptContent}
            </Card>
        );
    }

    if (mode === 'summary-only') {
        return (
            <Card style={{ textAlign: 'left', height: '100%' }}>
                <div style={{ fontWeight: 600, marginBottom: 12 }}><RobotOutlined /> AI Summary</div>
                {summaryContent}
            </Card>
        );
    }

    return (
        <Card style={{ height: '100%', textAlign: 'left' }}>
            <Tabs defaultActiveKey="1" items={items} />
        </Card>
    );
};
