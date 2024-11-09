import type { RouteObject } from '@/router/types';

import {
  type APP_CONFIG_KEY,
  type APP_TAGS_KEY,
  type TOKEN_KEY,
  type USER_INFO_KEY,
  APP_LOCAL_CACHE_KEY,
  APP_SESSION_CACHE_KEY,
  REMEMBER_KEY,
} from '@/enums/cacheEnum';

import type { UserInfo } from '@/types';
import type { AppConfig } from '@/types/config';
import { Token } from '@/types/user';
import { createLocalStorage, createSessionStorage } from '@/utils/cache';

interface BasicStore {
  [TOKEN_KEY]: string | number | null | undefined | Token | boolean;
  [USER_INFO_KEY]: UserInfo;
  [APP_CONFIG_KEY]: AppConfig;
  [APP_TAGS_KEY]: RouteObject[];
  [REMEMBER_KEY]: string;
}

type Nullable<T> = T | null | undefined;

type LocalStore = BasicStore;
type SessionStore = BasicStore;

export type BasicKeys = keyof BasicStore;
type LocalKeys = keyof LocalStore;
type SessionKeys = keyof SessionStore;

const ls = createLocalStorage();
const ss = createSessionStorage();

export class Persistent {
  static getLocal<T>(key: LocalKeys) {
    const cacheResult = ls.get(key);
    if (cacheResult === null) {
      return cacheResult as Nullable<T>;
    }
    if (cacheResult.value) {
      return cacheResult.value as Nullable<T>;
    }
    return cacheResult as Nullable<T>;
  }

  static setLocal(key: LocalKeys, value: LocalStore[LocalKeys]): void {
    ls.set(key, value);
  }

  static removeLocal(key: LocalKeys): void {
    ls.remove(key);
  }

  static clearLocal(): void {
    ls.clear();
  }

  static getSession<T>(key: SessionKeys) {
    const cacheResult = ss.get(key);
    if (cacheResult === null) {
      return cacheResult as Nullable<T>;
    }
    if (cacheResult.value) {
      return cacheResult.value as Nullable<T>;
    }
    return cacheResult as Nullable<T>;
  }

  static setSession(key: SessionKeys, value: SessionStore[SessionKeys]): void {
    ss.set(key, value);
  }

  static removeSession(key: SessionKeys): void {
    ss.remove(key);
  }

  static clearSession(): void {
    ss.clear();
  }

  static clearAll() {
    ss.clear();
    ls.clear();
  }
}

function storageChange(e: any) {
  const { key, newValue, oldValue } = e;

  if (!key) {
    Persistent.clearAll();
    return;
  }

  if (!!newValue && !!oldValue) {
    if (APP_LOCAL_CACHE_KEY === key) {
      Persistent.clearLocal();
    }
    if (APP_SESSION_CACHE_KEY === key) {
      Persistent.clearSession();
    }
  }
}

window.addEventListener('storage', storageChange);
