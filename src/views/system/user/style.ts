import { createStyles } from 'antd-style';

export default createStyles(({ css }) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 4,
  },
  searchContainer: {
    width: '100%',
    borderBottom: '1px solid #0505050F',
  },
  searchContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  searchOperation: {
    marginLeft: 'auto',
  },
  resultContainer: {
    width: '100%',
  },
  resultSearch: {
    display: 'flex',
    width: '100%',
    padding: '16px 0 0 24px',
    backgroundColor: '#fff',
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
        color: #a0d911;

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
    }
  `,
}));
