import { GlobalToast } from '@/components/GlobalToast';
import '@/design/index.less';
import router from '@/router';
import themeToken, { customCompTheme } from '@/settings/theme';
import { App, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import 'virtual:svg-icons-register';
import { store } from './stores';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <ConfigProvider
      prefixCls="sc"
      theme={{
        token: themeToken,
        components: customCompTheme,
      }}
      locale={zhCN}
    >
      <App>
        <GlobalToast />
        <RouterProvider router={router} />
      </App>
    </ConfigProvider>
  </Provider>,
);
