import { InstanceBuilder, instanceBuilderInternal } from './instance-builder';
import { subTypeBuilderInternal, SubTypeChooser } from './sub-type-builder';
import { Builder, FindExactSubTypeMetadata, IsABaseType, IsANonBaseUserType, SubTypeMetadata } from './utility-types';

type ArrayElementsBuilder<TSubTypeRegistry extends readonly SubTypeMetadata<any, any, any>[], TElement, TFinal, TBuildSuffix extends string> = {
  add: (value: TElement) => ArrayBuilder<TSubTypeRegistry, TElement, TFinal, TBuildSuffix>;
};

type ArrayElementsSubTypeBuilder<TSubTypeRegistry extends readonly SubTypeMetadata<any, any, any>[], TElement, TFinal, TBuildSuffix extends string> = {
  addSubTypeBuilder: FindExactSubTypeMetadata<TSubTypeRegistry, TElement> extends SubTypeMetadata<infer TBase, infer TSubTypes, infer TDiscriminator>
  ? () => SubTypeChooser<TSubTypeRegistry, TBase, TSubTypes, TDiscriminator, ArrayBuilder<TSubTypeRegistry, TElement, TFinal, TBuildSuffix>>
  : never;
};

type ArrayElementsNonBaseUserTypeBuilder<TSubTypeRegistry extends readonly SubTypeMetadata<any, any, any>[], TSchema extends Record<string, any>, TFinal, TBuildSuffix extends string> = {
  addBuilder: () => InstanceBuilder<TSubTypeRegistry, TSchema, {}, ArrayBuilder<TSubTypeRegistry, TSchema, TFinal, TBuildSuffix>, 'Element'>;
};

export type ArrayBuilder<TSubTypeRegistry extends readonly SubTypeMetadata<any, any, any>[], TElement, TFinal, TBuildSuffix extends string> =
  & Builder<TFinal, TBuildSuffix>
  & ArrayElementsBuilder<TSubTypeRegistry, TElement, TFinal, TBuildSuffix>
  & (IsABaseType<TSubTypeRegistry, TElement> extends true ? ArrayElementsSubTypeBuilder<TSubTypeRegistry, TElement, TFinal, TBuildSuffix> : object)
  & (IsANonBaseUserType<TSubTypeRegistry, TElement> extends true ? TElement extends Record<string, any> ? ArrayElementsNonBaseUserTypeBuilder<TSubTypeRegistry, TElement, TFinal, TBuildSuffix> : object : object)
  ;

export const arrayBuilderInternal = <TSubTypeRegistry extends readonly SubTypeMetadata<any, any, any>[], TElement, TFinal, TBuildSuffix extends string>(
  finalizer: (built: TElement[]) => TFinal = (built) => built as unknown as TFinal,
): ArrayBuilder<TSubTypeRegistry, TElement, TFinal, TBuildSuffix> => {
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
  const proxy = new Proxy({}, handler) as ArrayBuilder<TSubTypeRegistry, TElement, TFinal, TBuildSuffix>;
  return proxy;
};
