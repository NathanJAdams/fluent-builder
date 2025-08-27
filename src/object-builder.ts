import { ArrayBuilderNested } from './array-builder';
import { Builder } from './builder';
import { suffixes } from './constants';
import { RecordBuilderNested } from './record-builder';
import { AsArray, AsObject, AsRecord, AsRequiredKeys, FilterByPartial, IsAllObject, IsArray, IsExact, IsRecord, IsUnion, Keys, ValueFromKey, Values } from './utility-types';

export type ObjectBuilderTopLevel<T> = ObjectBuilderNested<T, T, typeof suffixes.object>;
export type ObjectBuilderNested<T, TFinal, TBuildSuffix extends string> = ObjectBuilderWithPartial<T, T, {}, TFinal, TBuildSuffix>;

type ObjectBuilderWithPartial<TObject, TRemainingUnion, TPartial, TFinal, TBuildSuffix extends string> =
  & ([AsRequiredKeys<TRemainingUnion, TPartial>] extends [never] ? Builder<TFinal, TBuildSuffix> : object)
  & ObjectBuilderValue<TObject, TRemainingUnion, TPartial, TFinal, TBuildSuffix>
  & ObjectBuilderArray<TObject, TRemainingUnion, TPartial, TFinal, TBuildSuffix>
  & ObjectBuilderObject<TObject, TRemainingUnion, TPartial, TFinal, TBuildSuffix>
  & ObjectBuilderRecord<TObject, TRemainingUnion, TPartial, TFinal, TBuildSuffix>
  ;

type ObjectBuilderValue<T, TRemainingUnion, TPartial, TFinal, TBuildSuffix extends string> = {
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

type ObjectBuilderArray<T, TRemainingUnion, TPartial, TFinal, TBuildSuffix extends string> = {
  [TKey in (string & Exclude<Keys<TRemainingUnion>, keyof TPartial>) as IsArray<ValueFromKey<TRemainingUnion, TKey>> extends true ? `${TKey}${typeof suffixes.array}` : never]:
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

type ObjectBuilderObject<T, TRemainingUnion, TPartial, TFinal, TBuildSuffix extends string> = {
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

type ObjectBuilderRecord<T, TRemainingUnion, TPartial, TFinal, TBuildSuffix extends string> = {
  [TKey in (string & Exclude<Keys<TRemainingUnion>, keyof TPartial>) as IsRecord<ValueFromKey<TRemainingUnion, TKey>> extends true ? `${TKey}${typeof suffixes.record}` : never]:
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
