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
    gap: 4,
    gridTemplateColumns: '3fr 11fr',
  },
  leftContent: {
    display: 'flex',
    gap: 16,
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#fff',
    overflow: 'scroll'
  },
  addBtn: {
    width: '33%',
  },
  button: css`
    #root & {
      &.btn-add {
        background-color: #f6ffed;
        color: #52c41a;

        &:hover {
          background-color: #73d13d;
          color: #fff;
          border: none;
        }
      }
      &.btn-import {
        background-color: #fcffe6;
        color: #7cb305;

        &:hover {
          background-color: #bae637;
          color: #fff;
          border: none;
        }
      }

      &.btn-export {
        background-color: #f5f5f5ff;
        color: #8c8c8c;

        &:hover {
          background-color: #8c8c8c;
          color: #fff;
          border: none;
        }
      }

      &.btn-delete {
        background-color: #fff2e8;
        color: #fa541c;

        &:hover {
          background-color: #ff7a45;
          color: #fff;
          border: none;
        }
      }

      &.btn-batch-update {
        background-color: #e6f4ff;
        color: #4096ff;

        &:hover {
          background-color: #4096ff;
          color: #fff;
          border: none;
        }
      }
    }
  `,
  rightContent: {
    height: '100%',
    padding: '8px 0 0 8px',
    backgroundColor: '#fff',
  },
}));
