import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, Space, Switch, Divider, message, Alert } from 'antd';
import { KeyOutlined, SaveOutlined, EyeInvisibleOutlined, EyeTwoTone, ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface SettingsPageProps {
    onBack: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [byokEnabled, setByokEnabled] = useState(true);

    // Load saved keys from localStorage (encrypted in production)
    useEffect(() => {
        const savedKeys = localStorage.getItem('wicara_api_keys');
        if (savedKeys) {
            try {
                const parsed = JSON.parse(savedKeys);
                form.setFieldsValue(parsed);
            } catch (e) {
                console.error('Failed to parse saved keys');
            }
        }
    }, [form]);

    const handleSave = async (values: any) => {
        setLoading(true);
        try {
            // In production, encrypt before saving
            localStorage.setItem('wicara_api_keys', JSON.stringify(values));
            message.success('API Keys berhasil disimpan!');
        } catch (error) {
            message.error('Gagal menyimpan API Keys');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        localStorage.removeItem('wicara_api_keys');
        form.resetFields();
        message.info('API Keys dihapus dari penyimpanan lokal');
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <Space style={{ marginBottom: 24 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
                    Kembali
                </Button>
            </Space>

            <Card>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Title level={3}>⚙️ Pengaturan API Keys</Title>

                    <Alert
                        message="Bring Your Own Key (BYOK)"
                        description="API Keys disimpan secara lokal di browser Anda. Wicara AI tidak pernah menyimpan atau mengakses keys Anda di server kami."
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />

                    <Space>
                        <Text>Mode BYOK:</Text>
                        <Switch
                            checked={byokEnabled}
                            onChange={setByokEnabled}
                            checkedChildren="Aktif"
                            unCheckedChildren="Nonaktif"
                        />
                    </Space>

                    <Divider />

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSave}
                        disabled={!byokEnabled}
                    >
                        <Form.Item
                            name="assemblyai"
                            label={
                                <Space>
                                    <KeyOutlined />
                                    <span>AssemblyAI API Key</span>
                                </Space>
                            }
                            extra="Untuk transkripsi audio. Dapatkan di: https://www.assemblyai.com/"
                        >
                            <Input.Password
                                placeholder="Masukkan AssemblyAI API Key"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>

                        <Form.Item
                            name="gemini"
                            label={
                                <Space>
                                    <KeyOutlined />
                                    <span>Google Gemini API Key</span>
                                </Space>
                            }
                            extra="Untuk AI Summary. Dapatkan di: https://aistudio.google.com/"
                        >
                            <Input.Password
                                placeholder="Masukkan Gemini API Key"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>

                        <Form.Item
                            name="ollama"
                            label={
                                <Space>
                                    <KeyOutlined />
                                    <span>Ollama Cloud API Key (Optional)</span>
                                </Space>
                            }
                            extra="Untuk AI Summary alternatif dengan model open-source"
                        >
                            <Input.Password
                                placeholder="Masukkan Ollama Cloud API Key"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Space>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SaveOutlined />}
                                    loading={loading}
                                >
                                    Simpan Keys
                                </Button>
                                <Button danger onClick={handleClear}>
                                    Hapus Semua
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>

                    <Divider />

                    <Paragraph type="secondary" style={{ fontSize: 12 }}>
                        💡 <strong>Tips Keamanan:</strong> Jangan pernah share API Key Anda dengan siapapun.
                        Keys hanya disimpan di browser lokal dan tidak dikirim ke server Wicara AI.
                    </Paragraph>
                </Space>
            </Card>
        </div>
    );
};
