import { IsABaseType, SubTypeMetadata } from './utility-types';

export type SubTypeRegistryBuilder<TSubTypeRegistry extends readonly SubTypeMetadata<any, any, any>[]> = {
  add: <TBase extends Record<string, any>, TSubUnion extends TBase, TDiscriminator extends string & keyof TBase>
    () => IsABaseType<TSubTypeRegistry, TBase> extends true
    ? `Base type with discriminator '${TDiscriminator}' is duplicated which would prevent it's sub types being available. Either rename the discriminator or alter the base type structure to distinguish it.`
    : SubTypeRegistryBuilder<[...TSubTypeRegistry, SubTypeMetadata<TBase, TSubUnion, TDiscriminator>]>;
  build: () => TSubTypeRegistry;
};

export const subTypeRegistryBuilderInternal = <TSubTypeRegistry extends readonly SubTypeMetadata<any, any, any>[]>(entries: TSubTypeRegistry): SubTypeRegistryBuilder<TSubTypeRegistry> => {
  return {
    add: <TBase extends Record<string, any>, TSubUnion extends TBase, TDiscriminator extends string & keyof TBase>() => {
      return subTypeRegistryBuilderInternal([...entries, null as any as SubTypeMetadata<TBase, TSubUnion, TDiscriminator>] as const) as any;
    },
    build: () => entries,
  };
};
