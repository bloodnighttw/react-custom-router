import { match , type MatchFunction } from "path-to-regexp";

// Utility type to extract parameter names from route strings

type MatchParams<T extends string> = T extends `:${infer Param}`
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

type WildcardParams<T extends string> = T extends `*${infer Param}`
  ? Param
  : never;

type ExtrachWildcard<T extends string> =
  T extends `${infer Start}{${infer _MID}}${infer Rest}`
    ? ExtrachWildcard<Rest> | WildcardParams<Start>
    : T extends `${infer Start}/${infer Rest}`
    ? ExtrachWildcard<Rest> | WildcardParams<Start>
    : WildcardParams<T>;

export type RouterParams<T extends string> = {
  [K in
    | ExtractMatch<T>
    | ExtrachWildcard<T>
    | ExtractOptionalMatch<T>
    | ExtractOptionalWildcard<T>
  ]: K extends ExtrachWildcard<T>
    ? string[]
    : K extends ExtractOptionalWildcard<T>
    ? string[] | undefined
    : K extends ExtractMatch<T>
    ? string
    : string | undefined;
};

const str = ":asd{/:ssss}/asd/*arr1/asd/*arr2" as const;
const b = "/:id{/:aaa}";
type A = ExtractMatch<typeof str>;
type B = ExtrachWildcard<typeof str>;
type C = RouterParams<typeof str>;
type D = ExtractOptionalMatch<typeof b>;
type E = RouterParams<typeof b>;

interface RouteProp<T extends string> {
  path: T;
  component: React.ComponentType;
  sensitive?: boolean; // Optional, default is false
}

export interface Router<T extends string = string> {
  matchFn: MatchFunction<Partial<Record<string, string | string[]>>>;
  component: React.ComponentType;
  _path?: T; // Optional path for internal use
}

export function createStaticRouter<T extends string>(
  props: RouteProp<T>
): Router<T> {
  const matchFn = match(props.path, { sensitive: props.sensitive });

  return {
    matchFn: matchFn,
    component: props.component,
  };
}

export function useParams<T extends string>(
  router: Router<T>
): RouterParams<T> {
  const match = router.matchFn(window.location.pathname);
  if (!match) {
    throw new Error(`No match found for paath: ${window.location.pathname}`);
  }
  return match.params as RouterParams<T>;
}