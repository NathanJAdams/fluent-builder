import { ArrayBuilder } from './array-builder';
import { InstanceBuilder } from './instance-builder';
import { RecordBuilder } from './record-builder';
import { ARRAY_SUFFIX, INSTANCE_SUFFIX, RECORD_SUFFIX, SUB_TYPE_SUFFIX } from './suffixes';
import { ArrayElementType, AsRequiredKeys, AsSubTypeMetadata, Builder, FilterByPartial, HasOnlyIndexSignature, IsNonBaseUserType, Keys, RecordValueType, SubTypeMetadata, Values } from './utility-types';

type SubTypeBuilderValue<
  TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[],
  TBase,
  TSubUnion extends TBase,
  TPartial extends Partial<Record<keyof TSubUnion, any>>,
  TFinal,
  TBuildSuffix extends string
> = {
    [K in string & Exclude<Keys<FilterByPartial<TSubUnion, TPartial>>, keyof TPartial>]:
    <V extends Values<FilterByPartial<TSubUnion, TPartial>, K>>(value: V) =>
      PartialSubTypeBuilder<
        TSubTypeRegistry,
        TBase,
        TSubUnion,
        TPartial & { [P in K]: V },
        TFinal,
        TBuildSuffix
      >;
  };

type SubTypeBuilderArray<
  TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[],
  TBase,
  TSubUnion extends TBase,
  TPartial extends Partial<Record<keyof TSubUnion, any>>,
  TFinal,
  TBuildSuffix extends string
> = {
    [K in string & Exclude<Keys<FilterByPartial<TSubUnion, TPartial>>, keyof TPartial> as ArrayElementType<TSubUnion[K]> extends never ? never : `${K}${typeof ARRAY_SUFFIX}`]:
    <V extends ArrayElementType<Values<FilterByPartial<TSubUnion, TPartial>, K>>>(value: V) =>
      () => ArrayBuilder<
        TSubTypeRegistry,
        V,
        PartialSubTypeBuilder<
          TSubTypeRegistry,
          TBase,
          TSubUnion,
          TPartial & { [P in K]: V },
          TFinal,
          TBuildSuffix>,
        K
      >;
  };

type SubTypeBuilderRecord<
  TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[],
  TBase,
  TSubUnion extends TBase,
  TPartial extends Partial<Record<keyof TSubUnion, any>>,
  TFinal,
  TBuildSuffix extends string
> = {
    [K in string & Exclude<Keys<FilterByPartial<TSubUnion, TPartial>>, keyof TPartial> as HasOnlyIndexSignature<TSubUnion[K]> extends true ? `${K}${typeof RECORD_SUFFIX}` : never]:
    <V extends Values<FilterByPartial<TSubUnion, TPartial>, K>>() =>
      () => RecordBuilder<
        TSubTypeRegistry,
        RecordValueType<V>,
        PartialSubTypeBuilder<
          TSubTypeRegistry,
          TBase,
          TSubUnion,
          TPartial & { [P in K]: V },
          TFinal,
          TBuildSuffix
        >,
        K
      >
  };

type SubTypeBuilderSubType<
  TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[],
  TBase,
  TSubUnion extends TBase,
  TPartial extends Partial<Record<keyof TSubUnion, any>>,
  TFinal,
  TBuildSuffix extends string
> = {
    [K in string & Exclude<Keys<FilterByPartial<TSubUnion, TPartial>>, keyof TPartial> as AsSubTypeMetadata<TSubTypeRegistry, TSubUnion[K]> extends never ? never : `${K}${typeof SUB_TYPE_SUFFIX}`]:
    <V extends Values<FilterByPartial<TSubUnion, TPartial>, K>>() =>
      AsSubTypeMetadata<TSubTypeRegistry, TSubUnion[K]> extends SubTypeMetadata<infer TBaseNested, infer TSubUnionNested>
      ? () => SubTypeBuilder<
        TSubTypeRegistry,
        TBaseNested,
        TSubUnionNested,
        PartialSubTypeBuilder<
          TSubTypeRegistry,
          TBase,
          TSubUnion,
          TPartial & { [P in K]: V },
          TFinal,
          TBuildSuffix
        >,
        K
      >
      : never;
  };

type SubTypeBuilderInstance<
  TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[],
  TBase,
  TSubUnion extends TBase,
  TPartial extends Partial<Record<keyof TSubUnion, any>>,
  TFinal,
  TBuildSuffix extends string
> = {
    [K in string & Exclude<Keys<FilterByPartial<TSubUnion, TPartial>>, keyof TPartial> as IsNonBaseUserType<TSubTypeRegistry, Required<TSubUnion>[K]> extends true ? `${K}${typeof INSTANCE_SUFFIX}` : never]:
    <V extends Values<FilterByPartial<Required<TSubUnion>, TPartial>, K>>() =>
      InstanceBuilder<
        TSubTypeRegistry,
        V,
        PartialSubTypeBuilder<
          TSubTypeRegistry,
          TBase,
          TSubUnion,
          TPartial & { [P in K]: V },
          TFinal,
          TBuildSuffix
        >,
        K
      >
  };

export type PartialSubTypeBuilder<
  TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[],
  TBase,
  TSubUnion extends TBase,
  TPartial extends Partial<Record<keyof TSubUnion, any>>,
  TFinal,
  TBuildSuffix extends string
> =
  & (AsRequiredKeys<Required<TSubUnion>, TPartial> extends never ? Builder<TFinal, TBuildSuffix> : object)
  & SubTypeBuilderValue<TSubTypeRegistry, TBase, TSubUnion, TPartial, TFinal, TBuildSuffix>
  & SubTypeBuilderArray<TSubTypeRegistry, TBase, TSubUnion, TPartial, TFinal, TBuildSuffix>
  & SubTypeBuilderRecord<TSubTypeRegistry, TBase, TSubUnion, TPartial, TFinal, TBuildSuffix>
  & SubTypeBuilderSubType<TSubTypeRegistry, TBase, TSubUnion, TPartial, TFinal, TBuildSuffix>
  & SubTypeBuilderInstance<TSubTypeRegistry, TBase, TSubUnion, TPartial, TFinal, TBuildSuffix>
  ;

export type SubTypeBuilder<
  TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[],
  TBase,
  TSubUnion extends TBase,
  TFinal,
  TBuildSuffix extends string
> = PartialSubTypeBuilder<TSubTypeRegistry, TBase, TSubUnion, {}, TFinal, TBuildSuffix>;
