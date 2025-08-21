import { ArrayBuilder } from './array-builder';
import { InstanceBuilder } from './instance-builder';
import { RecordBuilder } from './record-builder';
import { ARRAY_SUFFIX, INSTANCE_SUFFIX, RECORD_SUFFIX, SUB_TYPE_SUFFIX, TUPLE_SUFFIX } from './suffixes';
import { TupleBuilder } from './tuple-builder';
import { ArrayElementType, AsRequiredKeys, AsUnionMetadata, Builder, FilterByPartial, HasOnlyIndexSignature, IsArray, IsNonBaseUserType, IsTuple, Keys, RecordValueType, UnionMetadata, Values } from './utility-types';

type SubTypeBuilderValue<
  TUnionRegistry extends readonly UnionMetadata<any, any>[],
  TBase,
  TUnion extends TBase,
  TPartial extends Partial<Record<keyof TUnion, any>>,
  TFinal,
  TBuildSuffix extends string
> = {
    [K in string & Exclude<Keys<FilterByPartial<TUnion, TPartial>>, keyof TPartial>]:
    <V extends Values<FilterByPartial<TUnion, TPartial>, K>>(value: V) =>
      PartialSubTypeBuilder<
        TUnionRegistry,
        TBase,
        TUnion,
        TPartial & { [P in K]: V },
        TFinal,
        TBuildSuffix
      >;
  };

type SubTypeBuilderArray<
  TUnionRegistry extends readonly UnionMetadata<any, any>[],
  TBase,
  TUnion extends TBase,
  TPartial extends Partial<Record<keyof TUnion, any>>,
  TFinal,
  TBuildSuffix extends string
> = {
    [K in string & Exclude<Keys<FilterByPartial<TUnion, TPartial>>, keyof TPartial> as IsArray<TUnion[K]> extends true ? `${K}${typeof ARRAY_SUFFIX}` : never]:
    <V extends ArrayElementType<Values<FilterByPartial<TUnion, TPartial>, K>>>(value: V) =>
      () => ArrayBuilder<
        TUnionRegistry,
        V,
        PartialSubTypeBuilder<
          TUnionRegistry,
          TBase,
          TUnion,
          TPartial & { [P in K]: V },
          TFinal,
          TBuildSuffix>,
        K
      >;
  };

type SubTypeBuilderRecord<
  TUnionRegistry extends readonly UnionMetadata<any, any>[],
  TBase,
  TUnion extends TBase,
  TPartial extends Partial<Record<keyof TUnion, any>>,
  TFinal,
  TBuildSuffix extends string
> = {
    [K in string & Exclude<Keys<FilterByPartial<TUnion, TPartial>>, keyof TPartial> as HasOnlyIndexSignature<TUnion[K]> extends true ? `${K}${typeof RECORD_SUFFIX}` : never]:
    <V extends Values<FilterByPartial<TUnion, TPartial>, K>>() =>
      () => RecordBuilder<
        TUnionRegistry,
        RecordValueType<V>,
        PartialSubTypeBuilder<
          TUnionRegistry,
          TBase,
          TUnion,
          TPartial & { [P in K]: V },
          TFinal,
          TBuildSuffix
        >,
        K
      >
  };

type SubTypeBuilderSubType<
  TUnionRegistry extends readonly UnionMetadata<any, any>[],
  TBase,
  TUnion extends TBase,
  TPartial extends Partial<Record<keyof TUnion, any>>,
  TFinal,
  TBuildSuffix extends string
> = {
    [K in string & Exclude<Keys<FilterByPartial<TUnion, TPartial>>, keyof TPartial> as AsUnionMetadata<TUnionRegistry, TUnion[K]> extends never ? never : `${K}${typeof SUB_TYPE_SUFFIX}`]:
    <V extends Values<FilterByPartial<TUnion, TPartial>, K>>() =>
      AsUnionMetadata<TUnionRegistry, TUnion[K]> extends UnionMetadata<infer TBaseNested, infer TSubUnionNested>
      ? () => SubTypeBuilder<
        TUnionRegistry,
        TBaseNested,
        TSubUnionNested,
        PartialSubTypeBuilder<
          TUnionRegistry,
          TBase,
          TUnion,
          TPartial & { [P in K]: V },
          TFinal,
          TBuildSuffix
        >,
        K
      >
      : never;
  };

type SubTypeBuilderInstance<
  TUnionRegistry extends readonly UnionMetadata<any, any>[],
  TBase,
  TUnion extends TBase,
  TPartial extends Partial<Record<keyof TUnion, any>>,
  TFinal,
  TBuildSuffix extends string
> = {
    [K in string & Exclude<Keys<FilterByPartial<TUnion, TPartial>>, keyof TPartial> as IsNonBaseUserType<TUnionRegistry, Required<TUnion>[K]> extends true ? `${K}${typeof INSTANCE_SUFFIX}` : never]:
    <V extends Values<FilterByPartial<Required<TUnion>, TPartial>, K>>() =>
      InstanceBuilder<
        TUnionRegistry,
        V,
        PartialSubTypeBuilder<
          TUnionRegistry,
          TBase,
          TUnion,
          TPartial & { [P in K]: V },
          TFinal,
          TBuildSuffix
        >,
        K
      >
  };

type SubTypeBuilderTuple<
  TUnionRegistry extends readonly UnionMetadata<any, any>[],
  TBase,
  TUnion extends TBase,
  TPartial extends Partial<Record<keyof TUnion, any>>,
  TFinal,
  TBuildSuffix extends string
> = {
    [K in string & Exclude<Keys<FilterByPartial<TUnion, TPartial>>, keyof TPartial> as IsTuple<Required<TUnion>[K]> extends true ? `${K}${typeof TUPLE_SUFFIX}` : never]:
    <V extends Values<FilterByPartial<Required<TUnion>, TPartial>, K>>() =>
      TupleBuilder<
        TUnionRegistry,
        V extends readonly any[] ? V : never,
        PartialSubTypeBuilder<
          TUnionRegistry,
          TBase,
          TUnion,
          TPartial & { [P in K]: V },
          TFinal,
          TBuildSuffix
        >,
        K
      >
  };

export type PartialSubTypeBuilder<
  TUnionRegistry extends readonly UnionMetadata<any, any>[],
  TBase,
  TUnion extends TBase,
  TPartial extends Partial<Record<keyof TUnion, any>>,
  TFinal,
  TBuildSuffix extends string
> =
  & (AsRequiredKeys<Required<TUnion>, TPartial> extends never ? Builder<TFinal, TBuildSuffix> : object)
  & SubTypeBuilderValue<TUnionRegistry, TBase, TUnion, TPartial, TFinal, TBuildSuffix>
  & SubTypeBuilderArray<TUnionRegistry, TBase, TUnion, TPartial, TFinal, TBuildSuffix>
  & SubTypeBuilderRecord<TUnionRegistry, TBase, TUnion, TPartial, TFinal, TBuildSuffix>
  & SubTypeBuilderSubType<TUnionRegistry, TBase, TUnion, TPartial, TFinal, TBuildSuffix>
  & SubTypeBuilderInstance<TUnionRegistry, TBase, TUnion, TPartial, TFinal, TBuildSuffix>
  & SubTypeBuilderTuple<TUnionRegistry, TBase, TUnion, TPartial, TFinal, TBuildSuffix>
  ;

export type SubTypeBuilder<
  TUnionRegistry extends readonly UnionMetadata<any, any>[],
  TBase,
  TUnion extends TBase,
  TFinal,
  TBuildSuffix extends string
> = PartialSubTypeBuilder<TUnionRegistry, TBase, TUnion, {}, TFinal, TBuildSuffix>;
