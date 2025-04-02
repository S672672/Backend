import React from 'react';
import { Form, Input, Checkbox, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

const { Text } = Typography;

export default function LoginForm() {
  const translate = useLanguage();

  return (
    <div style={{ width: '100%' }}>
      {/* Email Field */}
      <Form.Item
        label={<Text strong>{translate('Email')}</Text>}
        name="email"
        rules={[
          { required: true, message: translate('Please enter your email!') },
          { type: 'email', message: translate('Invalid email address!') },
        ]}
      >
        <Input
          prefix={<UserOutlined style={{ color: '#888' }} />}
          placeholder="email"
          size="large"
        />
      </Form.Item>

      {/* Password Field */}
      <Form.Item
        label={<Text strong>{translate('Password')}</Text>}
        name="password"
        rules={[{ required: true, message: translate('Please enter your password!') }]}
      >
        <Input.Password
          prefix={<LockOutlined style={{ color: '#888' }} />}
          placeholder="password"
          size="large"
        />
      </Form.Item>

      {/* Remember Me & Forgot Password */}
      <Form.Item>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Checkbox>{translate('Remember me')}</Checkbox>
          <a href="/forgetpassword" style={{ color: '#1890ff', fontSize: '14px' }}>
            {translate('Forgot password?')}
          </a>
        </div>
      </Form.Item>
    </div>
  );
}
