import { InstanceBuilder } from './instance-builder';
import { RecordBuilder } from './record-builder';
import { SubTypeBuilder } from './sub-type-builder';
import { TupleBuilder } from './tuple-builder';
import { ArrayElementType, AsUnionMetadata, Builder, HasOnlyIndexSignature, IsNonBaseUserType, IsTuple, RecordValueType, UnionMetadata } from './utility-types';

type ArrayBuilderValue<TUnionRegistry extends readonly UnionMetadata<any, any>[], TElement, TFinal, TBuildSuffix extends string> = {
  push: (value: TElement) => ArrayBuilder<TUnionRegistry, TElement, TFinal, TBuildSuffix>;
};

type ArrayBuilderArray<TUnionRegistry extends readonly UnionMetadata<any, any>[], TElement, TFinal, TBuildSuffix extends string> =
  TElement extends any[]
  ? {
    pushArray: () =>
      ArrayBuilder<
        TUnionRegistry,
        ArrayElementType<TElement>,
        ArrayBuilder<TUnionRegistry, TElement, TFinal, TBuildSuffix>,
        'Array'
      >;
  }
  : object;

type ArrayBuilderRecord<TUnionRegistry extends readonly UnionMetadata<any, any>[], TElement, TFinal, TBuildSuffix extends string> =
  HasOnlyIndexSignature<TElement> extends true
  ? {
    pushRecord: () =>
      RecordBuilder<
        TUnionRegistry,
        RecordValueType<TElement>,
        ArrayBuilder<TUnionRegistry, TElement, TFinal, TBuildSuffix>,
        'Record'
      >;
  }
  : object;

type ArrayBuilderSubType<TUnionRegistry extends readonly UnionMetadata<any, any>[], TElement, TFinal, TBuildSuffix extends string> =
  AsUnionMetadata<TUnionRegistry, TElement> extends infer TMetadata
  ? [TMetadata] extends [never]
  ? object
  : TMetadata extends UnionMetadata<infer TBase, infer TUnion>
  ? {
    pushSubType: () =>
      SubTypeBuilder<
        TUnionRegistry,
        TBase,
        TUnion,
        ArrayBuilder<TUnionRegistry, TElement, TFinal, TBuildSuffix>,
        'Element'
      >;
  }
  : object
  : object;

type ArrayBuilderInstance<TUnionRegistry extends readonly UnionMetadata<any, any>[], TElement, TFinal, TBuildSuffix extends string> =
  IsNonBaseUserType<TUnionRegistry, TElement> extends true
  ? {
    pushInstance: () =>
      InstanceBuilder<
        TUnionRegistry,
        TElement,
        ArrayBuilder<TUnionRegistry, TElement, TFinal, TBuildSuffix>,
        'Element'
      >;
  }
  : object;

type ArrayBuilderTuple<TUnionRegistry extends readonly UnionMetadata<any, any>[], TElement, TFinal, TBuildSuffix extends string> =
  IsTuple<TElement> extends true
  ? TElement extends readonly any[]
  ? {
    pushTuple: () =>
      TupleBuilder<
        TUnionRegistry,
        TElement,
        ArrayBuilder<TUnionRegistry, TElement, TFinal, TBuildSuffix>,
        'Element'
      >;
  }
  : object
  : object;

export type ArrayBuilder<
  TUnionRegistry extends readonly UnionMetadata<any, any>[],
  TElement,
  TFinal,
  TBuildSuffix extends string
> =
  & Builder<TFinal, TBuildSuffix>
  & ArrayBuilderValue<TUnionRegistry, TElement, TFinal, TBuildSuffix>
  & ArrayBuilderArray<TUnionRegistry, TElement, TFinal, TBuildSuffix>
  & ArrayBuilderRecord<TUnionRegistry, TElement, TFinal, TBuildSuffix>
  & ArrayBuilderSubType<TUnionRegistry, TElement, TFinal, TBuildSuffix>
  & ArrayBuilderInstance<TUnionRegistry, TElement, TFinal, TBuildSuffix>
  & ArrayBuilderTuple<TUnionRegistry, TElement, TFinal, TBuildSuffix>
  ;
