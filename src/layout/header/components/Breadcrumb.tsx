import { useAppSelector } from '@/stores';
import { Breadcrumb } from 'antd';
import { useEffect, useState } from 'react';
import { matchRoutes, useLocation } from 'react-router-dom';

export default function LayoutBreadcrumb() {
  const [breadcrumbs, setBreadcrumbs] = useState<any[]>([]);
  const { pathname } = useLocation();
  const getMenuList = useAppSelector((state) => state.menu.menuList);

  useEffect(() => {
    const matchRouteList = matchRoutes(getMenuList, pathname) || [];
    const breadcrumbList = matchRouteList.map((item: any) => {
      const { name } = item?.route ?? '';
      return {
        title: (
          <>
            <span>{name}</span>
          </>
        ),
      };
    });
    setBreadcrumbs(breadcrumbList);
  }, [pathname]);

  return (
    <div className="flex-center-v" style={{ padding: '0 16px' }}>
      <Breadcrumb items={breadcrumbs} />
    </div>
  );
}
