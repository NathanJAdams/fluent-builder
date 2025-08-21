type IsAny<T> = 0 extends (1 & T) ? true : false;
type IsUnknown<T> = unknown extends T ? (T extends unknown ? true : false) : false;
type IsEmpty<T> =
  [keyof T] extends [never]
  ? ([T] extends [{}] ? true : false)
  : false;
type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined;
export type IsValid<T> =
  [T] extends [never]
  ? false
  : T extends Primitive
  ? false
  : T extends Function
  ? false
  : IsAny<T> extends true
  ? false
  : IsUnknown<T> extends true
  ? false
  : IsEmpty<T> extends true
  ? false
  : true;

type NextTupleIndexes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, never];
export type NextTupleIndex<T extends number> = NextTupleIndexes[T];
export type IsTuple<T> =
  IsAny<T> extends true
  ? false
  : T extends readonly unknown[]
  ? number extends T['length']
  ? false
  : T['length'] extends number
  ? T extends readonly [...infer Elements]
  ? Elements['length'] extends T['length']
  ? true
  : false
  : false
  : false
  : false;
export type TupleLength<T extends readonly any[]> = T['length'];
export type IsExact<T, U> =
  [T] extends [U]
  ? [U] extends [T]
  ? true
  : false
  : false;

export type ArrayElementType<T> = T extends (infer U)[] ? U : never;

export type RecordValueType<T> = T extends Record<PropertyKey, infer V> ? V : never;

export type Keys<T> = T extends any ? keyof T : never;

export type Values<T, K extends string> = T extends any
  ? K extends keyof T
  ? T[K]
  : never
  : never;

export type FilterByPartial<T, TPartial> = T extends any
  ? TPartial extends Partial<T>
  ? keyof TPartial extends keyof T
  ? T
  : never
  : never
  : never;

export type HasOnlyIndexSignature<T> =
  keyof T extends string
  ? string extends keyof T
  ? true
  : false
  : false;

export type IsNonBaseUserType<TUnionRegistry extends readonly UnionMetadata<any, any>[], T> =
  AsUnionMetadata<TUnionRegistry, T> extends never
  ? T extends object
  ? keyof T extends never
  ? false
  : T extends Function | any[]
  ? false
  : HasOnlyIndexSignature<T> extends true
  ? false
  : true
  : false
  : false;

export type UnusedKeys<TSchema, TPartial extends Partial<TSchema>> = string & Exclude<keyof TSchema, keyof TPartial>;

export type UnusedName<TEntries extends Record<string, any>, TName extends string> = TName extends keyof TEntries ? never : TName;

type RequiredKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K
}[keyof T];
type IsPartialSubset<T, TPartial> =
  keyof TPartial extends never
  ? true
  : keyof TPartial extends keyof T
  ? {
    [K in keyof TPartial]: TPartial[K] extends T[K] ? true : false;
  }[keyof TPartial] extends false
  ? false
  : true
  : false;
export type AsRequiredKeys<TUnion, TPartial extends Partial<TUnion>> =
  TUnion extends any
  ? IsPartialSubset<TUnion, TPartial> extends true
  ? Exclude<RequiredKeys<TUnion>, keyof TPartial>
  : never
  : never;

export type UnionMetadata<
  TBase,
  TUnion extends TBase
> = {
  __base: TBase;
  __union: TUnion;
};

export type AsUnionMetadata<
  TUnionRegistry extends readonly UnionMetadata<any, any>[],
  TType
> =
  TUnionRegistry extends readonly [infer Head, ...infer Tail]
  ? Head extends UnionMetadata<infer TBase, infer TUnion>
  ? IsExact<TType, TBase> extends true
  ? UnionMetadata<TBase, TUnion>
  : Tail extends readonly UnionMetadata<any, any>[]
  ? AsUnionMetadata<Tail, TType>
  : never
  : never
  : never;

type Clean<T> = { [K in keyof T]: T[K] } extends infer TCleaned
  ? { [K in keyof TCleaned]: TCleaned[K] }
  : never;

export type Builder<TBuilt, TBuildSuffix extends string> =
  & {
    build: () => Clean<TBuilt>;
  }
  & {
    [K in `build${Capitalize<TBuildSuffix>}`]: () => Clean<TBuilt>;
  };
