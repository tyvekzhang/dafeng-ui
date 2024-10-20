import type { ThemeConfig } from 'antd';

export const themeToken: ThemeConfig['token'] = {
  // 布局背景色
  colorBgLayout: '#f7f7fa',
};

export const customCompTheme: ThemeConfig['components'] = {
  Table: {
    headerBg: '#fff',
  },
};

export default themeToken;
