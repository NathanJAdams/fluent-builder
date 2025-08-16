import { InstanceBuilder, instanceBuilderInternal } from './instance-builder';
import { subTypeBuilderInternal, SubTypeChooser } from './sub-type-builder';
import { Builder, FindExactSubTypeInfo, IsABaseType, IsANonBaseUserType, SubTypeInfo } from './utility-types';

type ArrayElementsBuilder<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TElement, TFinal, TBuildSuffix extends string> = {
  add: (value: TElement) => ArrayBuilder<TSubTypes, TElement, TFinal, TBuildSuffix>;
};

type ArrayElementsSubTypeBuilder<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TElement, TFinal, TBuildSuffix extends string> = {
  addSubTypeBuilder: FindExactSubTypeInfo<TSubTypes, TElement> extends SubTypeInfo<infer TBase, infer TSubUnion, infer TDiscriminator>
  ? () => SubTypeChooser<TSubTypes, TBase, TSubUnion, TDiscriminator, ArrayBuilder<TSubTypes, TElement, TFinal, TBuildSuffix>>
  : never;
};

type ArrayElementsNonBaseUserTypeBuilder<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TSchema extends Record<string, any>, TFinal, TBuildSuffix extends string> = {
  addBuilder: () => InstanceBuilder<TSubTypes, TSchema, {}, ArrayBuilder<TSubTypes, TSchema, TFinal, TBuildSuffix>, 'Element'>;
};

export type ArrayBuilder<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TElement, TFinal, TBuildSuffix extends string> =
  & Builder<TFinal, TBuildSuffix>
  & ArrayElementsBuilder<TSubTypes, TElement, TFinal, TBuildSuffix>
  & (IsABaseType<TSubTypes, TElement> extends true ? ArrayElementsSubTypeBuilder<TSubTypes, TElement, TFinal, TBuildSuffix> : object)
  & (IsANonBaseUserType<TSubTypes, TElement> extends true ? TElement extends Record<string, any> ? ArrayElementsNonBaseUserTypeBuilder<TSubTypes, TElement, TFinal, TBuildSuffix> : object : object)
  ;

export const arrayBuilderInternal = <TSubTypes extends readonly SubTypeInfo<any, any, any>[], TElement, TFinal, TBuildSuffix extends string>(
  finalizer: (built: TElement[]) => TFinal = (built) => built as unknown as TFinal,
): ArrayBuilder<TSubTypes, TElement, TFinal, TBuildSuffix> => {
  const array: TElement[] = [];
  const handler: ProxyHandler<any> = {
    get(_, property: string) {
      if (property.startsWith('build')) {
        return () => finalizer(array);
      }
      if (property === 'add') {
        return (value: TElement) => {
          array.push(value);
          return proxy;
        };
      }
      if (property === 'addSubTypeBuilder') {
        return () => {
          return subTypeBuilderInternal(value => {
            array.push(value as TElement);
            return proxy;
          });
        };
      }
      if (property === 'addBuilder') {
        return () => {
          return instanceBuilderInternal(value => {
            array.push(value as TElement);
            return proxy;
          });
        };
      }
      throw Error(`Unrecognized function ${property}()`);
    }
  };
  const proxy = new Proxy({}, handler) as ArrayBuilder<TSubTypes, TElement, TFinal, TBuildSuffix>;
  return proxy;
};
