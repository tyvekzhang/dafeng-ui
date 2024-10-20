import { CacheTypeEnum, TOKEN_KEY } from '@/enums/cacheEnum';
import { appSetting } from '@/settings/appBaseSetting';
import { AuthCacheValue } from '@/stores/types';
import { Persistent, type BasicKeys } from './cache/persistent';

const { permissionCacheType } = appSetting;
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL;

export function getToken() {
  return getAuthCache(TOKEN_KEY);
}

export function getAuthCache<T>(key: BasicKeys) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
  return fn(key) as T;
}

export function setAuthCache(key: BasicKeys, value: AuthCacheValue) {
  const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
  return fn(key, value, true);
}

export function clearAuthCache(immediate = true) {
  const fn = isLocal ? Persistent.clearLocal : Persistent.clearSession;
  return fn(immediate);
}
