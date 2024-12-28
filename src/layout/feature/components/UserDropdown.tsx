import headerImg from '@/assets/images/avatar.jpg';
import { message } from '@/components/GlobalToast';
import { REMEMBER_KEY, TOKEN_KEY } from '@/enums/cacheEnum';
import { myMessage } from '@/hooks/web/myMessage';
import { logout } from '@/service/user';
import { useAppDispatch, useAppSelector } from '@/stores';
import { resetState } from '@/stores/modules/user';
import { Token } from '@/types/user';
import { clearAllAuthCache, getAuthCache } from '@/utils/auth';
import { LockOutlined, PoweroffOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function UserDropdown() {
  const items: MenuProps['items'] = [
    {
      key: 'lock',
      label: (
        <Space size={4}>
          <LockOutlined />
          <span>个人中心</span>
        </Space>
      ),
    },
    {
      key: 'logout',
      label: (
        <Space size={4}>
          <PoweroffOutlined />
          <span>退出登录</span>
        </Space>
      ),
    },
  ];

  const onClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'lock':
        handleLock();
        break;
      case 'logout':
        handleLogout();
        break;
    }
  };

  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.user);
  const getToken = (): Token | null => {
    if (token) {
      return token;
    }
    const localRemember = getAuthCache<boolean>(true, REMEMBER_KEY);
    if (localRemember !== undefined) {
      return getAuthCache<Token>(localRemember, TOKEN_KEY);
    }
    return null;
  };

  const handleLock = () => {};

  const handleLogout = () => {
    const { createConfirm } = myMessage();

    createConfirm({
      iconType: 'warning',
      title: <span>温馨提醒</span>,
      content: <span>是否确认退出系统?</span>,
      onOk: async () => {
        await logoutAction(true);
      },
    });
  };

  const logoutAction = async (goLogin = false) => {
    if (getToken()) {
      try {
        await logout();
      } catch {
        const { createMessage } = myMessage();
        createMessage.error('注销失败');
      }
    }
    dispatch(resetState());
    clearAllAuthCache();
    if (goLogin) {
      navigate('/login');
    }
    message.success('注销成功');
  };

  return (
    <Dropdown menu={{ items, onClick }} placement="bottomRight" arrow>
      <span className="flex-center" style={{ cursor: 'pointer' }}>
        <img
          src={headerImg}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
          }}
          alt=""
        />
      </span>
    </Dropdown>
  );
}
