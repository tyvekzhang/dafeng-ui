import { createStyles } from 'antd-style';

export default createStyles(({ token, css }) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    padding: '4px',
    backgroundColor: '#f5f5f5',
  },
  content: {
    height: '100%',
    flex: 1,
    display: 'grid',
    gap: 2,
    gridTemplateColumns: '3fr 12fr',
  },
  leftContent: {
    display: 'flex',
    gap: 16,
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#fff',
    overflow: 'scroll',
  },
  addBtn: {
    width: '33%',
  },
  rightContent: {
    height: '100%',
    padding: '8px 0 0 8px',
    backgroundColor: '#fff',
  },
}));
