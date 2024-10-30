import { ExceptionEnum } from '@/enums/exceptionEnum';
import PageException from '@/views/exception';
import LoginPage from '@/views/login';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { genFullPath } from './helpers';
import type { RouteModule, RouteObject } from './types';

const metaRoutes: Record<string, RouteModule> = import.meta.glob('./routes/*.tsx', { eager: true });

const routeList: RouteObject[] = [];

Object.keys(metaRoutes).forEach((key) => {
  const module = metaRoutes[key].default || {};
  const moduleList = Array.isArray(module) ? [...module] : [module];
  genFullPath(moduleList);
  routeList.push(...moduleList);
});

const rootRoutes: RouteObject[] = [
  {
    path: '/',
    name: 'Home',
    element: <Navigate to="/home" />,
  },
  {
    path: '/login',
    name: 'Login',
    element: <LoginPage />,
    meta: {
      title: '登录页',
      key: 'login',
    },
  },
  ...routeList,
  {
    path: '*',
    name: 'RedirectTo',
    element: <Navigate to="/404" />,
  },
  {
    path: '/403',
    name: 'PageNotAuth',
    element: <PageException />,
    loader: () => ({ status: ExceptionEnum.PAGE_NOT_ACCESS, withCard: false }),
  },
  {
    path: '/404',
    name: 'PageNotFound',
    element: <PageException />,
    loader: () => ({ status: ExceptionEnum.PAGE_NOT_FOUND, withCard: false }),
  },
];

export { routeList as basicRoutes };

const router = createBrowserRouter(rootRoutes);
export default router;
