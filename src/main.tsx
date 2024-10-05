import '@/design/index.less';
import { App, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './stores';

// register svg icon
import router from '@/router';
import { RouterProvider } from 'react-router-dom';
import 'virtual:svg-icons-register';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ConfigProvider locale={zhCN}>
          <App>
            <RouterProvider router={router} />
          </App>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
