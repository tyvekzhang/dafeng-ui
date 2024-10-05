import React from 'react'
import ReactDOM from 'react-dom/client'

import Root from './Root'
import {App, ConfigProvider} from 'antd'
import zhCN from 'antd/locale/zh_CN';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ConfigProvider locale={zhCN}>
            <App>
                <Root/>
            </App>
        </ConfigProvider>
    </React.StrictMode>
)
