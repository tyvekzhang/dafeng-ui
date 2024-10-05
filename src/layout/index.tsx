import { Layout } from 'antd'
import { Outlet, useLocation } from 'react-router-dom'
import Menu from './menu'
import HeaderLayout from './header'
import { AppLogo } from '@/components/AppLogo'
import './index.less'
import { useAppSelector } from '@/stores'

export const BasicLayout = () => {
  const { Sider, Content } = Layout
  const { state } = useLocation()
  const { key = 'key' } = state || {}
  const getMenuFold = useAppSelector(st => st.app.appConfig?.menuSetting?.menuFold)

  return (
    <Layout className='layout_wrapper'>
      <Sider width={210} trigger={null} collapsed={getMenuFold} style={{ height: '100vh' }}>
        <AppLogo />
        <Menu />
      </Sider>
      <Layout>
        <HeaderLayout />
        <Layout id='mainCont'>
          <Content>
            <Outlet key={key} />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default BasicLayout;
