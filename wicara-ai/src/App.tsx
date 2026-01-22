import { useState } from 'react';
import { ConfigProvider, Layout, theme, Dropdown, Avatar, Space, Spin } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { RecordingInterface } from './components/RecordingInterface';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { SettingsPage } from './pages/SettingsPage';

const { Header, Content, Footer } = Layout;

type Page = 'home' | 'settings';

// Main App Content (Protected)
function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { user, loading, signOut } = useAuth();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Show Auth Page if not logged in
  if (!user) {
    return <AuthPage />;
  }

  // User Menu
  const userMenuItems = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => setCurrentPage('settings'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: signOut,
    },
  ];

  // Render current page content
  const renderPageContent = () => {
    switch (currentPage) {
      case 'settings':
        return <SettingsPage onBack={() => setCurrentPage('home')} />;
      default:
        return <RecordingInterface />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => setCurrentPage('home')}
        >
          🎙️ Wicara AI <span style={{ fontSize: '12px', fontWeight: 'normal', opacity: 0.8 }}>MVP</span>
        </div>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={{ cursor: 'pointer', color: 'white' }}>
            <Avatar icon={<UserOutlined />} />
            <span>{user.email}</span>
          </Space>
        </Dropdown>
      </Header>
      <Content style={{ padding: '0 48px', marginTop: '32px' }}>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          {renderPageContent()}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Wicara AI ©{new Date().getFullYear()} - Privacy First Meeting Assistant
      </Footer>
    </Layout>
  );
}

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
        },
      }}
    >
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
