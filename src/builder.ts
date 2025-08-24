export type Builder<TBuilt, TBuildSuffix extends string> =
  & {
    build: () => Clean<TBuilt>;
  }
  & {
    [K in `build${Capitalize<TBuildSuffix>}`]: () => Clean<TBuilt>;
  }
  ;
type Clean<T> =
  { [K in keyof T]: T[K] } extends infer TCleaned
  ? {
    [K in keyof TCleaned]: TCleaned[K]
  }
  : never
  ;
