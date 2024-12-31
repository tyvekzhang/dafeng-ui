import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu } from 'antd';

const userMenu = (
  <Menu>
    <Menu.Item key="1" icon={<UserOutlined />}>
      个人信息
    </Menu.Item>
    <Menu.Item key="2" icon={<SettingOutlined />}>
      设置
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3" icon={<LogoutOutlined />}>
      退出登录
    </Menu.Item>
  </Menu>
);

export default function Navbar() {
  return (
    <div className="flex justify-between items-center px-6 h-full">
      <div className="text-xl font-bold">奇点智阅</div>
      <Dropdown overlay={userMenu} placement="bottomRight">
        <Avatar icon={<UserOutlined />} className="cursor-pointer" />
      </Dropdown>
    </div>
  );
}
