import { createStyles } from 'antd-style';

export default createStyles(({ css }) => ({
  compoFoldToggle: css`
    display: flex;
    align-items: center;
    height: 48px;
    cursor: pointer;

    &.unfold {
      svg {
        transform: scaleX(-1);
        transition: transform 0.1s;
      }
    }
  `,
}));
