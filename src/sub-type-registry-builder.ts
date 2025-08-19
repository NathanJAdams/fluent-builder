import { AsSubTypeMetadata, SubTypeMetadata } from './utility-types';

export type SubTypeRegistryBuilder<TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[]> = {
  add: <TBase extends Record<string, any>, TSubUnion extends TBase>
    () => AsSubTypeMetadata<TSubTypeRegistry, TBase> extends never
    ? SubTypeRegistryBuilder<[...TSubTypeRegistry, SubTypeMetadata<TBase, TSubUnion>]>
    : 'Base type is duplicated which would prevent it\'s sub types being available. Alter the base type structure to distinguish it.';
  build: () => TSubTypeRegistry;
};

export const subTypeRegistryBuilderInternal = <TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[]>(entries: TSubTypeRegistry): SubTypeRegistryBuilder<TSubTypeRegistry> => {
  return {
    add: <TBase extends Record<string, any>, TSubUnion extends TBase>() => {
      return subTypeRegistryBuilderInternal([...entries, null as any as SubTypeMetadata<TBase, TSubUnion>] as const) as any;
    },
    build: () => entries,
  };
};
