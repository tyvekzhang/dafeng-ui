import { AppLogo } from '@/components/AppLogo';
import { useTitle } from '@/hooks/web/useTitle';
import TagsLayout from '@/layout/tags';
import { useAppSelector } from '@/stores';
import { Layout } from 'antd';
import React, { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import HeaderLayout from './header';
import Menu from './menu';
import useStyles from './style';

const BasicLayout: React.FC = () => {
  const { styles } = useStyles();
  useTitle();
  const { Sider, Content } = Layout;
  const location = useLocation();
  const key = location.state?.key || 'defaultKey';
  const menuFold = useAppSelector((st) => st.app.appConfig?.menuSetting?.menuFold);
  const layoutClasses = useMemo(
    () => ({
      sider: { width: 200, collapsed: menuFold },
      layout: styles.layoutWrapper,
    }),
    [menuFold, styles.layoutWrapper],
  );

  return (
    <Layout className={layoutClasses.layout}>
      <Sider {...layoutClasses.sider}>
        <AppLogo />
        <Menu />
      </Sider>
      <Layout>
        <HeaderLayout />
        <Layout className={"w-full"}>
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
