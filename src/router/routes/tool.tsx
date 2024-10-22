import { LazyLoad } from '@/components/LazyLoad';
import { lazy } from '@loadable/component';
import { LayoutGuard } from '../guard';
import type { RouteObject } from '../types';

// component module page
const ToolRoute: RouteObject = {
  path: '/tool',
  name: 'Tool',
  element: <LayoutGuard />,
  meta: {
    title: '工具箱',
    icon: 'tool',
    orderNo: 8,
  },
  children: [
    {
      path: 'code',
      name: 'Code',
      element: LazyLoad(lazy(() => import('@/views/tool/code_gen'))),
      meta: {
        title: '代码生成',
        key: 'code',
      },
    },
  ],
};

export default ToolRoute;
