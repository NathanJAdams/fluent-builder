export type FindBuildTypeApi<T> =
  [T] extends [never]
  ? BuildType.NotValid
  : FindBuildTypeDistributed<T> extends infer TBuildType
  ? AllUnionMembersAreIdentical<TBuildType> extends true
  ? TBuildType
  : BuildType.NotConsistent
  : never
  ;
export type AllUnionMembersAreIdentical<T> = _AllUnionMembersAreIdentical<T, T>;
type _AllUnionMembersAreIdentical<T, U = T> =
  T extends U
  ? U extends T
  ? true
  : false
  : false
  ;
export type FindValidBuildTypeDistributed<T> =
  [T] extends [never]
  ? never
  : T extends any
  ? FindBuildTypeDistributed<T> extends infer TBuildType
  ? TBuildType extends (BuildType.Array | BuildType.Object | BuildType.Record)
  ? TBuildType
  : never
  : never
  : never
  ;
export type FindBuildTypeDistributed<T> =
  [T] extends [never]
  ? BuildType.NotValid
  : T extends any
  ? IsValid<T> extends false
  ? BuildType.NotValid
  : [T] extends [readonly any[]]
  ? BuildType.Array
  : [T] extends [Record<string, any>]
  ? string extends keyof T
  ? BuildType.Record
  : BuildType.Object
  : BuildType.NotBuildable
  : never
  ;
export enum BuildType {
  NotValid = 'NotValid',
  NotBuildable = 'NotBuildable',
  NotConsistent = 'NotConsistent',
  Array = 'Array',
  Record = 'Record',
  Object = 'Object',
};
export type IsValid<T> =
  [T] extends [never]
  ? false
  : T extends Primitive
  ? false
  : IsIgnored<T> extends true
  ? false
  : true
  ;
export type IsIgnored<T> =
  [T] extends [never]
  ? true
  : T extends null
  ? true
  : T extends undefined
  ? true
  : T extends Function
  ? true
  : keyof T extends never
  ? true
  : IsAny<T> extends true
  ? true
  : IsExact<T, unknown> extends true
  ? true
  : IsEmptyTuple<T> extends true
  ? true
  : false
  ;
type IsAny<T> =
  0 extends (1 & T)
  ? true
  : false
  ;
type IsEmptyTuple<T> =
  T extends []
  ? number extends T['length']
  ? false
  : true
  : false;
export type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  ;
export type IsArray<T> =
  [T] extends [readonly unknown[]]
  ? true
  : false
  ;
export type IsNonUnionArray<T> =
  IsUnion<T> extends true
  ? false
  : T extends readonly unknown[]
  ? true
  : false
  ;
export type IsAllObject<T> =
  IsIgnored<T> extends true
  ? false
  : false extends (
    T extends any
    ? IsIgnored<T> extends true
    ? false
    : [T] extends [Primitive]
    ? false
    : keyof T extends string
    ? string extends keyof T
    ? false
    : true
    : false
    : false
  )
  ? false
  : true
  ;
export type IsRecord<T> =
  [T] extends [Record<string, any>]
  ? string extends keyof T
  ? true
  : false
  : false
  ;
export type IsNonUnionRecord<T> =
  IsUnion<T> extends true
  ? false
  : T extends Record<string, any>
  ? string extends keyof T
  ? true
  : false
  : false
  ;
export type ValueFromKey<T, TKey> =
  [T] extends [never]
  ? never
  : T extends any
  ? IsIgnored<T> extends true
  ? never
  : TKey extends keyof T
  ? Required<T>[TKey]
  : never
  : never
  ;
export type AsArray<T> =
  T extends readonly unknown[]
  ? T
  : never
  ;
export type AsObject<T> =
  T extends any
  ? IsAllObject<T> extends true
  ? T
  : never
  : never
  ;
export type AsRecord<T> =
  T extends Record<string, any>
  ? string extends keyof T
  ? T
  : never
  : never
  ;
export type IsArrayPotentialMatch<T extends readonly any[], TRequired extends readonly any[]> =
  HasArrayRest<T> extends infer THasRest
  ? HasArrayRest<TRequired> extends infer TRequiredHasRest
  ? [THasRest, TRequiredHasRest] extends [false, false]
  ? TRequired extends readonly [...T, ...any[]] ? true : false
  : [THasRest, TRequiredHasRest] extends [false, true]
  ? ArrayFixed<TRequired> extends infer TRequiredFixed
  ? TRequiredFixed extends readonly [...T, ...any[]] ? true : false
  : never
  : [THasRest, TRequiredHasRest] extends [true, false]
  ? ArrayFixed<T> extends infer TFixed
  ? [TFixed, TRequired] extends [TRequired, TFixed] ? true : false
  : never
  : ArrayFixed<T> extends infer TFixed
  ? ArrayFixed<TRequired> extends infer TRequiredFixed
  ? ArrayRest<T> extends infer TRest
  ? ArrayRest<TRequired> extends infer TRequiredRest
  ? [TFixed, TRequiredFixed] extends [TRequiredFixed, TFixed]
  ? [TRest, TRequiredRest] extends [TRequiredRest, TRest]
  ? true
  : false
  : false
  : never
  : never
  : never
  : never
  : never
  : never
  ;
export type IsUnion<T> =
  IsIgnored<T> extends true
  ? false
  : [T] extends [boolean]
  ? false  // treat boolean as non-union (even though it's true | false)
  : _IsUnion<T, T>
  ;
type _IsUnion<TOriginal, TDistributed> =
  TDistributed extends any
  ? [TOriginal] extends [TDistributed]
  ? false
  : true
  : never
  ;
export type IsExact<T, U> =
  [T] extends [U]
  ? [U] extends [T]
  ? true
  : false
  : false
  ;
export type Keys<T> =
  T extends any
  ? IsIgnored<T> extends true
  ? never
  : keyof T
  : never
  ;
export type Values<T, K extends string> =
  T extends any
  ? IsIgnored<T> extends true
  ? never
  : K extends keyof T
  ? T[K]
  : never
  : never
  ;
export type ArrayFixed<T extends readonly any[]> =
  HasArrayRest<T> extends true
  ? _ArrayFixed<T, ArrayLengthWithoutRest<T>>
  : T
  ;
type _ArrayFixed<T extends readonly any[], N extends number> =
  N extends 0
  ? []
  : T extends readonly [infer First, ...infer Rest]
  ? N extends 1
  ? [First]
  : [First, ..._ArrayFixed<Rest, Decrement<N>>]
  : never
  ;
export type ArrayRest<T extends readonly unknown[]> =
  T extends any
  ? number extends T['length']
  ? T[ArrayLengthWithoutRest<T>]
  : never
  : never
  ;
export type HasArrayRest<T extends readonly unknown[]> =
  ArrayRest<T> extends never
  ? false
  : true
  ;
export type ArrayLengthWithoutRest<T extends readonly unknown[]> = _ArrayLengthWithoutRest<T, 0>;
type _ArrayLengthWithoutRest<T extends readonly unknown[], Count extends number> =
  T extends [unknown, ...infer Rest]
  ? _ArrayLengthWithoutRest<Rest, Increment<Count>>
  : Count
  ;
export type Increment<T extends number> = NextIndexes[T];
export type Decrement<T extends number> = PreviousIndexes[T];
type NextIndexes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, never];
type PreviousIndexes = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
export type UnionToIntersection<U> =
  (U extends any ? (x: U) => void : never) extends (x: infer I) => void
  ? I
  : never
  ;
export type RecordValueType<T> =
  T extends Record<string, infer V>
  ? V
  : never
  ;
export type FilterByPartial<T, TPartial> =
  T extends any
  ? TPartial extends Partial<T>
  ? keyof TPartial extends keyof T
  ? T
  : never
  : never
  : never
  ;
export type AsRequiredKeys<T, TPartial> =
  IsPartialSubset<T, TPartial> extends true
  ? Exclude<RequiredKeys<T>, keyof TPartial>
  : never
  ;
type IsPartialSubset<T, TPartial> =
  keyof TPartial extends never
  ? true
  : keyof TPartial extends keyof T
  ? {
    [K in keyof TPartial]:
    TPartial[K] extends T[K]
    ? true
    : false;
  }[keyof TPartial] extends false
  ? false
  : true
  : false
  ;
type RequiredKeys<T> =
  T extends any
  ? {
    [K in keyof T]-?: string extends K
    ? never
    : undefined extends T[K]
    ? never
    : K
  }[keyof T]
  : never
  ;
export type UnusedName<TEntries, TName extends string> =
  TName extends any
  ? TName extends keyof TEntries
  ? never
  : TName
  : never
  ;
