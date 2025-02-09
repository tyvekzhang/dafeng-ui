import { LazyLoad } from '@/components/LazyLoad';
import { lazy } from '@loadable/component';
import { LayoutGuard } from '../guard';
import type { RouteObject } from '../types';

// component module page
const SystemRoute: RouteObject = {
  path: '/system',
  name: 'System',
  element: <LayoutGuard />,
  meta: {
    title: '系统设置',
    icon: 'system-manage',
    orderNo: 6,
  },
  children: [
    {
      path: 'user',
      name: 'User',
      element: LazyLoad(lazy(() => import('@/views/system/user'))),
      meta: {
        title: '用户管理',
        key: 'userManage',
      },
    },
    {
      path: 'new-word',
      name: 'WordNew',
      element: LazyLoad(lazy(() => import('@/views/system/new-word'))),
      meta: {
        title: '生词管理',
        key: 'wordNew',
      },
    },
    {
      path: 'menu',
      name: 'Menu',
      element: LazyLoad(lazy(() => import('@/views/system/menu'))),
      meta: {
        title: '菜单权限',
        key: 'menu',
      },
    },
    {
      path: 'role',
      name: 'Role',
      element: LazyLoad(lazy(() => import('@/views/system/role'))),
      meta: {
        title: '角色信息',
        key: 'role',
      },
    },
  ],
};

export default SystemRoute;
