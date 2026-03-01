import React from 'react';
import { Typography, Card, Row, Col, Button, Tag, Space, Empty, Modal, Spin, message, Flex } from 'antd';
import { CheckCircleOutlined, DownloadOutlined, DeleteOutlined, CrownFilled } from '@ant-design/icons';
import { usePlugins } from '../plugins/core';
import type { PluginDefinition } from '../plugins/core/types';
import { supabase } from '../lib/supabase';

const { Title, Text, Paragraph } = Typography;

const categoryColors: Record<string, string> = {
  export: 'blue',
  integration: 'green',
  ai: 'purple',
  utility: 'orange',
};

export const MarketplacePage: React.FC = () => {
  const { plugins: bundledPlugins, isInstalled, install, uninstall, isSyncing } = usePlugins();

  const [dbPlugins, setDbPlugins] = React.useState<PluginDefinition[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [isPaymentModalVisible, setIsPaymentModalVisible] = React.useState(false);
  const [pluginToBuy, setPluginToBuy] = React.useState<PluginDefinition | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);

  React.useEffect(() => {
    fetchPluginsFromSupabase();
  }, []);

  const fetchPluginsFromSupabase = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('plugins')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      if (data && data.length > 0) {
        // Map Supabase data to PluginDefinition meta format
        const fetchedPlugins: PluginDefinition[] = data.map((item: any) => ({
          meta: {
            id: item.id,
            name: item.name,
            version: item.version,
            author: item.author,
            description: item.description,
            icon: item.icon,
            category: item.category,
            price: item.price === 0 ? 'free' : item.price
          }
        }));
        setDbPlugins(fetchedPlugins);
      } else {
        // Fallback to bundled plugins if table is empty or doesn't exist yet
        setDbPlugins(bundledPlugins);
      }
    } catch (err) {
      console.error('Failed to fetch plugins from Supabase:', err);
      // Fallback
      setDbPlugins(bundledPlugins);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (plugin: PluginDefinition) => {
    if (isInstalled(plugin.meta.id)) {
      await uninstall(plugin.meta.id);
    } else {
      if (plugin.meta.price !== 'free' && typeof plugin.meta.price === 'number') {
        // Check if bundled code actually exists
        const isBundled = bundledPlugins.find(p => p.meta.id === plugin.meta.id);
        if (!isBundled) {
            message.warning(`Plugin ${plugin.meta.name} belum tersedia di versi aplikasi ini.`);
            return;
        }

        setPluginToBuy(plugin);
        setIsPaymentModalVisible(true);
      } else {
        const isBundled = bundledPlugins.find(p => p.meta.id === plugin.meta.id);
        if (!isBundled) {
            message.warning(`Plugin ${plugin.meta.name} belum tersedia di versi aplikasi ini.`);
            return;
        }
        await install(plugin.meta.id);
      }
    }
  };

  const handleSimulatePayment = () => {
    if (!pluginToBuy) return;

    setIsProcessingPayment(true);
    setTimeout(async () => {
        await install(pluginToBuy.meta.id);
        setIsProcessingPayment(false);
        setIsPaymentModalVisible(false);
        setPluginToBuy(null);
        message.success(`Pembayaran berhasil! Plugin ${pluginToBuy.meta.name} telah diinstall.`);
    }, 2000);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>🛒 Plugin Marketplace</Title>
      <Paragraph type="secondary">
        Expand Wicara AI functionality with plugins. Install what you need.
      </Paragraph>

      {loading || isSyncing ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">{isSyncing ? 'Syncing your plugins...' : 'Loading plugins...'}</Text>
            </div>
        </div>
      ) : dbPlugins.length === 0 ? (
        <Empty description="No plugins available" />
      ) : (
        <Row gutter={[16, 16]}>
          {dbPlugins.map((plugin) => {
            const installed = isInstalled(plugin.meta.id);
            return (
              <Col xs={24} sm={12} lg={8} key={plugin.meta.id}>
                <Card
                  hoverable
                  style={{
                    borderColor: installed ? '#52c41a' : undefined,
                    borderWidth: installed ? 2 : 1,
                  }}
                >
                  <Flex vertical gap="middle" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Space>
                        {plugin.meta.icon.match(/^(http|\/|.*\.(png|jpg|jpeg|svg|webp|gif))/) ? (
                          <img src={plugin.meta.icon} alt={plugin.meta.name} style={{ width: 32, height: 32, objectFit: 'contain' }} />
                        ) : (
                          <span style={{ fontSize: 32 }}>{plugin.meta.icon}</span>
                        )}
                        <div>
                          <Text strong style={{ fontSize: 16 }}>{plugin.meta.name}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 12 }}>v{plugin.meta.version}</Text>
                        </div>
                      </Space>
                      <Tag color={categoryColors[plugin.meta.category] || 'default'}>
                        {plugin.meta.category}
                      </Tag>
                    </div>

                    <Paragraph
                      type="secondary"
                      ellipsis={{ rows: 2 }}
                    >
                      {plugin.meta.description}
                    </Paragraph>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text type="secondary">By {plugin.meta.author}</Text>
                      <Text strong style={{ color: plugin.meta.price === 'free' ? '#52c41a' : '#1677ff' }}>
                        {plugin.meta.price === 'free' ? 'FREE' : `Rp ${plugin.meta.price.toLocaleString()}`}
                      </Text>
                    </div>

                    <Button
                      block
                      type={installed ? 'default' : 'primary'}
                      danger={installed}
                      icon={installed ? <DeleteOutlined /> : <DownloadOutlined />}
                      onClick={() => handleToggle(plugin)}
                    >
                      {installed ? 'Uninstall' : 'Install'}
                    </Button>

                    {installed && (
                      <div style={{ textAlign: 'center' }}>
                        <Text type="success">
                          <CheckCircleOutlined /> Installed
                        </Text>
                      </div>
                    )}
                  </Flex>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Premium Payment Demo Modal */}
      <Modal
          title={<span><CrownFilled style={{ color: '#faad14' }} /> Pembayaran Plugin (Demo)</span>}
          open={isPaymentModalVisible}
          onCancel={() => {
              if (isProcessingPayment) return;
              setIsPaymentModalVisible(false);
              setPluginToBuy(null);
          }}
          footer={null}
          centered
      >
          {pluginToBuy && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Title level={4}>Install {pluginToBuy.meta.name}</Title>
                  <p style={{ color: '#666', marginBottom: 24 }}>
                      Plugin ini berbayar. Lakukan pembayaran untuk melanjutkan instalasi.
                  </p>
                  
                  <Card style={{ background: '#fafafa', marginBottom: 24 }}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Text>Harga Plugin</Text>
                              <Text strong>Rp {pluginToBuy.meta.price.toLocaleString()}</Text>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Text>PPN (11%)</Text>
                              <Text strong>Rp {((typeof pluginToBuy.meta.price === 'number' ? pluginToBuy.meta.price : 0) * 0.11).toLocaleString()}</Text>
                          </div>
                          <div style={{ borderTop: '1px dashed #d9d9d9', margin: '8px 0' }} />
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Text strong>Total Pembayaran</Text>
                              <Text strong style={{ fontSize: 18, color: '#1677ff' }}>
                                Rp {((typeof pluginToBuy.meta.price === 'number' ? pluginToBuy.meta.price : 0) * 1.11).toLocaleString()}
                              </Text>
                          </div>
                      </Space>
                  </Card>

                  <Button 
                      type="primary" 
                      size="large" 
                      block 
                      onClick={handleSimulatePayment}
                      disabled={isProcessingPayment}
                  >
                      {isProcessingPayment ? <Spin size="small" style={{ marginRight: 8 }} /> : 'Bayar via QRIS (Mock)'}
                  </Button>
                  <Text type="secondary" style={{ display: 'block', marginTop: 12, fontSize: 12 }}>
                      *Tombol ini akan mensimulasikan proses checkout sukses dan otomatis menginstall plugin.
                  </Text>
              </div>
          )}
      </Modal>
    </div>
  );
};
