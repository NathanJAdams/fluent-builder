import { ArrayBuilder } from './array-builder';
import { InstanceBuilder } from './instance-builder';
import { SubTypeBuilder } from './sub-type-builder';
import { AsSubTypeMetadata, Builder, HasOnlyIndexSignature, IsExact, IsNonBaseUserType, RecordValueType, SubTypeMetadata, UnusedName } from './utility-types';

type RecordBuilderValue<TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[], TEntries extends Record<string, TValue>, TValue, TFinal, TBuildSuffix extends string> = {
  set: <TName extends string> (name: UnusedName<TEntries, TName>, value: TValue) =>
    PartialRecordBuilder<
      TSubTypeRegistry,
      TEntries & { [K in TName]: TValue },
      TValue,
      IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal,
      TBuildSuffix
    >;
};

type RecordBuilderArray<TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[], TEntries extends Record<string, TValue>, TValue, TFinal, TBuildSuffix extends string> =
  TValue extends Array<infer TNestedElement>
  ? {
    setArray: <TName extends string>(name: UnusedName<TEntries, TName>) =>
      ArrayBuilder<
        TSubTypeRegistry,
        TNestedElement,
        PartialRecordBuilder<
          TSubTypeRegistry,
          TEntries & { [K in TName]: TValue },
          TValue,
          IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal,
          TBuildSuffix
        >,
        TName
      >;
  }
  : object;

type RecordBuilderRecord<TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[], TEntries extends Record<string, TValue>, TValue, TFinal, TBuildSuffix extends string> =
  HasOnlyIndexSignature<TValue> extends true
  ? {
    setRecord: <TName extends string>(name: UnusedName<TEntries, TName>) =>
      RecordBuilder<
        TSubTypeRegistry,
        RecordValueType<TValue>,
        PartialRecordBuilder<
          TSubTypeRegistry,
          TEntries & { [K in TName]: TValue },
          TValue,
          IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal,
          TBuildSuffix
        >,
        TName
      >;
  }
  : object;

type RecordBuilderSubType<TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[], TEntries extends Record<string, TValue>, TValue, TFinal, TBuildSuffix extends string> =
  AsSubTypeMetadata<TSubTypeRegistry, TValue> extends infer TMetadata
  ? [TMetadata] extends [never]
  ? object
  : TMetadata extends SubTypeMetadata<infer TBase, infer TSubUnion>
  ? {
    setSubType: <TName extends string>(name: UnusedName<TEntries, TName>) =>
      SubTypeBuilder<
        TSubTypeRegistry,
        TBase,
        TSubUnion,
        PartialRecordBuilder<
          TSubTypeRegistry,
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

type RecordBuilderInstance<TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[], TEntries extends Record<string, TValue>, TValue, TFinal, TBuildSuffix extends string> =
  IsNonBaseUserType<TSubTypeRegistry, TValue> extends true
  ? {
    setInstance: <TName extends string>(name: UnusedName<TEntries, TName>) =>
      InstanceBuilder<
        TSubTypeRegistry,
        TValue,
        PartialRecordBuilder<
          TSubTypeRegistry,
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
  TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[],
  TEntries extends Record<string, TValue>,
  TValue,
  TFinal,
  TBuildSuffix extends string
> =
  & Builder<TFinal, TBuildSuffix>
  & RecordBuilderValue<TSubTypeRegistry, TEntries, TValue, TFinal, TBuildSuffix>
  & RecordBuilderArray<TSubTypeRegistry, TEntries, TValue, TFinal, TBuildSuffix>
  & RecordBuilderRecord<TSubTypeRegistry, TEntries, TValue, TFinal, TBuildSuffix>
  & RecordBuilderSubType<TSubTypeRegistry, TEntries, TValue, TFinal, TBuildSuffix>
  & RecordBuilderInstance<TSubTypeRegistry, TEntries, TValue, TFinal, TBuildSuffix>
  ;

export type RecordBuilder<
  TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[],
  TValue,
  TFinal,
  TBuildSuffix extends string
> = PartialRecordBuilder<TSubTypeRegistry, {}, TValue, TFinal, TBuildSuffix>;
