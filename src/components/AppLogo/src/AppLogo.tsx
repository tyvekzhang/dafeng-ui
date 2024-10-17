import { Space } from 'antd';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/stores'
import logoImg from '@/assets/images/logo.png';
import logoName from '@/assets/images/name_white.png';
import classNames from 'classnames';
import styles from './app-logo.module.less';

const AppLogo: FC = () => {
  const navigate = useNavigate();
  const getMenuFold = useAppSelector(state => state.app.appConfig?.menuSetting?.menuFold)

  const handleClick = () => {
    navigate('/home');
  };

  return (
    <div
      className={classNames('anticon', styles['app-logo'])}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <Space>
        <img className={styles['logo-img']} src={logoImg} alt="logo" />
        <div
          className={classNames(styles['logo-name'], { [styles['hidden']]: getMenuFold })}
        >大风管理平台</div>
      </Space>
    </div>
  );
};

export default AppLogo;
