import { compile } from "path-to-regexp";
import type { Router, RouterData, RouterParams } from "./router";

export let CACHE_PARAMS: unknown = {};

export function setParamsCache<T extends string>(
  params: RouterParams<T>
): void {
  CACHE_PARAMS = params;
}

export const CACHE_ROUTER_FUNCTION = new WeakMap();
export const CACHE_TO_PATH_ROUTER_FUNCTION = new WeakMap<
  Router,
  (data?: Partial<Record<string, string | string[]>> | undefined) => string
>();

export function initRouterFunctionWithCache<T extends string>(
  fn: Router<T>
): RouterData<T> {
  if (CACHE_ROUTER_FUNCTION.has(fn)) {
    return CACHE_ROUTER_FUNCTION.get(fn) as RouterData<T>;
  }
  const result = fn();
  const path = result.path;
  const toPath = compile(path);
  CACHE_TO_PATH_ROUTER_FUNCTION.set(fn, toPath);

  CACHE_ROUTER_FUNCTION.set(fn, result);
  return result;
}

export function runToPathWithCache<T extends string>(
  fn: Router<T>,
  params: RouterParams<T>
): string {
  if (CACHE_TO_PATH_ROUTER_FUNCTION.has(fn)) {
    const cacheFn = CACHE_TO_PATH_ROUTER_FUNCTION.get(fn)!;
    return cacheFn(params);
  }

  initRouterFunctionWithCache(fn);
  const toPath = CACHE_TO_PATH_ROUTER_FUNCTION.get(fn)!;
  return toPath(params);
}
