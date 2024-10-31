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
  },
  searchOperation: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  resultContainer: {
    width: '100%',
  },
  resultSearch: {
    margin: '0 0 16px 0',
  },
  button: css`
    #root & {
      &.btn-add {
        background-color: #fcffe6;
        color: #a0d911;

        &:hover {
          background-color: #bae637;
          color: #fff;
          border: none;
        }
      }

      &.btn-import {
        background-color: #f6ffed;
        color: #52c41a;

        &:hover {
          background-color: #73d13d;
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
