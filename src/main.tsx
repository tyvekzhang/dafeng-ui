import { GlobalToast } from '@/components/GlobalToast';
import '@/design/index.less';
import router from '@/router';
import { App, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import 'virtual:svg-icons-register';
import { myPersiStore, store } from './stores';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={myPersiStore}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1677ff',
            },
          }}
          locale={zhCN}
        >
          <App>
            <GlobalToast />
            <RouterProvider router={router} />
          </App>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
