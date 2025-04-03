import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Drawer, Layout, Menu } from 'antd';
import { useAppContext } from '@/context/appContext';
import logo from '@/style/images/smithindustry.svg';
import useLanguage from '@/locale/useLanguage';
import useResponsive from '@/hooks/useResponsive';
import {
  SettingOutlined,
  CustomerServiceOutlined,
  ContainerOutlined,
  FileSyncOutlined,
  DashboardOutlined,
  TagOutlined,
  TagsOutlined,
  UserOutlined,
  CreditCardOutlined,
  MenuOutlined,
  FileOutlined,
  ShopOutlined,
  FilterOutlined,
  WalletOutlined,
  TeamOutlined,
  ReconciliationOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

export default function Navigation() {
  const { isMobile } = useResponsive();

  return isMobile ? <MobileSidebar /> : <Sidebar collapsible={true} />;
}

function Sidebar({ collapsible, isMobile = false }) {
  let location = useLocation();
  const { state: stateApp, appContextAction } = useAppContext();
  const { isNavMenuClose } = stateApp;
  const { navMenu } = appContextAction;
  const [showLogoApp, setLogoApp] = useState(isNavMenuClose);
  const [currentPath, setCurrentPath] = useState(location.pathname.slice(1));
  const translate = useLanguage();
  const navigate = useNavigate();

  const items = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: <Link to={'/'}>Dashboard</Link> },
    {
      key: 'customer',
      icon: <CustomerServiceOutlined />,
      label: <Link to={'/customer'}>Customers</Link>,
    },
    { key: 'invoice', icon: <ContainerOutlined />, label: <Link to={'/invoice'}>Invoices</Link> },
    { key: 'quote', icon: <FileSyncOutlined />, label: <Link to={'/quote'}>Quotes</Link> },
    { key: 'payment', icon: <CreditCardOutlined />, label: <Link to={'/payment'}>Payments</Link> },
    {
      key: 'paymentMode',
      icon: <WalletOutlined />,
      label: <Link to={'/payment/mode'}>Payment Modes</Link>,
    },
    { key: 'taxes', icon: <ShopOutlined />, label: <Link to={'/taxes'}>Taxes</Link> },
    { key: 'employees', icon: <TeamOutlined />, label: <Link to={'/employees'}>Employees</Link> },
    { key: 'settings', icon: <SettingOutlined />, label: <Link to={'/settings'}>Settings</Link> },
    { key: 'about', icon: <ReconciliationOutlined />, label: <Link to={'/about'}>About</Link> },
  ];

  useEffect(() => {
    if (location) {
      const newPath = location.pathname === '/' ? 'dashboard' : location.pathname.slice(1);
      if (currentPath !== newPath) {
        setCurrentPath(newPath);
      }
    }
  }, [location, currentPath]);

  useEffect(() => {
    setLogoApp(isNavMenuClose);
    const timer = setTimeout(() => {
      if (!isNavMenuClose) {
        setLogoApp(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [isNavMenuClose]);

  const onCollapse = () => {
    navMenu.collapse();
  };

  return (
    <Sider
      collapsible={collapsible}
      collapsed={isNavMenuClose}
      onCollapse={onCollapse}
      width={256}
      className="navigation"
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'relative',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#fff',
        boxShadow: '2px 0 8px rgba(76, 20, 219, 0.1)',
        transition: 'width 0.2s ease',
      }}
      theme="light"
    >
      <div
        className="logo"
        onClick={() => navigate('/')}
        style={{
          cursor: 'pointer',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isNavMenuClose ? 'center' : 'flex-start',
          height: '64px',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            height: '40px',
            width: 'auto',
            transition: 'opacity 0.2s ease',
            opacity: isNavMenuClose ? 1 : 1,
          }}
        />
      </div>
      <Menu
        items={items}
        mode="inline"
        theme="light"
        selectedKeys={[currentPath]}
        style={{
          border: 'none',
          fontSize: '16px',
          marginTop: '8px',
        }}
      />
    </Sider>
  );
}

function MobileSidebar() {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);

  return (
    <>
      <Button
        type="text"
        size="large"
        onClick={showDrawer}
        className="mobile-sidebar-btn"
        style={{ marginLeft: 25, position: 'fixed', top: 15, zIndex: 1000 }}
      >
        <MenuOutlined style={{ fontSize: 18 }} />
      </Button>
      <Drawer
        width={256}
        placement="left"
        closable={false}
        onClose={onClose}
        open={visible}
        bodyStyle={{ padding: 0, height: '100vh' }} // Full height for drawer content
      >
        <Sidebar collapsible={false} isMobile={true} />
      </Drawer>
    </>
  );
}
