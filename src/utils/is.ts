export function is(val: unknown, type: string) {
  return Object.prototype.toString.call(val) === `[object ${type}]`;
}

export function isObject(val: unknown): val is unknown {
  return val !== null && typeof val === 'object';
}

export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined';
}

export function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val);
}

export function isNull(val: unknown): val is null {
  return val === null;
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val);
}

export function isUrl(path: string): boolean {
  const reg = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
  return reg.test(path);
}

export function isString(val: unknown): val is string {
  return is(val, 'String');
}

export const isServer = typeof window === 'undefined';

export const isClient = !isServer;
