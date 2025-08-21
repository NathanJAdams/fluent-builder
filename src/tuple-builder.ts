import { ArrayBuilder } from './array-builder';
import { InstanceBuilder } from './instance-builder';
import { RecordBuilder } from './record-builder';
import { SubTypeBuilder } from './sub-type-builder';
import { ArrayElementType, AsUnionMetadata, Builder, HasOnlyIndexSignature, IsExact, IsNonBaseUserType, NextTupleIndex, RecordValueType, TupleLength, UnionMetadata } from './utility-types';

type TupleBuilderValue<TUnionRegistry extends readonly UnionMetadata<any, any>[], TTuple extends readonly any[], TIndex extends number, TFinal, TBuildSuffix extends string> = {
  [K in TIndex as `index${K}`]: (value: TTuple[TIndex]) => TupleBuilder<TUnionRegistry, TTuple, NextTupleIndex<TIndex>, TFinal, TBuildSuffix>;
};

type TupleBuilderArray<TUnionRegistry extends readonly UnionMetadata<any, any>[], TTuple extends readonly any[], TIndex extends number, TFinal, TBuildSuffix extends string> =
  TTuple extends any[]
  ? {
    [K in TIndex as `index${K}Array`]: () =>
      ArrayBuilder<
        TUnionRegistry,
        ArrayElementType<TTuple>,
        TupleBuilder<TUnionRegistry, TTuple, NextTupleIndex<TIndex>, TFinal, TBuildSuffix>,
        `Index${K}`
      >;
  }
  : object;

type TupleBuilderRecord<TUnionRegistry extends readonly UnionMetadata<any, any>[], TTuple extends readonly any[], TIndex extends number, TFinal, TBuildSuffix extends string> =
  HasOnlyIndexSignature<TTuple> extends true
  ? {
    [K in TIndex as `index${K}Record`]: () =>
      RecordBuilder<
        TUnionRegistry,
        RecordValueType<TTuple>,
        TupleBuilder<TUnionRegistry, TTuple, NextTupleIndex<TIndex>, TFinal, TBuildSuffix>,
        `Index${K}`
      >;
  }
  : object;

type TupleBuilderSubType<TUnionRegistry extends readonly UnionMetadata<any, any>[], TTuple extends readonly any[], TIndex extends number, TFinal, TBuildSuffix extends string> =
  AsUnionMetadata<TUnionRegistry, TTuple> extends infer TMetadata
  ? [TMetadata] extends [never]
  ? object
  : TMetadata extends UnionMetadata<infer TBase, infer TUnion>
  ? {
    [K in TIndex as `index${K}SubType`]: () =>
      SubTypeBuilder<
        TUnionRegistry,
        TBase,
        TUnion,
        TupleBuilder<TUnionRegistry, TTuple, NextTupleIndex<TIndex>, TFinal, TBuildSuffix>,
        `Index${K}`
      >;
  }
  : object
  : object;

type TupleBuilderInstance<TUnionRegistry extends readonly UnionMetadata<any, any>[], TTuple extends readonly any[], TIndex extends number, TFinal, TBuildSuffix extends string> =
  IsNonBaseUserType<TUnionRegistry, TTuple> extends true
  ? {
    [K in TIndex as `index${K}Instance`]: () =>
      InstanceBuilder<
        TUnionRegistry,
        TTuple,
        TupleBuilder<TUnionRegistry, TTuple, NextTupleIndex<TIndex>, TFinal, TBuildSuffix>,
        `Index${K}`
      >;
  }
  : object;

export type TupleBuilder<
  TUnionRegistry extends readonly UnionMetadata<any, any>[],
  TTuple extends readonly any[],
  TIndex extends number,
  TFinal,
  TBuildSuffix extends string
> =
  IsExact<TIndex, TupleLength<TTuple>> extends true
  ? Builder<TFinal, TBuildSuffix>
  : (
    & TupleBuilderValue<TUnionRegistry, TTuple, TIndex, TFinal, TBuildSuffix>
    & TupleBuilderArray<TUnionRegistry, TTuple, TIndex, TFinal, TBuildSuffix>
    & TupleBuilderRecord<TUnionRegistry, TTuple, TIndex, TFinal, TBuildSuffix>
    & TupleBuilderSubType<TUnionRegistry, TTuple, TIndex, TFinal, TBuildSuffix>
    & TupleBuilderInstance<TUnionRegistry, TTuple, TIndex, TFinal, TBuildSuffix>
  );
