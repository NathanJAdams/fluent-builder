import { ObjectOrRecordKey } from './utility-types';

export type Builder<TBuilt, TBuildSuffix extends ObjectOrRecordKey> =
  & {
    build: () => Clean<TBuilt>;
  }
  & {
    [K in `build${TBuildSuffix extends string ? Capitalize<TBuildSuffix> : TBuildSuffix}`]: () => Clean<TBuilt>;
  }
  ;
type Clean<T> =
  { [K in keyof T]: T[K] } extends infer TCleaned
  ? {
    [K in keyof TCleaned]: TCleaned[K]
  }
  : never
  ;
