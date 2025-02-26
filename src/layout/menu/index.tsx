import SvgIcon from '@/components/SvgIcon';
import { getAsyncMenus } from '@/router/menus';
import type { AppMenu } from '@/router/types';
import { setMenuList } from '@/stores/modules/menu';
import { getOpenKeys } from '@/utils/helper/menuHelper';
import type { MenuProps } from 'antd';
import { Menu, Spin } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/stores';
import { setDictData } from '@/stores/modules/dict';
import { fetchAllDictData } from '@/service/dict-data';

type MenuItem = Required<MenuProps>['items'][number];

const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem => {
  return {
    label,
    key,
    icon,
    children,
    type,
  } as MenuItem;
};

const LayoutMenu = memo((props: any) => {
  const { pathname } = useLocation();
  const { setMenuList: setMenuListAction } = props;
  const [loading, setLoading] = useState(false);
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname]);

  useEffect(() => {
    setSelectedKeys([pathname]);

    setOpenKeys(getOpenKeys(pathname));
  }, [pathname]);

  const addIcon = (icon?: string) => {
    if (!icon) return null;
    return (
      <span className="scicon">
        <SvgIcon name={icon} size={16} />
      </span>
    );
  };

  const getMenuItem = (data: AppMenu[], list: MenuItem[] = []) => {
    data.forEach((item: AppMenu) => {
      if (!item?.children?.length) {
        return list.push(getItem(item.name, item.path, addIcon(item.icon)));
      }
      list.push(getItem(item.name, item.path, addIcon(item.icon), getMenuItem(item.children)));
    });
    return list;
  };

  const dispatch = useAppDispatch()
  const { dictData } = useAppSelector((state) => state.dict);

  const getMenuList = async () => {
    setLoading(true);
    try {
      const menus = await getAsyncMenus();
      setMenuList(getMenuItem(menus));
      setMenuListAction(menus);
      if (dictData === undefined || JSON.stringify(dictData) === '{}' ) {
        const resp = await fetchAllDictData()
        if (resp) {
          dispatch(setDictData(resp));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMenuList();
  }, []);

  const handleOpenChange: MenuProps['onOpenChange'] = (keys: string[]) => {
    if (keys.length === 0 || keys.length === 1) return setOpenKeys(keys);
    const latestKey = keys[keys.length - 1];
    if (latestKey.includes(keys[0])) return setOpenKeys(keys);
    setOpenKeys([latestKey]);
  };

  const navigate = useNavigate();
  const handleMenuClick: MenuProps['onClick'] = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <div>
      <Spin spinning={loading}>
        <Menu
          theme="dark"
          mode="inline"
          triggerSubMenuAction="click"
          inlineIndent={20}
          subMenuOpenDelay={0.2}
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          items={menuList}
          onClick={handleMenuClick}
          onOpenChange={handleOpenChange}
        />
      </Spin>
    </div>
  );
});

const mapStateToProps = (state: any) => state.menu;
const mapDispatchToProps = { setMenuList };

export default connect(mapStateToProps, mapDispatchToProps)(LayoutMenu);
