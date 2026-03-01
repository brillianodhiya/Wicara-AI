import React from 'react';
import { Card, Typography, Button, Row, Col, Space, Divider } from 'antd';
import { ApiOutlined, ToolOutlined, WhatsAppOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export const ServicesPage: React.FC = () => {

    const handleContactSales = (serviceName: string) => {
        // Implement your WhatsApp / Contact link here
        const message = `Halo Wicara AI, saya tertarik dengan layanan ${serviceName} untuk perusahaan saya.`;
        window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <Title level={2}>🌟 Layanan Premium Wicara AI</Title>
                <Paragraph type="secondary" style={{ fontSize: 16 }}>
                    Solusi terpadu untuk perusahaan dan profesional yang ingin fokus pada hasil tanpa perlu memikirkan sisi teknis.
                </Paragraph>
            </div>

            <Row gutter={[24, 24]} justify="center">
                {/* Service 1: API Key Subscription */}
                <Col xs={24} md={12}>
                    <Card
                        hoverable
                        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column' } }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <ApiOutlined style={{ fontSize: 48, color: '#1677ff', marginBottom: 16 }} />
                            <Title level={4}>Langganan API Key</Title>
                        </div>
                        
                        <div style={{ flex: 1 }}>
                            <Paragraph>
                                Dapatkan akses API (AssemblyAI / ElevenLabs / LLM) langsung dari kami tanpa repot mengurus pembayaran kartu kredit internasional atau pengaturan akun manual.
                            </Paragraph>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Text><CheckCircleOutlined style={{ color: '#52c41a' }} /> Pembayaran via Transfer Bank Lokal / QRIS</Text>
                                <Text><CheckCircleOutlined style={{ color: '#52c41a' }} /> Kuota bulanan yang disesuaikan kebutuhan</Text>
                                <Text><CheckCircleOutlined style={{ color: '#52c41a' }} /> Support prioritas</Text>
                            </Space>
                        </div>

                        <Divider />
                        
                        <Button 
                            type="primary" 
                            size="large" 
                            icon={<WhatsAppOutlined />} 
                            block
                            onClick={() => handleContactSales('Langganan API Key')}
                        >
                            Hubungi Admin
                        </Button>
                    </Card>
                </Col>

                {/* Service 2: Installation & Full Setup */}
                <Col xs={24} md={12}>
                    <Card
                        hoverable
                        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column' } }}
                    >
                         <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <ToolOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
                            <Title level={4}>Jasa Setup & Instalasi Lokal</Title>
                        </div>
                        
                        <div style={{ flex: 1 }}>
                            <Paragraph>
                                Bagi perusahaan yang mengutamakan privasi data. Kami akan datang / remote untuk melakukan instalasi Ollama (Local AI) dan setting Wicara AI di server/PC kantor Anda.
                            </Paragraph>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Text><CheckCircleOutlined style={{ color: '#52c41a' }} /> Instalasi & Konfigurasi Ollama 100% Offline</Text>
                                <Text><CheckCircleOutlined style={{ color: '#52c41a' }} /> Optimasi model AI sesuai spek hardware (GPU/CPU)</Text>
                                <Text><CheckCircleOutlined style={{ color: '#52c41a' }} /> Training penggunaan ke tim internal (Free 1 Session)</Text>
                            </Space>
                        </div>

                        <Divider />

                        <Button 
                            type="dashed" 
                            size="large" 
                            icon={<WhatsAppOutlined />} 
                            block
                            onClick={() => handleContactSales('Jasa Setup & Instalasi')}
                        >
                            Konsultasi Instalasi
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
