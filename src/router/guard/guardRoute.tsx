import { TOKEN_KEY } from '@/enums/cacheEnum';
import { useAppSelector } from '@/stores';
import { getAuthCache } from '@/utils/auth';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const GuardRoute = ({ children }: { children: ReactNode }) => {
  const whiteList: string[] = ['/', '/home', '/login'];
  const { pathname } = useLocation();
  const { token } = useAppSelector((state) => state.user);
  const getToken = (): string => {
    return token || getAuthCache<string>(TOKEN_KEY);
  };

  if (!getToken()) {
    if (whiteList.includes(pathname)) {
      return <Navigate to="/login" replace />;
    } else {
      return <Navigate to={`/login?redirect=${pathname}`} replace />;
    }
  }

  return children;
};
