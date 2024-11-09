import { REMEMBER_KEY, TOKEN_KEY } from '@/enums/cacheEnum';
import { login, me } from '@/services';
import { appSetting } from '@/settings/appBaseSetting';
import { useAppDispatch, useAppSelector } from '@/stores';
import { setRememberMe, setToken, setUserInfo } from '@/stores/modules/user';
import type { UserInfo } from '@/types';
import { LoginForm, Token } from '@/types/user';
import { getCacheToken, setAuthCache } from '@/utils/auth';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { App, Button, Checkbox, Form } from 'antd';
import classNames from 'classnames';
import { type FC, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import userStyles from './style';

const LoginPage: FC = () => {
  const { styles } = userStyles();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [see, setSee] = useState(false);
  const [pwdType, setPwdType] = useState<string>('password');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const { token } = useAppSelector((state) => state.user);
  const getToken = (): Token | null => {
    if (token) {
      return token;
    }
    return getCacheToken();
  };

  const init_remember = getToken()?.remember;

  const handlePasswordSwitch = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setSee((see) => !see);
    if (pwdType === 'password') {
      setPwdType('text');
    } else {
      setPwdType('password');
    }
  };

  const handleLogin = async (values: LoginForm) => {
    try {
      setLoading(true);
      const userInfo = await loginAction({
        username: values.username,
        password: values.password,
        remember: values.remember,
      });
      if (userInfo) {
        message.success('登陆成功');
      }
    } finally {
      setLoading(false);
    }
  };

  const loginAction = async (params: LoginForm): Promise<UserInfo | null> => {
    try {
      const { ...loginParams } = params;
      const data = await login(loginParams);
      const rememberValue = loginParams.remember ? loginParams.remember : false;
      dispatch(setRememberMe(rememberValue));
      // 保存 Token
      dispatch(setToken(data));
      setAuthCache(rememberValue, TOKEN_KEY, data);
      setAuthCache(true, REMEMBER_KEY, rememberValue);
      return afterLoginAction();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const afterLoginAction = async (): Promise<UserInfo | null> => {
    const userInfo = await getUserInfoAction();

    const redirect = searchParams.get('redirect');
    if (redirect) {
      navigate(redirect);
    } else {
      navigate(userInfo?.homePath || '/home');
    }

    return userInfo;
  };

  const getUserInfoAction = async (): Promise<UserInfo | null> => {
    const userInfo = await me();

    dispatch(setUserInfo(userInfo));

    return userInfo;
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.loginHeader}>{appSetting.name}</div>
        <Form
          form={form}
          initialValues={{ remember: init_remember }}
          className={styles.loginForm}
          onFinish={handleLogin}
        >
          <Form.Item name="username" rules={[{ required: true, message: '请输入账号' }]}>
            <input className={styles.loginInput} placeholder="请输入账号" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <div className={styles.passwordContainer}>
              <input type={pwdType} className={styles.loginInput} placeholder="请输入密码"></input>
              <div className={styles.passwordSwitch} onClick={handlePasswordSwitch}>
                {see ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </div>
            </div>
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" className={classNames(styles.noMargin)} valuePropName="checked">
              <Checkbox>记住我</Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.loginButton} loading={loading}>
              登 录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
