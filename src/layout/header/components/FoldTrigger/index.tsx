import SvgIcon from '@/components/SvgIcon';
import { useAppDispatch, useAppSelector } from '@/stores';
import { setAppConfig } from '@/stores/modules/app';
import classNames from 'classnames';
import { useCallback } from 'react';
import useStyles from './style';

export default function FoldTrigger() {
  const { styles } = useStyles();
  const isMenuFold = useAppSelector((state) => state.app.appConfig?.menuSetting?.menuFold);
  const dispatch = useAppDispatch();

  const toggleMenuFold = useCallback(() => {
    dispatch(setAppConfig({ menuSetting: { menuFold: !isMenuFold } }));
  }, [dispatch, isMenuFold]);

  return (
    <span className={classNames(styles.compoFoldToggle, { unfold: !isMenuFold })} onClick={toggleMenuFold}>
      <SvgIcon name="unfold" size={22} />
    </span>
  );
}
