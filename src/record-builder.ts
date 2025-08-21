import { ArrayBuilder } from './array-builder';
import { ObjectBuilder } from './object-builder';
import { Builder, HasOnlyIndexSignature, IsExact, IsUserType, RecordValueType, UnusedName } from './utility-types';

type RecordBuilderValue<TEntries extends Record<string, TValue>, TValue, TFinal, TBuildSuffix extends string> = {
  set: <TName extends string> (name: UnusedName<TEntries, TName>, value: TValue) =>
    PartialRecordBuilder<
      TEntries & { [K in TName]: TValue },
      TValue,
      IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal,
      TBuildSuffix
    >;
};

type RecordBuilderArray<TEntries extends Record<string, TValue>, TValue, TFinal, TBuildSuffix extends string> =
  TValue extends any[]
  ? {
    setArray: <TName extends string>(name: UnusedName<TEntries, TName>) =>
      ArrayBuilder<
        TValue,
        PartialRecordBuilder<
          TEntries & { [K in TName]: TValue },
          TValue,
          IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal,
          TBuildSuffix
        >,
        TName
      >;
  }
  : object;

type RecordBuilderObject<TEntries extends Record<string, TValue>, TValue, TFinal, TBuildSuffix extends string> =
  IsUserType<TValue> extends true
  ? {
    setObject: <TName extends string>(name: UnusedName<TEntries, TName>) =>
      ObjectBuilder<
        TValue,
        PartialRecordBuilder<
          TEntries & { [K in TName]: TValue },
          TValue,
          IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal,
          TBuildSuffix
        >,
        TName
      >;
  }
  : object;

type RecordBuilderRecord<TEntries extends Record<string, TValue>, TValue, TFinal, TBuildSuffix extends string> =
  HasOnlyIndexSignature<TValue> extends true
  ? {
    setRecord: <TName extends string>(name: UnusedName<TEntries, TName>) =>
      RecordBuilder<
        RecordValueType<TValue>,
        PartialRecordBuilder<
          TEntries & { [K in TName]: TValue },
          TValue,
          IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal,
          TBuildSuffix
        >,
        TName
      >;
  }
  : object;

export type PartialRecordBuilder<TEntries extends Record<string, TValue>, TValue, TFinal, TBuildSuffix extends string> =
  & Builder<TFinal, TBuildSuffix>
  & RecordBuilderValue<TEntries, TValue, TFinal, TBuildSuffix>
  & RecordBuilderArray<TEntries, TValue, TFinal, TBuildSuffix>
  & RecordBuilderObject<TEntries, TValue, TFinal, TBuildSuffix>
  & RecordBuilderRecord<TEntries, TValue, TFinal, TBuildSuffix>
  ;

export type RecordBuilder<TValue, TFinal, TBuildSuffix extends string> = PartialRecordBuilder<{}, TValue, TFinal, TBuildSuffix>;
