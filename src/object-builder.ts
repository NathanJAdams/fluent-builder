import { ArrayBuilder } from './array-builder';
import { suffixes } from './constants';
import { RecordBuilder } from './record-builder';
import { ArrayTypes, AsRequiredKeys, Builder, FilterByPartial, HasArrayKey, IsExact, IsUserTypeKeyed, Keys, RecordValueType, UnionHasAtLeastOneRecordNamed, UnionToIntersection, Values } from './utility-types';

type ObjectBuilderValue<T, TRemainingUnion, TPartial, TFinal, TBuildSuffix extends string> = {
  [K in string & Exclude<Keys<TRemainingUnion>, keyof TPartial>]:
  <V extends Values<TRemainingUnion, K>, >
    (value: V) =>
    TPartial & { [P in K]: V } extends infer TPartialNew
    ? FilterByPartial<TRemainingUnion, TPartialNew> extends infer TRemainingUnionNew
    ? PartialObjectBuilder<
      T,
      TRemainingUnionNew,
      TPartialNew,
      IsExact<T, TFinal> extends true ? TRemainingUnionNew : TFinal,
      TBuildSuffix
    >
    : never
    : never
  ;
};

type ObjectBuilderArray<T, TRemainingUnion, TPartial, TFinal, TBuildSuffix extends string> = {
  [K in (string & Exclude<Keys<TRemainingUnion>, keyof TPartial>) as HasArrayKey<Required<T>, K> extends true ? `${K}${typeof suffixes.array}` : never]:
  <V extends ArrayTypes<T, K>>
    () =>
    TPartial & { [P in K]: V } extends infer TPartialNew
    ? FilterByPartial<TRemainingUnion, TPartialNew> extends infer TRemainingUnionNew
    ? UnionToIntersection<ArrayBuilder<
      V,
      PartialObjectBuilder<
        T,
        TRemainingUnionNew,
        TPartialNew,
        IsExact<T, TFinal> extends true ? TRemainingUnionNew : TFinal,
        TBuildSuffix>,
      K
    >>
    : never
    : never;
};

type ObjectBuilderObject<T, TRemainingUnion, TPartial, TFinal, TBuildSuffix extends string> = {
  [K in (string & Exclude<Keys<TRemainingUnion>, keyof TPartial>) as IsUserTypeKeyed<Required<TRemainingUnion>, K> extends true ? `${K}${typeof suffixes.object}` : never]:
  <V extends Values<T, K>>
    () =>
    ObjectBuilder<
      V,
      PartialObjectBuilder<
        T,
        TRemainingUnion,
        TPartial & { [P in K]: V },
        TFinal,
        TBuildSuffix
      >,
      K
    >;
};

type ObjectBuilderRecord<T, TRemainingUnion, TPartial, TFinal, TBuildSuffix extends string> = {
  [K in (string & Exclude<Keys<TRemainingUnion>, keyof TPartial>) as UnionHasAtLeastOneRecordNamed<TRemainingUnion, K> extends true ? `${K}${typeof suffixes.record}` : never]:
  <V extends RecordValueType<Values<T, K>>>
    () =>
    RecordBuilder<
      V,
      PartialObjectBuilder<
        T,
        TRemainingUnion,
        TPartial & { [P in K]: V },
        TFinal,
        TBuildSuffix
      >,
      K
    >;
};

type PartialObjectBuilder<T, TRemainingUnion, TPartial, TFinal, TBuildSuffix extends string> =
  & (AsRequiredKeys<TRemainingUnion, TPartial> extends never ? Builder<TFinal, TBuildSuffix> : object)
  & ObjectBuilderValue<T, TRemainingUnion, TPartial, TFinal, TBuildSuffix>
  & ObjectBuilderArray<T, TRemainingUnion, TPartial, TFinal, TBuildSuffix>
  & ObjectBuilderObject<T, TRemainingUnion, TPartial, TFinal, TBuildSuffix>
  & ObjectBuilderRecord<T, TRemainingUnion, TPartial, TFinal, TBuildSuffix>
  ;

export type ObjectBuilder<T, TFinal, TBuildSuffix extends string> = PartialObjectBuilder<T, T, {}, TFinal, TBuildSuffix>;
