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
  ],
};

export default SystemRoute;
