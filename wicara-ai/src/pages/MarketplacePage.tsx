import React from 'react';
import { Typography, Card, Row, Col, Button, Tag, Space, Empty } from 'antd';
import { CheckCircleOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { usePlugins } from '../plugins/core';
import type { PluginDefinition } from '../plugins/core/types';

const { Title, Text, Paragraph } = Typography;

const categoryColors: Record<string, string> = {
  export: 'blue',
  integration: 'green',
  ai: 'purple',
  utility: 'orange',
};

export const MarketplacePage: React.FC = () => {
  const { plugins, isInstalled, install, uninstall } = usePlugins();

  const handleToggle = (plugin: PluginDefinition) => {
    if (isInstalled(plugin.meta.id)) {
      uninstall(plugin.meta.id);
    } else {
      install(plugin.meta.id);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>🛒 Plugin Marketplace</Title>
      <Paragraph type="secondary">
        Expand Wicara AI functionality with plugins. Install what you need.
      </Paragraph>

      {plugins.length === 0 ? (
        <Empty description="No plugins available" />
      ) : (
        <Row gutter={[16, 16]}>
          {plugins.map((plugin) => {
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
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Space>
                        <span style={{ fontSize: 32 }}>{plugin.meta.icon}</span>
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
                      style={{ marginBottom: 8, marginTop: 8 }}
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
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};
