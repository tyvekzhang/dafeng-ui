import { TOKEN_KEY } from '@/enums/cacheEnum';
import { getUserInfo, loginApi } from '@/services';
import { appSetting } from '@/settings/appBaseSetting';
import { useAppDispatch, useAppSelector } from '@/stores';
import { setSessionTimeout, setToken, setUserInfo } from '@/stores/modules/user';
import type { LoginParams, UserInfo } from '@/types';
import { getAuthCache } from '@/utils/auth';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import classNames from 'classnames';
import { type FC, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './index.module.less';

const LoginPage: FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const { token, sessionTimeout } = useAppSelector((state) => state.user);
  const getToken = (): string => {
    return token || getAuthCache<string>(TOKEN_KEY);
  };

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleLogin = async (values: any) => {
    try {
      setLoading(true);
      const userInfo = await loginAction({
        username: values.username,
        password: values.password,
      });
      if (userInfo) {
        message.success('登陆成功！');
      }
    } catch (error) {
      message.error((error as unknown as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const loginAction = async (
    params: LoginParams & {
      goHome?: boolean;
    },
  ): Promise<UserInfo | null> => {
    try {
      const { goHome = true, ...loginParams } = params;
      const data = await loginApi(loginParams);

      // 保存 Token
      dispatch(setToken(data?.token));
      return afterLoginAction(goHome);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const afterLoginAction = async (goHome?: boolean): Promise<UserInfo | null> => {
    if (!getToken()) return null;

    const userInfo = await getUserInfoAction();

    if (sessionTimeout) {
      dispatch(setSessionTimeout(false));
    } else {
      const redirect = searchParams.get('redirect');
      if (redirect) {
        navigate(redirect);
      } else {
        if (goHome) {
          navigate(userInfo?.homePath || '/home');
        }
      }
    }

    return userInfo;
  };

  const getUserInfoAction = async (): Promise<UserInfo | null> => {
    if (!getToken()) return null;

    const userInfo = await getUserInfo();

    dispatch(setUserInfo(userInfo));

    return userInfo;
  };

  return (
    <div className={styles['login-wrapper']}>
      <div className={styles['login-box']}>
        <div className={styles['login-box-title']}>{appSetting.name}</div>
        <Form
          form={form}
          initialValues={{
            username: 'admin',
            password: '123456',
            remember: true,
          }}
          className={styles['login-box-form']}
          onFinish={handleLogin}
        >
          <Form.Item name="username" rules={[{ required: true, message: '请输入账号' }]}>
            <Input
              placeholder="请输入"
              prefix={<UserOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} rev={undefined} />}
            />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input
              type="password"
              placeholder="请输入"
              prefix={<LockOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} rev={undefined} />}
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" className={classNames('fl', styles['no-margin'])} valuePropName="checked">
              <Checkbox>记住我</Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles['login-btn']} loading={loading}>
              登 录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
