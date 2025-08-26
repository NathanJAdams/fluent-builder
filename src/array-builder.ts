import { Builder } from './builder';
import { suffixes } from './constants';
import { ErrorNotBuildable, ErrorNotValid } from './errors';
import { ObjectBuilderNested } from './object-builder';
import { RecordBuilderNested } from './record-builder';
import { ArrayLengthWithoutRest, ArrayRest, AsArray, AsObject, AsRecord, Increment, IsExact, IsUnion } from './utility-types';

export type ArrayBuilderTopLevel<T> =
  AsArray<T> extends infer TArray
  ? [TArray] extends [never]
  ? ErrorNotValid
  : IsUnion<TArray> extends true
  ? ErrorNotBuildable
  : ArrayBuilderNested<TArray, TArray, typeof suffixes.array>
  : never
  ;
export type ArrayBuilderNested<T, TFinal, TBuildSuffix extends string> =
  AsArray<T> extends infer TArray
  ? [TArray] extends [never]
  ? object
  : IsUnion<TArray> extends true
  ? ErrorNotBuildable
  : TArray extends readonly any[]
  ? ArrayBuilderIndexedOrRest<TArray, 0, ArrayRest<TArray>, TFinal, TBuildSuffix>
  : object
  : never
  ;

type ArrayBuilderIndexedOrRest<TArray extends readonly any[], TIndex extends number, TRest, TFinal, TBuildSuffix extends string> =
  IsExact<ArrayLengthWithoutRest<TArray>, TIndex> extends true
  ? ArrayBuilderRest<TArray, TRest, TFinal, TBuildSuffix>
  : ArrayBuilderIndexed<TArray, TIndex, TRest, TFinal, TBuildSuffix>
  ;

type ArrayBuilderIndexed<TArray extends readonly any[], TIndex extends number, TRest, TFinal, TBuildSuffix extends string> =
  & ArrayBuilderIndexedValue<TArray, TIndex, TRest, TFinal, TBuildSuffix>
  & (
    IsUnion<TArray> extends true
    ? object
    : (
      & ArrayBuilderIndexedArray<TArray, TIndex, TRest, TFinal, TBuildSuffix>
      & ArrayBuilderIndexedRecord<TArray, TIndex, TRest, TFinal, TBuildSuffix>
      & ArrayBuilderIndexedObject<TArray, TIndex, TRest, TFinal, TBuildSuffix>
    )
  )
  ;
type ArrayBuilderRest<TArray extends readonly any[], TRest, TFinal, TBuildSuffix extends string> =
  & Builder<TFinal, TBuildSuffix>
  & (
    [TRest] extends [never]
    ? object
    : (
      & ArrayBuilderRestValue<TArray, TRest, TFinal, TBuildSuffix>
      & (
        IsUnion<TArray> extends true
        ? object
        : (
          & ArrayBuilderRestArray<TArray, TRest, TFinal, TBuildSuffix>
          & ArrayBuilderRestRecord<TArray, TRest, TFinal, TBuildSuffix>
          & ArrayBuilderRestObject<TArray, TRest, TFinal, TBuildSuffix>
        )
      )
    )
  )
  ;

type ArrayBuilderIndexedValue<TArray extends readonly any[], TIndex extends number, TRest, TFinal, TBuildSuffix extends string> = {
  [K in `index${TIndex}`]: (value: TArray[TIndex]) => ArrayBuilderIndexedOrRest<TArray, Increment<TIndex>, TRest, TFinal, TBuildSuffix>;
};
type ArrayBuilderRestValue<TArray extends readonly any[], TRest, TFinal, TBuildSuffix extends string> = {
  push: (value: TRest) => ArrayBuilderRest<TArray, TRest, TFinal, TBuildSuffix>;
};

type ArrayBuilderIndexedArray<TArray extends readonly any[], TIndex extends number, TRest, TFinal, TBuildSuffix extends string> =
  AsArray<TArray[TIndex]> extends infer TNestedElement
  ? [TNestedElement] extends [never]
  ? object
  : {
    [K in TIndex as `index${K}Array`]:
    () =>
      ArrayBuilderNested<
        TNestedElement,
        ArrayBuilderIndexedOrRest<TArray, Increment<TIndex>, TRest, TFinal, TBuildSuffix>,
        `Index${K}`
      >;
  }
  : never
  ;
type ArrayBuilderRestArray<TArray extends readonly any[], TRest, TFinal, TBuildSuffix extends string> =
  AsArray<TRest> extends infer TNestedElement
  ? [TNestedElement] extends [never]
  ? object
  : {
    pushArray:
    () =>
      ArrayBuilderNested<
        TNestedElement,
        ArrayBuilderRest<TArray, TRest, TFinal, TBuildSuffix>,
        'Element'
      >;
  }
  : never
  ;

type ArrayBuilderIndexedObject<TArray extends readonly any[], TIndex extends number, TRest, TFinal, TBuildSuffix extends string> =
  AsObject<TArray[TIndex]> extends infer TNestedElement
  ? [TNestedElement] extends [never]
  ? object
  : {
    [K in TIndex as `index${K}Object`]: () =>
      ObjectBuilderNested<
        TNestedElement,
        ArrayBuilderIndexedOrRest<TArray, Increment<TIndex>, TRest, TFinal, TBuildSuffix>,
        `Index${K}`
      >;
  }
  : never
  ;
type ArrayBuilderRestObject<TArray extends readonly any[], TRest, TFinal, TBuildSuffix extends string> =
  AsObject<TRest> extends infer TNestedElement
  ? [TNestedElement] extends [never]
  ? object
  : {
    pushObject: () =>
      ObjectBuilderNested<
        TRest,
        ArrayBuilderRest<TArray, TRest, TFinal, TBuildSuffix>,
        'Element'
      >;
  }
  : never
  ;

type ArrayBuilderIndexedRecord<TArray extends readonly any[], TIndex extends number, TRest, TFinal, TBuildSuffix extends string> =
  AsRecord<TArray[TIndex]> extends infer TNestedElement
  ? [TNestedElement] extends [never]
  ? object
  : {
    [K in TIndex as `index${K}Record`]: () =>
      RecordBuilderNested<
        TNestedElement,
        ArrayBuilderIndexedOrRest<TArray, Increment<TIndex>, TRest, TFinal, TBuildSuffix>,
        `Index${K}`
      >;
  }
  : never
  ;
type ArrayBuilderRestRecord<TArray extends readonly any[], TRest, TFinal, TBuildSuffix extends string> =
  AsRecord<TRest> extends infer TNestedElement
  ? [TNestedElement] extends [never]
  ? object
  : {
    pushRecord: () =>
      RecordBuilderNested<
        TRest,
        ArrayBuilderRest<TArray, TRest, TFinal, TBuildSuffix>,
        'Element'
      >;
  }
  : never
  ;
