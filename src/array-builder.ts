import { InstanceBuilder, instanceBuilderInternal } from './instance-builder';
import { subTypeBuilderInternal, SubTypeChooser } from './sub-type-builder';
import { Builder, FindExactSubTypeInfo, IsABaseType, IsANonBaseUserType, SubTypeInfo } from './utility-types';

type ArrayElementsBuilder<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TElement, TFinal = TElement[]> = {
  add: (value: TElement) => ArrayBuilder<TSubTypes, TElement, TFinal>;
};

type ArrayElementsSubTypeBuilder<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TElement, TFinal = TElement[]> = {
  addSubType: FindExactSubTypeInfo<TSubTypes, TElement> extends SubTypeInfo<infer TBase, infer TSubUnion, infer TDiscriminator>
  ? () => SubTypeChooser<TSubTypes, TBase, TSubUnion, TDiscriminator, ArrayBuilder<TSubTypes, TElement, TFinal>>
  : never;
};

type ArrayElementsNonBaseUserTypeBuilder<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TSchema extends Record<string, any>, TFinal = TSchema[]> = {
  addBuilder: () => InstanceBuilder<TSubTypes, TSchema, {}, ArrayBuilder<TSubTypes, TSchema, TFinal>>;
};

export type ArrayBuilder<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TElement, TFinal = TElement[]> =
  & Builder<TFinal>
  & ArrayElementsBuilder<TSubTypes, TElement, TFinal>
  & (IsABaseType<TSubTypes, TElement> extends true ? ArrayElementsSubTypeBuilder<TSubTypes, TElement, TFinal> : object)
  & (IsANonBaseUserType<TSubTypes, TElement> extends true ? TElement extends Record<string, any> ? ArrayElementsNonBaseUserTypeBuilder<TSubTypes, TElement, TFinal> : object : object)
  ;

export const arrayBuilderInternal = <TSubTypes extends readonly SubTypeInfo<any, any, any>[], TElement, TFinal = TElement[]>(
  finalizer: (built: TElement[]) => TFinal = (built) => built as unknown as TFinal,
): ArrayBuilder<TSubTypes, TElement, TFinal> => {
  const array: TElement[] = [];
  const handler: ProxyHandler<any> = {
    get(_, property: string) {
      if (property === 'build') {
        return () => finalizer(array);
      }
      if (property === 'add') {
        return (value: TElement) => {
          array.push(value);
          return proxy;
        };
      }
      if (property === 'addSubType') {
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
  const proxy = new Proxy({}, handler) as ArrayBuilder<TSubTypes, TElement, TFinal>;
  return proxy;
};
