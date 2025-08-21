import { ArrayBuilder } from './array-builder';
import { suffixes } from './constants';
import { ErrorIsArrayNotExtendArray, ErrorIsTupleNotExtendReadonlyArray, ErrorIsUnionUnusableMetadata, ErrorNotBuildable, ErrorUnionNotRegistered, ErrorValidButNotBuildable } from './errors';
import { InstanceBuilder } from './instance-builder';
import { createBuilder } from './proxy';
import { RecordBuilder } from './record-builder';
import { SubTypeBuilder } from './sub-type-builder';
import { TupleBuilder } from './tuple-builder';
import { UnionRegistryBuilder, unionRegistryBuilderInternal } from './union-registry-builder';
import { AsUnionMetadata, HasOnlyIndexSignature, IsArray, IsNonBaseUserType, IsTuple, IsUnion, IsValid, RecordValueType, UnionMetadata } from './utility-types';

export const unionRegistryBuilder = (): UnionRegistryBuilder<[]> => {
  return unionRegistryBuilderInternal([] as const);
};

export const fluentBuilder = <T, TUnionRegistry extends readonly UnionMetadata<any, any>[] = []>(): ReturnType<T, TUnionRegistry> => {
  return createBuilder();
};

type ReturnType<T, TUnionRegistry extends readonly UnionMetadata<any, any>[]> =
  IsValid<T> extends false
    ? ErrorNotBuildable
    : HasOnlyIndexSignature<T> extends true
      ? RecordBuilder<TUnionRegistry, RecordValueType<T>, T, typeof suffixes.record>
      : IsTuple<T> extends true
        ? T extends readonly any[]
          ? TupleBuilder<TUnionRegistry, T, T, typeof suffixes.tuple>
          : ErrorIsTupleNotExtendReadonlyArray
        : IsArray<T> extends true
          ? T extends Array<infer TElement>
            ? ArrayBuilder<TUnionRegistry, TElement, T, typeof suffixes.array>
            : ErrorIsArrayNotExtendArray
          : IsUnion<T> extends true
            ? AsUnionMetadata<TUnionRegistry, T> extends infer TMetadata
              ? [TMetadata] extends [never]
                ? ErrorUnionNotRegistered
                : TMetadata extends UnionMetadata<infer TBase, infer TUnion>
                  ? SubTypeBuilder<TUnionRegistry, TBase, TUnion, T, typeof suffixes.subType>
                  : ErrorIsUnionUnusableMetadata
              : ErrorIsUnionUnusableMetadata
            : IsNonBaseUserType<TUnionRegistry, T> extends true
              ? InstanceBuilder<TUnionRegistry, T, T, typeof suffixes.instance>
              : ErrorValidButNotBuildable
;
