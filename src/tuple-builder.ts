import { ArrayBuilder } from './array-builder';
import { ObjectBuilder } from './object-builder';
import { RecordBuilder } from './record-builder';
import { ArrayElementType, Builder, HasOnlyIndexSignature, Increment, IsArray, IsExact, IsTuple, IsUserType, RecordValueType, TupleLength } from './utility-types';

type TupleBuilderValue<TTuple extends readonly any[], TIndex extends number, TFinal, TBuildSuffix extends string> = {
  [K in TIndex as `index${K}`]: (value: TTuple[TIndex]) => IndexedTupleBuilder<TTuple, Increment<TIndex>, TFinal, TBuildSuffix>;
};

type TupleBuilderArray<TTuple extends readonly any[], TIndex extends number, TFinal, TBuildSuffix extends string> =
  IsArray<TTuple[TIndex]> extends true
  ? {
    [K in TIndex as `index${K}Array`]: () =>
      ArrayBuilder<
        ArrayElementType<TTuple[TIndex]>,
        IndexedTupleBuilder<TTuple, Increment<TIndex>, TFinal, TBuildSuffix>,
        `Index${K}`
      >;
  }
  : object;

type TupleBuilderObject<TTuple extends readonly any[], TIndex extends number, TFinal, TBuildSuffix extends string> =
  IsUserType<TTuple[TIndex]> extends true
  ? {
    [K in TIndex as `index${K}Object`]: () =>
      ObjectBuilder<
        TTuple[TIndex],
        IndexedTupleBuilder<TTuple, Increment<TIndex>, TFinal, TBuildSuffix>,
        `Index${K}`
      >;
  }
  : object;

type TupleBuilderRecord<TTuple extends readonly any[], TIndex extends number, TFinal, TBuildSuffix extends string> =
  HasOnlyIndexSignature<TTuple[TIndex]> extends true
  ? {
    [K in TIndex as `index${K}Record`]: () =>
      RecordBuilder<
        RecordValueType<TTuple[TIndex]>,
        IndexedTupleBuilder<TTuple, Increment<TIndex>, TFinal, TBuildSuffix>,
        `Index${K}`
      >;
  }
  : object;

type TupleBuilderTuple<TTuple extends readonly any[], TIndex extends number, TFinal, TBuildSuffix extends string> =
  IsTuple<TTuple[TIndex]> extends true
  ? {
    [K in TIndex as `index${K}Tuple`]: () =>
      TupleBuilder<
        TTuple[TIndex],
        IndexedTupleBuilder<TTuple, Increment<TIndex>, TFinal, TBuildSuffix>,
        `Index${K}`
      >;
  }
  : object;

export type IndexedTupleBuilder<TTuple extends readonly any[], TIndex extends number, TFinal, TBuildSuffix extends string> =
  IsExact<TIndex, TupleLength<TTuple>> extends true
  ? Builder<TFinal, TBuildSuffix>
  : (
    & TupleBuilderValue<TTuple, TIndex, TFinal, TBuildSuffix>
    & TupleBuilderArray<TTuple, TIndex, TFinal, TBuildSuffix>
    & TupleBuilderObject<TTuple, TIndex, TFinal, TBuildSuffix>
    & TupleBuilderRecord<TTuple, TIndex, TFinal, TBuildSuffix>
    & TupleBuilderTuple<TTuple, TIndex, TFinal, TBuildSuffix>
  );

export type TupleBuilder<TTuple extends readonly any[], TFinal, TBuildSuffix extends string> = IndexedTupleBuilder<TTuple, 0, TFinal, TBuildSuffix>;
