import useLanguage from '@/locale/useLanguage';
import { Layout, Col, Divider, Typography } from 'antd';
import AuthLayout from '@/layout/AuthLayout';
import SideContent from './SideContent';
import logo from '@/style/images/smithindustry.svg';

const { Content } = Layout;
const { Title } = Typography;

const AuthModule = ({ authContent, AUTH_TITLE, isForRegistre = false }) => {
  const translate = useLanguage();

  return (
    <AuthLayout sideContent={<SideContent />}>
      <Content
        style={{
          padding: isForRegistre ? '50px 30px' : '80px 30px',
          maxWidth: '450px',
          margin: '0',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Logo Section */}
        <Col xs={24} sm={24} md={0} style={{ marginBottom: 20 }}>
          <img
            src={logo}
            alt="Smith Group of Industries"
            style={{
              width: '200px',
              maxWidth: '100%',
              display: 'block',
            }}
          />
        </Col>

        {/* Authentication Title */}
        {/* <Title level={2} style={{ color: '#333', fontWeight: 600, marginBottom: 10 }}>
          {translate(AUTH_TITLE)}
        </Title> */}

        <Divider style={{ width: '100%', maxWidth: '350px' }} />

        {/* Auth Content (Login/Register Form) */}
        <div
          className="site-layout-content"
          style={{ width: '100%', marginTop: '100px', maxWidth: '350px' }}
        >
          {authContent}
        </div>
      </Content>
    </AuthLayout>
  );
};

export default AuthModule;
