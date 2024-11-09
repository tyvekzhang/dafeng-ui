import { REMEMBER_KEY, TOKEN_KEY } from '@/enums/cacheEnum';
import { AuthCacheValue } from '@/stores/types';
import { Token } from '@/types/user';
import { isNullOrUnDef } from '@/utils/is';
import { Persistent, type BasicKeys } from './cache/persistent';

export function getCacheToken() {
  const rememberMe = getAuthCache<boolean>(true, REMEMBER_KEY);
  if (!isNullOrUnDef(rememberMe)) {
    return getAuthCache<Token>(rememberMe, TOKEN_KEY);
  }
  return null;
}

export function getAuthCache<T>(isLocal: boolean, key: BasicKeys) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
  return fn(key) as T;
}

export function setAuthCache(isLocal: boolean, key: BasicKeys, value: AuthCacheValue) {
  const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
  return fn(key, value);
}

export function clearAuthCache(isLocal: boolean) {
  const fn = isLocal ? Persistent.clearLocal : Persistent.clearSession;
  return fn();
}

export function clearAllAuthCache() {
  clearAuthCache(true);
  clearAuthCache(false);
}
