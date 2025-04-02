import { Layout, Typography, Space } from 'antd';
import logo from '@/style/images/smithindustry.svg';
import useLanguage from '@/locale/useLanguage';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function SideContent() {
  const translate = useLanguage();

  return (
    <Content
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        padding: '20px',
        background: 'white',
      }}
    >
      <img src={logo} alt="Smith Group of Industries" style={{ width: 180, marginBottom: 20 }} />

      <Title level={2} style={{ color: '#333', marginBottom: 10 }}>
        Welcome to Smith ERP System
      </Title>

      {/* <Text style={{ fontSize: 16, color: '#555' }}>
        A robust ERP system built with <b>Node.js</b> and <b>React.js</b> to enhance business
        efficiency.
      </Text> */}

      <Space direction="vertical" size="middle" style={{ marginTop: 20 }}>
        <Text strong style={{ color: '#222' }}>
          ✔️ Secure & Scalable
        </Text>
        <Text strong style={{ color: '#222' }}>
          ✔️ Fast & Reliable
        </Text>
        <Text strong style={{ color: '#222' }}>
          ✔️ Easy to Use
        </Text>
      </Space>
    </Content>
  );
}
