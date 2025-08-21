import { ArrayBuilder } from './array-builder';
import { RecordBuilder } from './record-builder';
import { SubTypeBuilder } from './sub-type-builder';
import { ARRAY_SUFFIX, INSTANCE_SUFFIX, RECORD_SUFFIX, SUB_TYPE_SUFFIX, TUPLE_SUFFIX } from './suffixes';
import { TupleBuilder } from './tuple-builder';
import { ArrayElementType, AsRequiredKeys, AsUnionMetadata, Builder, HasOnlyIndexSignature, IsArray, IsNonBaseUserType, IsTuple, RecordValueType, UnionMetadata, UnusedKeys } from './utility-types';

type InstanceBuilderValue<TUnionRegistry extends readonly UnionMetadata<any, any>[], TSchema, TPartial extends Partial<TSchema>, TFinal, TBuildSuffix extends string> = {
  [K in UnusedKeys<TSchema, TPartial>]:
  (value: TSchema[K]) =>
    PartialInstanceBuilder<
      TUnionRegistry,
      TSchema,
      TPartial & { [P in K]: TSchema[K] },
      TFinal,
      TBuildSuffix
    >;
};

type InstanceBuilderArray<TUnionRegistry extends readonly UnionMetadata<any, any>[], TSchema, TPartial extends Partial<TSchema>, TFinal, TBuildSuffix extends string> = {
  [K in UnusedKeys<TSchema, TPartial> as IsArray<TSchema[K]> extends true ? `${K}${typeof ARRAY_SUFFIX}` : never]:
  () =>
    ArrayBuilder<
      TUnionRegistry,
      ArrayElementType<TSchema[K]>,
      PartialInstanceBuilder<
        TUnionRegistry,
        TSchema,
        TPartial & { [P in K]: TSchema[K] },
        TFinal,
        TBuildSuffix
      >,
      K
    >;
};

type InstanceBuilderRecord<TUnionRegistry extends readonly UnionMetadata<any, any>[], TSchema, TPartial extends Partial<TSchema>, TFinal, TBuildSuffix extends string> = {
  [K in UnusedKeys<TSchema, TPartial> as HasOnlyIndexSignature<Required<TSchema>[K]> extends true ? `${K}${typeof RECORD_SUFFIX}` : never]:
  () =>
    RecordBuilder<
      TUnionRegistry,
      RecordValueType<TSchema[K]>,
      PartialInstanceBuilder<
        TUnionRegistry,
        TSchema,
        TPartial & { [P in K]: TSchema[K] },
        TFinal,
        TBuildSuffix
      >,
      K
    >
};

type InstanceBuilderSubType<TUnionRegistry extends readonly UnionMetadata<any, any>[], TSchema, TPartial extends Partial<TSchema>, TFinal, TBuildSuffix extends string> = {
  [K in UnusedKeys<TSchema, TPartial> as AsUnionMetadata<TUnionRegistry, Required<TSchema>[K]> extends never ? never : `${K}${typeof SUB_TYPE_SUFFIX}`]:
  AsUnionMetadata<TUnionRegistry, Required<TSchema>[K]> extends UnionMetadata<infer TBase, infer TUnion>
  ? () =>
    SubTypeBuilder<
      TUnionRegistry,
      TBase,
      TUnion,
      PartialInstanceBuilder<
        TUnionRegistry,
        TSchema,
        TPartial & { [P in K]: TSchema[K] },
        TFinal,
        TBuildSuffix
      >,
      K
    >
  : never;
};

type InstanceBuilderInstance<TUnionRegistry extends readonly UnionMetadata<any, any>[], TSchema, TPartial extends Partial<TSchema>, TFinal, TBuildSuffix extends string> = {
  [K in UnusedKeys<TSchema, TPartial> as IsNonBaseUserType<TUnionRegistry, Required<TSchema>[K]> extends true ? `${K}${typeof INSTANCE_SUFFIX}` : never]:
  () =>
    InstanceBuilder<
      TUnionRegistry,
      Required<TSchema>[K],
      PartialInstanceBuilder<
        TUnionRegistry,
        TSchema,
        TPartial & { [P in K]: TSchema[K] },
        TFinal,
        TBuildSuffix
      >,
      K
    >
};

type InstanceBuilderTuple<TUnionRegistry extends readonly UnionMetadata<any, any>[], TSchema, TPartial extends Partial<TSchema>, TFinal, TBuildSuffix extends string> = {
  [K in UnusedKeys<TSchema, TPartial> as IsTuple<Required<TSchema>[K]> extends true ? `${K}${typeof TUPLE_SUFFIX}` : never]:
  () =>
    TupleBuilder<
      TUnionRegistry,
      Required<TSchema>[K] extends readonly any[] ? Required<TSchema>[K] : never,
      PartialInstanceBuilder<
        TUnionRegistry,
        TSchema,
        TPartial & { [P in K]: TSchema[K] },
        TFinal,
        TBuildSuffix
      >,
      K
    >
};

export type PartialInstanceBuilder<
  TUnionRegistry extends readonly UnionMetadata<any, any>[],
  TSchema,
  TPartial extends Partial<TSchema>,
  TFinal,
  TBuildSuffix extends string
> =
  & (AsRequiredKeys<TSchema, TPartial> extends never ? Builder<TFinal, TBuildSuffix> : object)
  & InstanceBuilderValue<TUnionRegistry, TSchema, TPartial, TFinal, TBuildSuffix>
  & InstanceBuilderArray<TUnionRegistry, TSchema, TPartial, TFinal, TBuildSuffix>
  & InstanceBuilderRecord<TUnionRegistry, TSchema, TPartial, TFinal, TBuildSuffix>
  & InstanceBuilderSubType<TUnionRegistry, TSchema, TPartial, TFinal, TBuildSuffix>
  & InstanceBuilderInstance<TUnionRegistry, TSchema, TPartial, TFinal, TBuildSuffix>
  & InstanceBuilderTuple<TUnionRegistry, TSchema, TPartial, TFinal, TBuildSuffix>
  ;

export type InstanceBuilder<
  TUnionRegistry extends readonly UnionMetadata<any, any>[],
  TSchema,
  TFinal,
  TBuildSuffix extends string
> = PartialInstanceBuilder<TUnionRegistry, TSchema, {}, TFinal, TBuildSuffix>;
