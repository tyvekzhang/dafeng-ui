"use client"

import type React from "react"

import { REMEMBER_KEY, TOKEN_KEY } from "@/enums/cacheEnum"
import { login, me } from "@/service/user"
import { appSetting } from "@/settings/appBaseSetting"
import { useAppDispatch, useAppSelector } from "@/stores"
import { setRememberMe, setToken, setUserInfo } from "@/stores/modules/user"
import type { UserInfo } from "@/types"
import type { LoginForm, Token } from "@/types/user"
import { getCacheToken, setAuthCache } from "@/utils/auth"
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons"
import { App, Button, Checkbox, Form } from "antd"
import { type FC, useState, useCallback, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import userStyles from "./style"
import { fetchAllDictData } from "@/service/dict-data"

const LoginPage: FC = () => {
  const { styles } = userStyles()
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [pwdType, setPwdType] = useState<"password" | "text">("password")
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const dispatch = useAppDispatch()

  const { token } = useAppSelector((state) => state.user)

  const getToken = useCallback((): Token | null => {
    return token || getCacheToken()
  }, [token])

  const initRemember = getToken()

  const handlePasswordSwitch = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setPwdType((prevType) => (prevType === "password" ? "text" : "password"))
  }, [])

  const loginAction = useCallback(
    async (params: LoginForm): Promise<UserInfo | null> => {
      const { ...loginParams } = params
      const data = await login(loginParams)
      const rememberValue = loginParams.remember || false
      dispatch(setRememberMe(rememberValue))
      dispatch(setToken(data))
      setAuthCache(rememberValue, TOKEN_KEY, data)
      setAuthCache(true, REMEMBER_KEY, rememberValue)
      return afterLoginAction()
    },
    [dispatch],
  )

  const afterLoginAction = useCallback(async (): Promise<UserInfo | null> => {
    const [userInfo] = await Promise.all([me(), fetchAllDictData()])
    dispatch(setUserInfo(userInfo))

    const redirect = searchParams.get("redirect")
    navigate(redirect || userInfo?.homePath || "/home")

    return userInfo
  }, [dispatch, navigate, searchParams])

  const handleLogin = useCallback(
    async (values: LoginForm) => {
      setLoading(true)
      try {
        const userInfo = await loginAction({
          username: values.username,
          password: values.password,
          remember: values.remember,
        })
        if (userInfo) {
          message.success("登录成功")
        }
      } finally {
        setLoading(false)
      }
    },
    [loginAction, message],
  )

  useEffect(() => {
    return () => {
      // Clean up any subscriptions or pending requests here
    }
  }, [])

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.loginHeader}>{appSetting.name}</div>
        <Form
          form={form}
          initialValues={{ remember: initRemember }}
          className={styles.loginForm}
          onFinish={handleLogin}
        >
          <Form.Item name="username" rules={[{ required: true, message: "请输入账号" }]}>
            <input className={styles.loginInput} placeholder="请输入账号" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
            <div className={styles.passwordContainer}>
              <input type={pwdType} className={styles.loginInput} placeholder="请输入密码" />
              <div className={styles.passwordSwitch} onClick={handlePasswordSwitch}>
                {pwdType === "text" ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </div>
            </div>
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>记住我</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.loginButton} loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default LoginPage

