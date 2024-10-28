import '@/design/index.less';
import { App, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { myPersiStore, store } from './stores';

// register svg icon
import { GlobalToast } from '@/components/GlobalToast';
import router from '@/router';
import { RouterProvider } from 'react-router-dom';
import 'virtual:svg-icons-register';

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
