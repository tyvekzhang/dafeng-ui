import type { AppMenu } from '../types';
import { dynamicMenu } from '@/api';

export async function getAsyncMenus(): Promise<AppMenu[]> {
  const staticMenus =  await dynamicMenu()
  console.log(JSON.stringify(staticMenus));
  staticMenus.sort((a: AppMenu, b: AppMenu) => {
    return (a?.orderNo ?? Infinity) - (b?.orderNo ?? Infinity);
  });

  return staticMenus.filter((item: AppMenu) => !item.hideMenu);
}
