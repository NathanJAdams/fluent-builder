import { ObjectBuilder } from './object-builder';
import { RecordBuilder } from './record-builder';
import { TupleBuilder } from './tuple-builder';
import { ArrayElementType, Builder, HasOnlyIndexSignature, IsArray, IsTuple, IsUserType, RecordValueType } from './utility-types';

type ArrayBuilderValue<TElement, TFinal, TBuildSuffix extends string> = {
  push: (value: TElement) => ArrayBuilder<TElement, TFinal, TBuildSuffix>;
};

type ArrayBuilderArray<TElement, TFinal, TBuildSuffix extends string> =
  IsArray<TElement> extends true
  ? {
    pushArray: () =>
      ArrayBuilder<
        ArrayElementType<TElement>,
        ArrayBuilder<TElement, TFinal, TBuildSuffix>,
        'Element'
      >;
  }
  : object;

type ArrayBuilderObject<TElement, TFinal, TBuildSuffix extends string> =
  IsUserType<TElement> extends true
  ? {
    pushObject: () =>
      ObjectBuilder<
        TElement,
        ArrayBuilder<TElement, TFinal, TBuildSuffix>,
        'Element'
      >;
  }
  : object;

type ArrayBuilderRecord<TElement, TFinal, TBuildSuffix extends string> =
  HasOnlyIndexSignature<TElement> extends true
  ? {
    pushRecord: () =>
      RecordBuilder<
        RecordValueType<TElement>,
        ArrayBuilder<TElement, TFinal, TBuildSuffix>,
        'Element'
      >;
  }
  : object;

type ArrayBuilderTuple<TElement, TFinal, TBuildSuffix extends string> =
  IsTuple<TElement> extends true
  ? TElement extends readonly any[]
  ? {
    pushTuple: () =>
      TupleBuilder<
        TElement,
        ArrayBuilder<TElement, TFinal, TBuildSuffix>,
        'Element'
      >;
  }
  : object
  : object;

export type ArrayBuilder<
  TElement,
  TFinal,
  TBuildSuffix extends string
> =
  & Builder<TFinal, TBuildSuffix>
  & ArrayBuilderValue<TElement, TFinal, TBuildSuffix>
  & ArrayBuilderArray<TElement, TFinal, TBuildSuffix>
  & ArrayBuilderObject<TElement, TFinal, TBuildSuffix>
  & ArrayBuilderRecord<TElement, TFinal, TBuildSuffix>
  & ArrayBuilderTuple<TElement, TFinal, TBuildSuffix>
  ;
