import { ArrayBuilderNested } from './array-builder';
import { Builder } from './builder';
import { suffixes } from './constants';
import { ErrorNotBuildable, ErrorNotValid } from './errors';
import { ObjectBuilderNested } from './object-builder';
import { AsArray, AsObject, AsRecord, IsExact, IsUnion, ObjectOrRecordKey, RecordValueType, UnusedName } from './utility-types';

export type RecordBuilderTopLevel<T> =
  AsRecord<T> extends infer TRecord
  ? [TRecord] extends [never]
  ? ErrorNotValid
  : IsUnion<TRecord> extends true
  ? ErrorNotBuildable
  : RecordBuilderNested<TRecord, TRecord, typeof suffixes.record>
  : never
  ;
export type RecordBuilderNested<
  T,
  TFinal,
  TBuildSuffix extends ObjectOrRecordKey
> =
  AsRecord<T> extends infer TRecord
  ? [TRecord] extends [never]
  ? object
  : IsUnion<TRecord> extends true
  ? ErrorNotBuildable
  : [TRecord] extends [Record<ObjectOrRecordKey, any>]
  ? PartialRecordBuilder<TRecord, RecordValueType<TRecord>, {}, TFinal, TBuildSuffix>
  : object
  : never
  ;

type PartialRecordBuilder<TRecord extends Record<ObjectOrRecordKey, TValue>, TValue, TEntries, TFinal, TBuildSuffix extends ObjectOrRecordKey> =
  & Builder<TFinal, TBuildSuffix>
  & RecordBuilderValue<TRecord, TValue, TEntries, TFinal, TBuildSuffix>
  & RecordBuilderArray<TRecord, TValue, TEntries, TFinal, TBuildSuffix>
  & RecordBuilderObject<TRecord, TValue, TEntries, TFinal, TBuildSuffix>
  & RecordBuilderRecord<TRecord, TValue, TEntries, TFinal, TBuildSuffix>
  ;

type RecordBuilderValue<TRecord extends Record<ObjectOrRecordKey, any>, TValue, TEntries, TFinal, TBuildSuffix extends ObjectOrRecordKey> = {
  set: <TName extends ObjectOrRecordKey>(name: UnusedName<TEntries, TName>, value: TValue) =>
    PartialRecordBuilder<
      TRecord,
      TValue,
      TEntries & { [K in TName]: TValue },
      IsExact<TFinal, TEntries> extends true
      ? TEntries & { [K in TName]: TValue }
      : TFinal,
      TBuildSuffix
    >;
};

type RecordBuilderArray<TRecord extends Record<ObjectOrRecordKey, TValue>, TValue, TEntries, TFinal, TBuildSuffix extends ObjectOrRecordKey> =
  AsArray<TValue> extends infer TNestedArray
  ? [TNestedArray] extends [never]
  ? object
  : {
    setArray: <TName extends ObjectOrRecordKey>(name: UnusedName<TEntries, TName>) =>
      ArrayBuilderNested<
        TNestedArray,
        PartialRecordBuilder<
          TRecord,
          TValue,
          TEntries & { [K in TName]: TValue },
          IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal,
          TBuildSuffix
        >,
        TName
      >;
  }
  : never
  ;

type RecordBuilderObject<TRecord extends Record<ObjectOrRecordKey, TValue>, TValue, TEntries, TFinal, TBuildSuffix extends ObjectOrRecordKey> =
  AsObject<TValue> extends infer TNestedObject
  ? [TNestedObject] extends [never]
  ? object
  : {
    setObject: <TName extends ObjectOrRecordKey>(name: UnusedName<TEntries, TName>) =>
      ObjectBuilderNested<
        TNestedObject,
        PartialRecordBuilder<
          TRecord,
          TValue,
          TEntries & { [K in TName]: TValue },
          IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal,
          TBuildSuffix
        >,
        TName
      >;
  }
  : never
  ;

type RecordBuilderRecord<TRecord extends Record<ObjectOrRecordKey, TValue>, TValue, TEntries, TFinal, TBuildSuffix extends ObjectOrRecordKey> =
  AsRecord<TValue> extends infer TNestedRecord
  ? [TNestedRecord] extends [never]
  ? object
  : {
    setRecord: <TName extends ObjectOrRecordKey>(name: UnusedName<TEntries, TName>) =>
      RecordBuilderNested<
        TNestedRecord,
        PartialRecordBuilder<
          TRecord,
          TValue,
          TEntries & { [K in TName]: TValue },
          IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal,
          TBuildSuffix
        >,
        TName
      >;
  }
  : never
  ;
