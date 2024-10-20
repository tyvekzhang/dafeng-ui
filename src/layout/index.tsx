import { AppLogo } from '@/components/AppLogo';
import { useAppSelector } from '@/stores';
import { Layout } from 'antd';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import HeaderLayout from './header';
import Menu from './menu';
import useStyles from './style';
import TagsLayout from "@/layout/tags";
import {useTitle} from "@/hooks/web/useTitle";

const BasicLayout: React.FC = () => {
  useTitle()
  const { styles } = useStyles();
  const { Sider, Content } = Layout;
  const { state } = useLocation();
  const { key = 'key' } = state || {};
  const getMenuFold = useAppSelector((st) => st.app.appConfig?.menuSetting?.menuFold);

  return (
    <Layout className={styles.layout_wrapper}>
      <Sider width={200} collapsed={getMenuFold}>
        <AppLogo />
        <Menu />
      </Sider>
      <Layout>
        <HeaderLayout />
        <Layout id="mainCont">
          <TagsLayout />
          <Content>
            <Outlet key={key} />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
