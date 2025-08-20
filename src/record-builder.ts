import { ArrayBuilder } from './array-builder';
import { InstanceBuilder } from './instance-builder';
import { SubTypeBuilder } from './sub-type-builder';
import { AsUnionMetadata, Builder, HasOnlyIndexSignature, IsExact, IsNonBaseUserType, RecordValueType, UnionMetadata, UnusedName } from './utility-types';

type RecordBuilderValue<TUnionRegistry extends readonly UnionMetadata<any, any>[], TEntries extends Record<string, TValue>, TValue, TFinal, TBuildSuffix extends string> = {
  set: <TName extends string> (name: UnusedName<TEntries, TName>, value: TValue) =>
    PartialRecordBuilder<
      TUnionRegistry,
      TEntries & { [K in TName]: TValue },
      TValue,
      IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal,
      TBuildSuffix
    >;
};

type RecordBuilderArray<TUnionRegistry extends readonly UnionMetadata<any, any>[], TEntries extends Record<string, TValue>, TValue, TFinal, TBuildSuffix extends string> =
  TValue extends Array<infer TNestedElement>
  ? {
    setArray: <TName extends string>(name: UnusedName<TEntries, TName>) =>
      ArrayBuilder<
        TUnionRegistry,
        TNestedElement,
        PartialRecordBuilder<
          TUnionRegistry,
          TEntries & { [K in TName]: TValue },
          TValue,
          IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal,
          TBuildSuffix
        >,
        TName
      >;
  }
  : object;

type RecordBuilderRecord<TUnionRegistry extends readonly UnionMetadata<any, any>[], TEntries extends Record<string, TValue>, TValue, TFinal, TBuildSuffix extends string> =
  HasOnlyIndexSignature<TValue> extends true
  ? {
    setRecord: <TName extends string>(name: UnusedName<TEntries, TName>) =>
      RecordBuilder<
        TUnionRegistry,
        RecordValueType<TValue>,
        PartialRecordBuilder<
          TUnionRegistry,
          TEntries & { [K in TName]: TValue },
          TValue,
          IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal,
          TBuildSuffix
        >,
        TName
      >;
  }
  : object;

type RecordBuilderSubType<TUnionRegistry extends readonly UnionMetadata<any, any>[], TEntries extends Record<string, TValue>, TValue, TFinal, TBuildSuffix extends string> =
  AsUnionMetadata<TUnionRegistry, TValue> extends infer TMetadata
  ? [TMetadata] extends [never]
  ? object
  : TMetadata extends UnionMetadata<infer TBase, infer TUnion>
  ? {
    setSubType: <TName extends string>(name: UnusedName<TEntries, TName>) =>
      SubTypeBuilder<
        TUnionRegistry,
        TBase,
        TUnion,
        PartialRecordBuilder<
          TUnionRegistry,
          TEntries & { [K in TName]: TValue },
          TValue,
          IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal,
          TBuildSuffix
        >,
        TName
      >;
  }
  : object
  : object;

type RecordBuilderInstance<TUnionRegistry extends readonly UnionMetadata<any, any>[], TEntries extends Record<string, TValue>, TValue, TFinal, TBuildSuffix extends string> =
  IsNonBaseUserType<TUnionRegistry, TValue> extends true
  ? {
    setInstance: <TName extends string>(name: UnusedName<TEntries, TName>) =>
      InstanceBuilder<
        TUnionRegistry,
        TValue,
        PartialRecordBuilder<
          TUnionRegistry,
          TEntries & { [K in TName]: TValue },
          TValue,
          IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal,
          TBuildSuffix
        >,
        TName
      >;
  }
  : object;

export type PartialRecordBuilder<
  TUnionRegistry extends readonly UnionMetadata<any, any>[],
  TEntries extends Record<string, TValue>,
  TValue,
  TFinal,
  TBuildSuffix extends string
> =
  & Builder<TFinal, TBuildSuffix>
  & RecordBuilderValue<TUnionRegistry, TEntries, TValue, TFinal, TBuildSuffix>
  & RecordBuilderArray<TUnionRegistry, TEntries, TValue, TFinal, TBuildSuffix>
  & RecordBuilderRecord<TUnionRegistry, TEntries, TValue, TFinal, TBuildSuffix>
  & RecordBuilderSubType<TUnionRegistry, TEntries, TValue, TFinal, TBuildSuffix>
  & RecordBuilderInstance<TUnionRegistry, TEntries, TValue, TFinal, TBuildSuffix>
  ;

export type RecordBuilder<
  TUnionRegistry extends readonly UnionMetadata<any, any>[],
  TValue,
  TFinal,
  TBuildSuffix extends string
> = PartialRecordBuilder<TUnionRegistry, {}, TValue, TFinal, TBuildSuffix>;
