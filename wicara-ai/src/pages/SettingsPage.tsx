import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, Space, Divider, message, Alert, Select } from 'antd';
import { SaveOutlined, EyeInvisibleOutlined, EyeTwoTone, AudioOutlined, RobotOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useApiKeys } from '../hooks/useApiKeys';

const { Title, Text } = Typography;

// Provider definitions - extensible for future providers
const VOICE_PROVIDERS = [
    { value: 'assemblyai', label: 'AssemblyAI', description: 'Cloud-based transcription with speaker diarization' },
    // Future: { value: 'whisper', label: 'OpenAI Whisper', description: 'Local or cloud transcription' },
    // Future: { value: 'deepgram', label: 'Deepgram', description: 'Real-time transcription API' },
];

const LLM_PROVIDERS = [
    { value: 'gemini', label: 'Google Gemini', description: 'Cloud AI by Google' },
    { value: 'ollama-local', label: 'Ollama (Local)', description: 'Run LLM locally on your machine' },
    { value: 'ollama-cloud', label: 'Ollama Cloud', description: 'Hosted Ollama service' },
    // Future: { value: 'openai', label: 'OpenAI GPT', description: 'ChatGPT API' },
    // Future: { value: 'anthropic', label: 'Anthropic Claude', description: 'Claude API' },
];

export const SettingsPage: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { keys, loaded, saveKeys, clearKeys } = useApiKeys();

    // Selected providers
    const [voiceProvider, setVoiceProvider] = useState('assemblyai');
    const [llmProvider, setLlmProvider] = useState('gemini');

    // Load saved keys when hook is ready
    useEffect(() => {
        if (loaded) {
            form.setFieldsValue({
                assemblyai: keys.assemblyai,
                gemini: keys.gemini,
                ollamaCloud: keys.ollamaCloud,
                ollamaEndpoint: keys.ollamaEndpoint || 'http://localhost:11434',
            });
        }
    }, [loaded, keys, form]);

    const handleSave = async (values: any) => {
        setLoading(true);
        try {
            saveKeys({
                assemblyai: values.assemblyai || '',
                gemini: values.gemini || '',
                ollamaCloud: values.ollamaCloud || '',
                ollamaEndpoint: values.ollamaEndpoint || 'http://localhost:11434',
            });
            message.success('Settings berhasil disimpan!');
        } catch (error) {
            message.error('Gagal menyimpan settings');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        clearKeys();
        form.resetFields();
        message.info('Semua settings dihapus');
    };

    // Voice Provider Settings (dynamic based on selection)
    const renderVoiceSettings = () => {
        switch (voiceProvider) {
            case 'assemblyai':
                return (
                    <Form.Item
                        name="assemblyai"
                        label="AssemblyAI API Key"
                        extra={<Text type="secondary">Dapatkan di: <a href="https://www.assemblyai.com/" target="_blank" rel="noopener noreferrer">assemblyai.com</a></Text>}
                    >
                        <Input.Password
                            placeholder="Masukkan API Key"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>
                );
            // Future cases here
            default:
                return <Alert message="Provider belum didukung" type="warning" />;
        }
    };

    // LLM Provider Settings (dynamic based on selection)
    const renderLLMSettings = () => {
        switch (llmProvider) {
            case 'gemini':
                return (
                    <Form.Item
                        name="gemini"
                        label="Gemini API Key"
                        extra={<Text type="secondary">Dapatkan di: <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer">aistudio.google.com</a></Text>}
                    >
                        <Input.Password
                            placeholder="Masukkan API Key"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>
                );
            case 'ollama-local':
                return (
                    <Form.Item
                        name="ollamaEndpoint"
                        label="Ollama Endpoint"
                        extra={<Text type="secondary">Default: http://localhost:11434 | Pastikan <code>ollama serve</code> sudah running</Text>}
                    >
                        <Input placeholder="http://localhost:11434" />
                    </Form.Item>
                );
            case 'ollama-cloud':
                return (
                    <Form.Item
                        name="ollamaCloud"
                        label="Ollama Cloud API Key"
                        extra={<Text type="secondary">Dapatkan di: <a href="https://ollama.com/cloud" target="_blank" rel="noopener noreferrer">ollama.com/cloud</a></Text>}
                    >
                        <Input.Password
                            placeholder="Masukkan API Key"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>
                );
            default:
                return <Alert message="Provider belum didukung" type="warning" />;
        }
    };

    return (
        <div>
            <Card>
                <Title level={3}>⚙️ Pengaturan</Title>

                <div style={{
                    padding: '12px 16px',
                    marginBottom: 24,
                    color: '#000000d9',
                    background: '#e6f7ff',
                    border: '1px solid #91caff',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'start',
                    gap: 12
                }}>
                    <InfoCircleOutlined style={{ color: '#1677ff', fontSize: 20, marginTop: 4 }} />
                    <div>
                         <div style={{ fontWeight: 600, marginBottom: 4 }}>Bring Your Own Key (BYOK)</div>
                         <div style={{ fontSize: 14 }}>API Keys disimpan secara lokal di browser Anda. Wicara AI tidak menyimpan keys di server.</div>
                    </div>
                </div>

                <Form form={form} layout="vertical" onFinish={handleSave}>

                    {/* Voice Provider Section */}
                    <Card type="inner" title={<span><AudioOutlined /> Voice Provider (Transcription)</span>} style={{ marginBottom: 16 }}>
                        <Form.Item label="Pilih Provider">
                            <Select
                                value={voiceProvider}
                                onChange={setVoiceProvider}
                                optionLabelProp="shortLabel"
                                options={VOICE_PROVIDERS.map(p => ({
                                    value: p.value,
                                    shortLabel: p.label,
                                    label: (
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <Text strong>{p.label}</Text>
                                            <Text type="secondary" ellipsis style={{ fontSize: 12 }}>{p.description}</Text>
                                        </div>
                                    )
                                }))}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                        {renderVoiceSettings()}
                    </Card>

                    {/* LLM Provider Section */}
                    <Card type="inner" title={<span><RobotOutlined /> LLM Provider (AI Summary)</span>} style={{ marginBottom: 16 }}>
                        <Form.Item label="Pilih Provider">
                            <Select
                                value={llmProvider}
                                onChange={setLlmProvider}
                                optionLabelProp="shortLabel"
                                options={LLM_PROVIDERS.map(p => ({
                                    value: p.value,
                                    shortLabel: p.label,
                                    label: (
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <Text strong>{p.label}</Text>
                                            <Text type="secondary" ellipsis style={{ fontSize: 12 }}>{p.description}</Text>
                                        </div>
                                    )
                                }))}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                        {renderLLMSettings()}
                    </Card>

                    <Divider />

                    <Space wrap style={{ width: '100%', justifyContent: 'center' }}>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                            Simpan Settings
                        </Button>
                        <Button danger onClick={handleClear}>
                            Reset Semua
                        </Button>
                    </Space>
                </Form>
            </Card>
        </div>
    );
};
