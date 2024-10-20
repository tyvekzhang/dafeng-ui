import React, { memo } from 'react';
import useStyles from './style';

interface SvgIconProp {
  name: string;
  prefix?: string;
  size?: number;
  style?: React.CSSProperties;
}

const defaultProps: Required<Pick<SvgIconProp, 'prefix' | 'size'>> = {
  prefix: 'icon',
  size: 16,
};

const getIconStyle = (size: number, style?: React.CSSProperties) => ({
  width: `${size}px`,
  height: `${size}px`,
  ...style,
});

const SvgIcon: React.FC<SvgIconProp> = memo((props) => {
  const { name, prefix, size, style } = { ...defaultProps, ...props };
  const { styles } = useStyles();

  const symbolId = `#${prefix}-${name}`;
  const iconStyle = getIconStyle(size, style);

  return (
    <svg className={styles.svgIcon} style={iconStyle}>
      <use href={symbolId} />
    </svg>
  );
});

export default SvgIcon;
