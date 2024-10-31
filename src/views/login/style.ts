import { createStyles } from 'antd-style';

export default createStyles(({ token }) => ({
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    backgroundImage: `url('src/assets/images/background.svg')`,
    backgroundSize: 'cover',
  },

  loginBox: {
    width: 'auto',
    height: 'auto',
    padding: '32px',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 15px 30px 0 rgba(0, 0, 1, 0.1)',
  },

  loginHeader: {
    margin: '0 auto 35px',
    textAlign: 'center',
    fontSize: '18px',
    color: '#000000A6',
    fontWeight: 600,
    letterSpacing: '2px',
  },

  loginForm: {
    width: '320px',
    color: 'rgba(0, 0, 0, 0.25)',
  },

  loginInput: {
    width: '100%',
    height: token.controlHeight,
    margin: '4px 0px',
    padding: '2px',
    borderBottom: '1px solid #D9D9D9FF',
  },

  passwordContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  passwordSwitch: {
    height: token.controlHeight,
    cursor: 'pointer',
    fontSize: token.fontSize,
    color: token.colorIcon,
    borderBottom: '1px solid #D9D9D9FF',
    '&:hover': {
      color: token.colorIconHover,
    },
  },

  loginButton: {
    width: '100%',
  },

  noMargin: {
    margin: 0,
  },
}));
