import { ArrayBuilder } from './array-builder';
import { suffixes } from './constants';
import { RecordBuilder } from './record-builder';
import { AsRequiredKeys, Builder, FilterByPartial, HasOnlyIndexSignature, IsUserType, Keys, RecordValueType, Values } from './utility-types';

type ObjectBuilderValue<T, TPartial extends Partial<Record<keyof T, any>>, TFinal, TBuildSuffix extends string> = {
  [K in string & Exclude<Keys<T>, keyof TPartial>]:
  <V extends Values<FilterByPartial<T, TPartial>, K>>
    (value: V) => PartialObjectBuilder<
      T,
      TPartial & { [P in K]: V },
      TFinal,
      TBuildSuffix
    >;
};

type ObjectBuilderArray<T, TPartial extends Partial<Record<keyof T, any>>, TFinal, TBuildSuffix extends string> = {
  [K in (string & Exclude<Keys<FilterByPartial<T, TPartial>>, keyof TPartial>) as Required<T>[K] extends any[] ? `${K}${typeof suffixes.array}` : never]:
  <V extends Values<FilterByPartial<T, TPartial>, K>>
    () => ArrayBuilder<
      Required<T>[K] extends any[] ? Required<T>[K] : never,
      PartialObjectBuilder<
        T,
        TPartial & { [P in K]: V },
        TFinal,
        TBuildSuffix>,
      K
    >;
};

type ObjectBuilderObject<T, TPartial extends Partial<Record<keyof T, any>>, TFinal, TBuildSuffix extends string> = {
  [K in (string & Exclude<Keys<FilterByPartial<T, TPartial>>, keyof TPartial>) as IsUserType<Required<T>[K]> extends true ? `${K}${typeof suffixes.object}` : never]:
  <V extends Values<FilterByPartial<T, TPartial>, K>>
    () => ObjectBuilder<
      T[K],
      PartialObjectBuilder<
        T,
        TPartial & { [P in K]: V },
        TFinal,
        TBuildSuffix
      >,
      K
    >
};

type ObjectBuilderRecord<T, TPartial extends Partial<Record<keyof T, any>>, TFinal, TBuildSuffix extends string> = {
  [K in (string & Exclude<Keys<FilterByPartial<T, TPartial>>, keyof TPartial>) as HasOnlyIndexSignature<Required<T>[K]> extends true ? `${K}${typeof suffixes.record}` : never]:
  <V extends Values<FilterByPartial<T, TPartial>, K>>
    () => RecordBuilder<
      RecordValueType<V>,
      PartialObjectBuilder<
        T,
        TPartial & { [P in K]: V },
        TFinal,
        TBuildSuffix
      >,
      K
    >
};

export type PartialObjectBuilder<T, TPartial extends Partial<Record<keyof T, any>>, TFinal, TBuildSuffix extends string> =
  & (AsRequiredKeys<T, TPartial> extends never ? Builder<TFinal, TBuildSuffix> : object)
  & ObjectBuilderValue<T, TPartial, TFinal, TBuildSuffix>
  & ObjectBuilderArray<T, TPartial, TFinal, TBuildSuffix>
  & ObjectBuilderObject<T, TPartial, TFinal, TBuildSuffix>
  & ObjectBuilderRecord<T, TPartial, TFinal, TBuildSuffix>
  ;

export type ObjectBuilder<T, TFinal, TBuildSuffix extends string> = PartialObjectBuilder<T, {}, TFinal, TBuildSuffix>;
