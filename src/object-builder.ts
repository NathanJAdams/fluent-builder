import { ArrayBuilderNested } from './array-builder';
import { Builder } from './builder';
import { suffixes } from './constants';
import { RecordBuilderNested } from './record-builder';
import { AsArray, AsObject, AsRecord, AsRequiredKeys, FilterByPartial, IsAllArray, IsAllObject, IsAllRecord, IsExact, IsUnion, Keys, ObjectOrRecordKey, ValueFromKey, Values } from './utility-types';

export type ObjectBuilderTopLevel<T> = ObjectBuilderNested<T, T, typeof suffixes.object>;
export type ObjectBuilderNested<T, TFinal, TBuildSuffix extends ObjectOrRecordKey> = ObjectBuilderWithPartial<T, T, {}, TFinal, TBuildSuffix>;

export type ObjectBuilderWithPartial<TObject, TRemainingUnion, TPartial, TFinal, TBuildSuffix extends ObjectOrRecordKey> =
  & ([AsRequiredKeys<TRemainingUnion, TPartial>] extends [never] ? Builder<TFinal, TBuildSuffix> : object)
  & ObjectBuilderValue<TObject, TRemainingUnion, TPartial, TFinal, TBuildSuffix>
  & ObjectBuilderArray<TObject, TRemainingUnion, TPartial, TFinal, TBuildSuffix>
  & ObjectBuilderObject<TObject, TRemainingUnion, TPartial, TFinal, TBuildSuffix>
  & ObjectBuilderRecord<TObject, TRemainingUnion, TPartial, TFinal, TBuildSuffix>
  ;

export type ObjectBuilderValue<T, TRemainingUnion, TPartial, TFinal, TBuildSuffix extends ObjectOrRecordKey> = {
  [TKey in string & Exclude<Keys<TRemainingUnion>, keyof TPartial>]:
  <TValue extends Values<TRemainingUnion, TKey>>
    (value: TValue) =>
    TPartial & { [P in TKey]: TValue } extends infer TPartialNew
    ? FilterByPartial<TRemainingUnion, TPartialNew> extends infer TRemainingUnionNew
    ? ObjectBuilderWithPartial<
      T,
      TRemainingUnionNew,
      TPartialNew,
      IsExact<T, TFinal> extends true
      ? IsUnion<TRemainingUnionNew> extends true
      ? TFinal
      : TRemainingUnionNew
      : TFinal,
      TBuildSuffix
    >
    : never
    : never
  ;
};

export type ObjectBuilderArray<T, TRemainingUnion, TPartial, TFinal, TBuildSuffix extends ObjectOrRecordKey> = {
  [TKey in (string & Exclude<Keys<TRemainingUnion>, keyof TPartial>) as IsAllArray<ValueFromKey<TRemainingUnion, TKey>> extends true ? `${TKey}${typeof suffixes.array}` : never]:
  <TArray extends AsArray<Values<TRemainingUnion, TKey>>>
    () =>
    TPartial & { [P in TKey]: TArray } extends infer TPartialNew
    ? FilterByPartial<TRemainingUnion, TPartialNew> extends infer TRemainingUnionNew
    ? ArrayBuilderNested<
      TArray,
      ObjectBuilderWithPartial<
        T,
        TRemainingUnionNew,
        TPartialNew,
        IsExact<T, TFinal> extends true
        ? IsUnion<TRemainingUnionNew> extends true
        ? TFinal
        : TRemainingUnionNew
        : TFinal,
        TBuildSuffix>,
      TKey
    >
    : never
    : never;
};

export type ObjectBuilderObject<T, TRemainingUnion, TPartial, TFinal, TBuildSuffix extends ObjectOrRecordKey> = {
  [TKey in (string & Exclude<Keys<TRemainingUnion>, keyof TPartial>) as IsAllObject<Required<TRemainingUnion>[TKey]> extends true ? `${TKey}${typeof suffixes.object}` : never]:
  <TObject extends AsObject<Values<TRemainingUnion, TKey>>>
    () =>
    TPartial & { [P in TKey]: TObject } extends infer TPartialNew
    ? FilterByPartial<TRemainingUnion, TPartialNew> extends infer TRemainingUnionNew
    ? ObjectBuilderNested<
      TObject,
      ObjectBuilderWithPartial<
        T,
        TRemainingUnionNew,
        TPartial & { [P in TKey]: TObject },
        IsExact<T, TFinal> extends true
        ? IsUnion<TRemainingUnionNew> extends true
        ? TFinal
        : TRemainingUnionNew
        : TFinal,
        TBuildSuffix
      >,
      TKey
    >
    : never
    : never;
};

export type ObjectBuilderRecord<T, TRemainingUnion, TPartial, TFinal, TBuildSuffix extends ObjectOrRecordKey> = {
  [TKey in (string & Exclude<Keys<TRemainingUnion>, keyof TPartial>) as IsAllRecord<ValueFromKey<TRemainingUnion, TKey>> extends true ? `${TKey}${typeof suffixes.record}` : never]:
  <TRecord extends AsRecord<Values<TRemainingUnion, TKey>>>
    () =>
    TPartial & { [P in TKey]: TRecord } extends infer TPartialNew
    ? FilterByPartial<TRemainingUnion, TPartialNew> extends infer TRemainingUnionNew
    ? RecordBuilderNested<
      TRecord,
      ObjectBuilderWithPartial<
        T,
        TRemainingUnionNew,
        TPartial & { [P in TKey]: TRecord },
        IsExact<T, TFinal> extends true
        ? IsUnion<TRemainingUnionNew> extends true
        ? TFinal
        : TRemainingUnionNew
        : TFinal,
        TBuildSuffix
      >,
      TKey
    >
    : never
    : never;
};
