import { Route } from '@/utils';
import React, { ReactNode } from 'react';
import type { LoaderFunction } from 'react-router-dom';

export interface MetaProps {
  title: string;
  key?: string;
  icon?: string;
  affix?: boolean;
  keepAlive?: boolean;
  orderNo?: number;
  hideMenu?: boolean;
  hideChildrenInMenu?: boolean;
}

export interface RouteObject extends Route {
  path?: string;
  fullPath?: string;
  children?: RouteObject[];
  id?: string;
  name?: string;
  loader?: LoaderFunction;
  element?: ReactNode;
  index?: false;
  meta?: MetaProps;
}

export interface AppMenu {
  name: string;
  path: string;
  children?: AppMenu[];
  disabled?: boolean;
  icon?: string;
  affix?: boolean;
  orderNo?: number;
  visible?: number;
  hideChildrenInMenu?: boolean;
  hideBreadcrumb?: boolean;
}

export interface RouteModule {
  default: React.ComponentType;
  [key: string]: unknown;
}
