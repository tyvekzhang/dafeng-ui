import type { ThemeConfig } from 'antd';

export const themeToken: ThemeConfig['token'] = {
  // 布局背景色
  colorBgLayout: '#f7f7fa',
  colorPrimary: '#1677ff',
};

export const customCompTheme: ThemeConfig['components'] = {
  Table: {
    headerBg: '#fafafa',
  },
};

export default themeToken;
