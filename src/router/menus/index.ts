import { userMenu } from '@/services';
import type { AppMenu } from '../types';

export async function getAsyncMenus(): Promise<AppMenu[]> {
  const staticMenus = await userMenu();
  staticMenus.sort((a: AppMenu, b: AppMenu) => {
    return (a?.orderNo ?? Infinity) - (b?.orderNo ?? Infinity);
  });

  return staticMenus.filter((item: AppMenu) => !item.hideMenu);
}
