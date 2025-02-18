import { userMenus } from '@/service/user';
import type { AppMenu } from '../types';

export async function getAsyncMenus(): Promise<AppMenu[]> {
  const staticMenus = await userMenus();
  staticMenus.sort((a: AppMenu, b: AppMenu) => {
    return (a?.orderNo ?? Infinity) - (b?.orderNo ?? Infinity);
  });
  return staticMenus.filter((item: AppMenu) => item.visible === 1);
}
