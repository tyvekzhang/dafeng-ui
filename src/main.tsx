import React from "react";
import ReactDOM from "react-dom/client";
import { store, persistor } from "./stores";
import { App, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import "@/design/index.less";

// register svg icon
import "virtual:svg-icons-register";
import router from "@/routers";
import { RouterProvider } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
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
