import { ArrayBuilder } from './array-builder';
import { RecordBuilder } from './record-builder';
import { SubTypeBuilder } from './sub-type-builder';
import { ARRAY_SUFFIX, INSTANCE_SUFFIX, RECORD_SUFFIX, SUB_TYPE_SUFFIX } from './suffixes';
import { ArrayElementType, AsNonBaseUserType, Builder, AsSubTypeMetadata, HasOnlyIndexSignature, SubTypeMetadata, UnusedKeys, AsRequiredKeys, RecordValueType } from './utility-types';

type InstanceBuilderValue<TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[], TSchema, TPartial extends Partial<TSchema>, TFinal, TBuildSuffix extends string> = {
  [K in UnusedKeys<TSchema, TPartial>]:
  (value: TSchema[K]) =>
    PartialInstanceBuilder<
      TSubTypeRegistry,
      TSchema,
      TPartial & { [P in K]: TSchema[K] },
      TFinal,
      TBuildSuffix
    >;
};

type InstanceBuilderArray<TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[], TSchema, TPartial extends Partial<TSchema>, TFinal, TBuildSuffix extends string> = {
  [K in UnusedKeys<TSchema, TPartial> as ArrayElementType<TSchema[K]> extends never ? never : `${K}${typeof ARRAY_SUFFIX}`]:
  () =>
    ArrayBuilder<
      TSubTypeRegistry,
      ArrayElementType<TSchema[K]>,
      PartialInstanceBuilder<
        TSubTypeRegistry,
        TSchema,
        TPartial & { [P in K]: TSchema[K] },
        TFinal,
        TBuildSuffix
      >,
      K
    >;
};

type InstanceBuilderRecord<TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[], TSchema, TPartial extends Partial<TSchema>, TFinal, TBuildSuffix extends string> = {
  [K in UnusedKeys<TSchema, TPartial> as HasOnlyIndexSignature<Required<TSchema>[K]> extends true ? `${K}${typeof RECORD_SUFFIX}` : never]:
  () =>
    RecordBuilder<
      TSubTypeRegistry,
      RecordValueType<TSchema[K]>,
      PartialInstanceBuilder<
        TSubTypeRegistry,
        TSchema,
        TPartial & { [P in K]: TSchema[K] },
        TFinal,
        TBuildSuffix
      >,
      K
    >
};

type InstanceBuilderSubType<TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[], TSchema, TPartial extends Partial<TSchema>, TFinal, TBuildSuffix extends string> = {
  [K in UnusedKeys<TSchema, TPartial> as AsSubTypeMetadata<TSubTypeRegistry, TSchema[K]> extends never ? never : `${K}${typeof SUB_TYPE_SUFFIX}`]:
  AsSubTypeMetadata<TSubTypeRegistry, TSchema[K]> extends SubTypeMetadata<infer TBase, infer TSubUnion>
  ? () =>
    SubTypeBuilder<
      TSubTypeRegistry,
      TBase,
      TSubUnion,
      PartialInstanceBuilder<
        TSubTypeRegistry,
        TSchema,
        TPartial & { [P in K]: TSchema[K] },
        TFinal,
        TBuildSuffix
      >,
      K
    >
  : never;
};

type InstanceBuilderInstance<TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[], TSchema, TPartial extends Partial<TSchema>, TFinal, TBuildSuffix extends string> = {
  [K in UnusedKeys<TSchema, TPartial> as AsNonBaseUserType<TSubTypeRegistry, TSchema[K]> extends never ? never : `${K}${typeof INSTANCE_SUFFIX}`]:
  () =>
    InstanceBuilder<
      TSubTypeRegistry,
      TSchema[K],
      PartialInstanceBuilder<
        TSubTypeRegistry,
        TSchema,
        TPartial & { [P in K]: TSchema[K] },
        TFinal,
        TBuildSuffix
      >,
      K
    >
};

export type PartialInstanceBuilder<
  TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[],
  TSchema,
  TPartial extends Partial<TSchema>,
  TFinal,
  TBuildSuffix extends string
> =
  & (AsRequiredKeys<TSchema, TPartial> extends never ? Builder<TFinal, TBuildSuffix> : object)
  & InstanceBuilderValue<TSubTypeRegistry, TSchema, TPartial, TFinal, TBuildSuffix>
  & InstanceBuilderArray<TSubTypeRegistry, TSchema, TPartial, TFinal, TBuildSuffix>
  & InstanceBuilderRecord<TSubTypeRegistry, TSchema, TPartial, TFinal, TBuildSuffix>
  & InstanceBuilderSubType<TSubTypeRegistry, TSchema, TPartial, TFinal, TBuildSuffix>
  & InstanceBuilderInstance<TSubTypeRegistry, TSchema, TPartial, TFinal, TBuildSuffix>
  ;

export type InstanceBuilder<
  TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[],
  TSchema,
  TFinal,
  TBuildSuffix extends string
> = PartialInstanceBuilder<TSubTypeRegistry, TSchema, {}, TFinal, TBuildSuffix>;
