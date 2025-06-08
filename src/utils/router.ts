import { match, type MatchFunction } from "path-to-regexp";

// Utility type to extract parameter names from route strings

type MatchParams<T extends string> = T extends `${infer _Begin}:${infer Param}`
  ? Param
  : never;

type ExtractOptionalMatch<T extends string> =
  T extends `${infer _Begin}{${infer Param}}${infer Rest}`
    ? ExtractMatch<Param> | ExtractOptionalMatch<Rest>
    : never;

type ExtractOptionalWildcard<T extends string> =
  T extends `${infer _Begin}{${infer Param}}${infer Rest}`
    ? ExtrachWildcard<Param> | ExtractOptionalMatch<Rest>
    : never;

type ExtractMatch<T extends string> =
  T extends `${infer Start}{${infer _MID}}${infer Rest}`
    ? ExtractMatch<Rest> | ExtractMatch<Start>
    : T extends `${infer Start}/${infer Rest}`
    ? ExtractMatch<Rest> | MatchParams<Start>
    : MatchParams<T>;

type WildcardParams<T extends string> =
  T extends `${infer _Begin}*${infer Param}` ? Param : never;

type ExtrachWildcard<T extends string> =
  T extends `${infer Start}{${infer _MID}}${infer Rest}`
    ? ExtrachWildcard<Rest> | WildcardParams<Start>
    : T extends `${infer Start}/${infer Rest}`
    ? ExtrachWildcard<Rest> | WildcardParams<Start>
    : WildcardParams<T>;

export type RouterParams<T extends string> = {
  [K in ExtractMatch<T> | ExtrachWildcard<T>]: K extends ExtrachWildcard<T>
    ? string[]
    : string;
} & {
  [K in
    | ExtractOptionalMatch<T>
    | ExtractOptionalWildcard<T>]?: K extends ExtractOptionalWildcard<T>
    ? string[]
    : string;
};

interface RouteProp<T extends string> {
  path: T;
  component: React.ComponentType;
  sensitive?: boolean; // Optional, default is false
}

export interface RouterData<T extends string> {
  matchFn: MatchFunction<Partial<Record<string, string | string[]>>>;
  component: React.ComponentType;
  path: T; // Optional path for internal use
}

export type Router<T extends string = string> = () => RouterData<T>;

export function createStaticRouter<T extends string>(
  props: RouteProp<T>
): RouterData<T> {
  const matchFn = match(props.path, { sensitive: props.sensitive });

  return {
    path: props.path,
    matchFn: matchFn,
    component: props.component,
  };
}

let paramsCache: unknown = {};

export function setParamsCache<T extends string>(
  params: RouterParams<T>
): void {
  paramsCache = params;
}

type RouterPath<T extends Router> = T extends () => RouterData<infer P>
  ? P
  : never;

export function useParams<T extends Router>(): RouterParams<RouterPath<T>> {
  return paramsCache as RouterParams<RouterPath<T>>;
}
