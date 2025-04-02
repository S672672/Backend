import { Button, Result, Row, Col } from 'antd';
import { GithubOutlined, PhoneOutlined, GlobalOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

const About = () => {
  const translate = useLanguage();

  return (
    <Result
      status="info"
      title={'Smith Group of Industries'}
      subTitle={translate('Always on the mark')}
      extra={
        <>
          <Row gutter={[16, 16]} justify="center">
            <Col span={24}>
              <p>
                <GlobalOutlined style={{ marginRight: 8 }} />
                Website: <a href="https://smithbhattarai.com.np/">www.smithbhattarai.com.np</a>
              </p>
            </Col>
            <Col span={24}>
              <p>
                <GithubOutlined style={{ marginRight: 8 }} />
                GitHub: <a href="https://github.com/s672672">https://github.com/s672672</a>
              </p>
            </Col>
            <Col span={24}>
              <p>
                <PhoneOutlined style={{ marginRight: 8 }} />
                Contact Us: <a href="https://smithbhattarai.com.np/">www.smith.com/contact-us</a>
              </p>
            </Col>
          </Row>
          <Button
            type="primary"
            onClick={() => {
              window.open('https://smithbhattarai.com.np/');
            }}
          >
            {translate('Contact us')}
          </Button>
        </>
      }
    />
  );
};

export default About;
