export type IsExact<T, U> =
  [T] extends [U]
  ? [U] extends [T]
  ? true
  : false
  : false;

export type ArrayDimensions<T> = _ArrayDimensions<T>;
type _ArrayDimensions<T, _Depth extends any[] = []> =
  T extends readonly (infer Inner)[]
  ? _ArrayDimensions<Inner, [unknown, ..._Depth]>
  : _Depth['length'];

export type IsSingleLevelArray<T> =
  ArrayDimensions<T> extends 1
  ? true
  : false;

export type ArrayElementType<T> = T extends (infer U)[] ? U : never;

export type RecordValueType<T> = T extends Record<string, infer V> ? V : never;

export type HasOnlyIndexSignature<T> =
  keyof T extends string | number
  ? string extends keyof T
  ? true
  : number extends keyof T
  ? true
  : false
  : false;

export type IsUserType<T> =
  T extends object
  ? keyof T extends never
  ? false
  : T extends Function | any[]
  ? false
  : HasOnlyIndexSignature<T> extends true
  ? false
  : true
  : false;

export type IsABaseType<TSubTypes extends readonly SubTypeInfo<any, any, any>[], T> =
  TSubTypes extends readonly [infer Head, ...infer Tail]
  ? Head extends SubTypeInfo<infer TBase, any, any>
  ? IsExact<T, TBase> extends true
  ? true
  : Tail extends readonly SubTypeInfo<any, any, any>[]
  ? IsABaseType<Tail, T>
  : false
  : false
  : false;

export type IsANonBaseUserType<TSubTypes extends readonly SubTypeInfo<any, any, any>[], T> =
  IsABaseType<TSubTypes, T> extends true
  ? false
  : IsUserType<T>;

export type RequiredKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K
}[keyof T];

export type HasRequiredKeys<TSchema, TPartial extends Partial<TSchema>> = Exclude<RequiredKeys<TSchema>, keyof TPartial> extends never ? false : true;

export type SubTypeInfo<
  TBase extends Record<string, any>,
  TSubUnion extends TBase,
  TDiscriminator extends keyof TBase & string
> = {
  __base: TBase;
  __subunion: TSubUnion;
  __discriminator: TDiscriminator;
};

export type FindExactSubTypeInfo<
  TSubTypes extends readonly SubTypeInfo<any, any, any>[],
  TType
> =
  TSubTypes extends readonly [infer Head, ...infer Tail]
  ? Head extends SubTypeInfo<infer TBase, infer TSubUnion, infer TDiscriminator>
  ? IsExact<TType, TBase> extends true
  ? SubTypeInfo<TBase, TSubUnion, TDiscriminator>
  : Tail extends readonly SubTypeInfo<any, any, any>[]
  ? FindExactSubTypeInfo<Tail, TType>
  : never
  : never
  : never;

export type Builder<TBuilt, TBuildSuffix extends string> =
  & {
    build: () => TBuilt;
  }
  & {
    [K in `build${Capitalize<TBuildSuffix>}`]: () => TBuilt;
  };
