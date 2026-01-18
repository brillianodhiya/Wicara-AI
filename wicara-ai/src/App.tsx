
import { ConfigProvider, Layout, theme } from 'antd';
import { RecordingInterface } from './components/RecordingInterface';

const { Header, Content, Footer } = Layout;

function App() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
            Wicara AI <span style={{ fontSize: '12px', fontWeight: 'normal', opacity: 0.8 }}>MVP</span>
          </div>
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
            <RecordingInterface />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Wicara AI ©{new Date().getFullYear()} - Privacy First Meeting Assistant
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
