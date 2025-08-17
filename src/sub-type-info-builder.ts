import { IsABaseType, SubTypeInfo } from './utility-types';

export type SubTypeInfoBuilder<TSubTypes extends readonly SubTypeInfo<any, any, any>[]> = {
  add: <TBase extends Record<string, any>, TSubUnion extends TBase, TDiscriminator extends string & keyof TBase>
    () => IsABaseType<TSubTypes, TBase> extends true
    ? `Base type with discriminator '${TDiscriminator}' is duplicated which would prevent it's sub types being available. Either rename the discriminator or alter the base type structure to distinguish it.`
    : SubTypeInfoBuilder<[...TSubTypes, SubTypeInfo<TBase, TSubUnion, TDiscriminator>]>;
  build: () => TSubTypes;
};

export const subTypeInfoBuilderInternal = <TSubTypes extends readonly SubTypeInfo<any, any, any>[]>(entries: TSubTypes): SubTypeInfoBuilder<TSubTypes> => {
  return {
    add: <TBase extends Record<string, any>, TSubUnion extends TBase, TDiscriminator extends string & keyof TBase>() => {
      return subTypeInfoBuilderInternal([...entries, null as any as SubTypeInfo<TBase, TSubUnion, TDiscriminator>] as const) as any;
    },
    build: () => entries,
  };
};
