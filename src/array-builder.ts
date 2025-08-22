import { ObjectBuilder } from './object-builder';
import { RecordBuilder } from './record-builder';
import { ArrayLengthWithoutRest, ArrayRest, Builder, Increment, IsExact, IsRecord, IsUserType, RecordValueType } from './utility-types';

type IndexedArrayBuilderValue<TArray extends readonly any[], TFixedLength extends number, TRest, TIndex extends number, TFinal, TBuildSuffix extends string> = {
  [K in TIndex as `index${K}`]: (value: TArray[TIndex]) => IndexedArrayBuilder<TArray, TFixedLength, TRest, Increment<TIndex>, TFinal, TBuildSuffix>;
};
type RestArrayBuilderValue<TElement, TFinal, TBuildSuffix extends string> = {
  push: (value: TElement) => RestArrayBuilder<TElement, TFinal, TBuildSuffix>;
};

type IndexedArrayBuilderArray<TArray extends readonly any[], TFixedLength extends number, TRest, TIndex extends number, TFinal, TBuildSuffix extends string> =
  TArray[TIndex] extends readonly any[]
  ? {
    [K in TIndex as `index${K}Array`]:
    () =>
      ArrayBuilder<
        TArray[TIndex],
        IndexedArrayBuilder<TArray, TFixedLength, TRest, Increment<TIndex>, TFinal, TBuildSuffix>,
        `Index${K}`
      >;
  }
  : object;
type RestArrayBuilderArray<TElement, TFinal, TBuildSuffix extends string> =
  TElement extends readonly any[]
  ? {
    pushArray:
    () =>
      ArrayBuilder<
        TElement,
        RestArrayBuilder<TElement, TFinal, TBuildSuffix>,
        'Element'
      >;
  }
  : object;

type IndexedArrayBuilderObject<TArray extends readonly any[], TFixedLength extends number, TRest, TIndex extends number, TFinal, TBuildSuffix extends string> =
  IsUserType<TArray[TIndex]> extends true
  ? {
    [K in TIndex as `index${K}Object`]: () =>
      ObjectBuilder<
        TArray[TIndex],
        IndexedArrayBuilder<TArray, TFixedLength, TRest, Increment<TIndex>, TFinal, TBuildSuffix>,
        `Index${K}`
      >;
  }
  : object;
type RestArrayBuilderObject<TElement, TFinal, TBuildSuffix extends string> =
  IsUserType<TElement> extends true
  ? {
    pushObject: () =>
      ObjectBuilder<
        TElement,
        RestArrayBuilder<TElement, TFinal, TBuildSuffix>,
        'Element'
      >;
  }
  : object;

type IndexedArrayBuilderRecord<TArray extends readonly any[], TFixedLength extends number, TRest, TIndex extends number, TFinal, TBuildSuffix extends string> =
  IsRecord<TArray[TIndex]> extends true
  ? {
    [K in TIndex as `index${K}Record`]: () =>
      RecordBuilder<
        RecordValueType<TArray[TIndex]>,
        IndexedArrayBuilder<TArray, TFixedLength, TRest, Increment<TIndex>, TFinal, TBuildSuffix>,
        `Index${K}`
      >;
  }
  : object;
type RestArrayBuilderRecord<TElement, TFinal, TBuildSuffix extends string> =
  IsRecord<TElement> extends true
  ? {
    pushRecord: () =>
      RecordBuilder<
        RecordValueType<TElement>,
        RestArrayBuilder<TElement, TFinal, TBuildSuffix>,
        'Element'
      >;
  }
  : object;

type IndexedArrayBuilder<TArray extends readonly any[], TFixedLength extends number, TRest, TIndex extends number, TFinal, TBuildSuffix extends string> =
  IsExact<TFixedLength, TIndex> extends true
  ? RestArrayBuilder<TRest, TFinal, TBuildSuffix>
  : (
    & IndexedArrayBuilderValue<TArray, TFixedLength, TRest, TIndex, TFinal, TBuildSuffix>
    & IndexedArrayBuilderArray<TArray, TFixedLength, TRest, TIndex, TFinal, TBuildSuffix>
    & IndexedArrayBuilderObject<TArray, TFixedLength, TRest, TIndex, TFinal, TBuildSuffix>
    & IndexedArrayBuilderRecord<TArray, TFixedLength, TRest, TIndex, TFinal, TBuildSuffix>
  );

type RestArrayBuilder<TElement, TFinal, TBuildSuffix extends string> =
  & Builder<TFinal, TBuildSuffix>
  & (
    IsExact<TElement, never> extends true
    ? object
    : (
      & RestArrayBuilderValue<TElement, TFinal, TBuildSuffix>
      & RestArrayBuilderArray<TElement, TFinal, TBuildSuffix>
      & RestArrayBuilderObject<TElement, TFinal, TBuildSuffix>
      & RestArrayBuilderRecord<TElement, TFinal, TBuildSuffix>
    )
  )
  ;
export type ArrayBuilder<TArray, TFinal, TBuildSuffix extends string> =
  TArray extends readonly any[]
  ? IndexedArrayBuilder<TArray, ArrayLengthWithoutRest<TArray>, ArrayRest<TArray>, 0, TFinal, TBuildSuffix>
  : never;
