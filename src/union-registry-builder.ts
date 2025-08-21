import { AsUnionMetadata, UnionMetadata } from './utility-types';

export type UnionRegistryBuilder<TUnionRegistry extends readonly UnionMetadata<any, any>[]> = {
  register: <TBase, TUnion extends TBase>
    () => AsUnionMetadata<TUnionRegistry, TBase> extends never
    ? UnionRegistryBuilder<[...TUnionRegistry, UnionMetadata<TBase, TUnion>]>
    : 'Base type is duplicated which would prevent it\'s sub types being available. Alter the base type structure to distinguish it.';
  build: () => TUnionRegistry;
};

export const unionRegistryBuilderInternal = <TUnionRegistry extends readonly UnionMetadata<any, any>[]>(entries: TUnionRegistry): UnionRegistryBuilder<TUnionRegistry> => {
  return {
    register: <TBase, TUnion extends TBase>() => {
      return unionRegistryBuilderInternal([...entries, null as any as UnionMetadata<TBase, TUnion>] as const) as any;
    },
    build: () => entries,
  };
};
