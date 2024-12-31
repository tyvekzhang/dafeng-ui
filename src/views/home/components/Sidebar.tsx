import { DashboardOutlined, ReadOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

export default function Sidebar() {
  return (
    <Menu mode="inline" defaultSelectedKeys={['1']} className="h-full">
      <Menu.Item key="1" icon={<DashboardOutlined />}>
        仪表盘
      </Menu.Item>
      <Menu.Item key="2" icon={<ReadOutlined />}>
        文章管理
      </Menu.Item>
      <Menu.Item key="3" icon={<UserOutlined />}>
        用户管理
      </Menu.Item>
      <Menu.Item key="4" icon={<SettingOutlined />}>
        系统设置
      </Menu.Item>
    </Menu>
  );
}
