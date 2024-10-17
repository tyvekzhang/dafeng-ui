import { AppLogo } from '@/components/AppLogo';
import { useAppSelector } from '@/stores';
import { Layout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import HeaderLayout from './header';
import './index.less';
import Menu from './menu';
import React from 'react';

const BasicLayout:React.FC = () => {
  const { Sider, Content } = Layout;
  const { state } = useLocation();
  const { key = 'key' } = state || {};
  const getMenuFold = useAppSelector(st => st.app.appConfig?.menuSetting?.menuFold);

  return (
    <Layout className="layout_wrapper">
      <Sider width={200} collapsed={getMenuFold}>
        <AppLogo />
        <Menu />
      </Sider>
      <Layout>
        <HeaderLayout />
        <Layout id="mainCont">
          <Content>
            <Outlet key={key} />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
