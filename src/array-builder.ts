import { InstanceBuilder } from './instance-builder';
import { RecordBuilder } from './record-builder';
import { SubTypeBuilder } from './sub-type-builder';
import { ArrayElementType, AsNonBaseUserType, Builder, AsSubTypeMetadata, HasOnlyIndexSignature, RecordValueType, SubTypeMetadata } from './utility-types';

type ArrayBuilderValue<TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[], TElement, TFinal, TBuildSuffix extends string> = {
  push: (value: TElement) => ArrayBuilder<TSubTypeRegistry, TElement, TFinal, TBuildSuffix>;
};

type ArrayBuilderArray<TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[], TElement, TFinal, TBuildSuffix extends string> =
  TElement extends any[]
  ? {
    pushArray: () =>
      ArrayBuilder<
        TSubTypeRegistry,
        ArrayElementType<TElement>,
        ArrayBuilder<TSubTypeRegistry, TElement, TFinal, TBuildSuffix>,
        'Array'
      >;
  }
  : object;

type ArrayBuilderRecord<TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[], TElement, TFinal, TBuildSuffix extends string> =
  HasOnlyIndexSignature<TElement> extends true
  ? {
    pushRecord: () =>
      RecordBuilder<
        TSubTypeRegistry,
        RecordValueType<TElement>,
        ArrayBuilder<TSubTypeRegistry, TElement, TFinal, TBuildSuffix>,
        'Record'
      >;
  }
  : object;

type ArrayBuilderSubType<TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[], TElement, TFinal, TBuildSuffix extends string> =
  AsSubTypeMetadata<TSubTypeRegistry, TElement> extends SubTypeMetadata<infer TBase, infer TSubUnion>
  ? {
    pushSubType: () =>
      SubTypeBuilder<
        TSubTypeRegistry,
        TBase,
        TSubUnion,
        ArrayBuilder<TSubTypeRegistry, TElement, TFinal, TBuildSuffix>,
        'Element'
      >;
  }
  : object;

type ArrayBuilderInstance<TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[], TElement, TFinal, TBuildSuffix extends string> =
  AsNonBaseUserType<TSubTypeRegistry, TElement> extends never
  ? object
  : {
    pushInstance: () =>
      InstanceBuilder<
        TSubTypeRegistry,
        TElement,
        ArrayBuilder<TSubTypeRegistry, TElement, TFinal, TBuildSuffix>,
        'Element'
      >;
  };

export type ArrayBuilder<
  TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[],
  TElement,
  TFinal,
  TBuildSuffix extends string
> =
  & Builder<TFinal, TBuildSuffix>
  & ArrayBuilderValue<TSubTypeRegistry, TElement, TFinal, TBuildSuffix>
  & ArrayBuilderArray<TSubTypeRegistry, TElement, TFinal, TBuildSuffix>
  & ArrayBuilderRecord<TSubTypeRegistry, TElement, TFinal, TBuildSuffix>
  & ArrayBuilderSubType<TSubTypeRegistry, TElement, TFinal, TBuildSuffix>
  & ArrayBuilderInstance<TSubTypeRegistry, TElement, TFinal, TBuildSuffix>
  ;
