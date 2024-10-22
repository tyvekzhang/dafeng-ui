import { LayoutGuard } from '../guard';
import type { RouteObject } from '../types';

// component module page
const MonitorRoute: RouteObject = {
  path: '/monitor',
  name: 'Monitor',
  element: <LayoutGuard />,
  meta: {
    title: '系统监控',
    icon: 'monitor',
    orderNo: 10,
  },
};

export default MonitorRoute;
