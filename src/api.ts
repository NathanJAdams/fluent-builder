import { ArrayBuilder } from './array-builder';
import { InstanceBuilder } from './instance-builder';
import { createBuilder } from './proxy';
import { RecordBuilder } from './record-builder';
import { SubTypeBuilder } from './sub-type-builder';
import { UnionRegistryBuilder, unionRegistryBuilderInternal } from './union-registry-builder';
import { AsUnionMetadata, HasOnlyIndexSignature, IsNonBaseUserType, IsValid, RecordValueType, UnionMetadata } from './utility-types';

export const unionRegistryBuilder = (): UnionRegistryBuilder<[]> => {
  return unionRegistryBuilderInternal([] as const);
};

export const fluentBuilder = <T, TUnionRegistry extends readonly UnionMetadata<any, any>[] = []>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ...Generic_Parameter_1_TType_must_be_a_valid_type: IsValid<T> extends true ? [] : ['❌ Must be a valid type']
)
  : T extends Array<infer TElement>
  ? ArrayBuilder<TUnionRegistry, TElement, T, 'Array'>
  : HasOnlyIndexSignature<T> extends true
  ? RecordBuilder<TUnionRegistry, RecordValueType<T>, T, 'Record'>
  : IsNonBaseUserType<TUnionRegistry, T> extends true
  ? InstanceBuilder<TUnionRegistry, T, T, 'Instance'>
  : AsUnionMetadata<TUnionRegistry, T> extends infer TMetadata
  ? [TMetadata] extends [never]
  ? never
  : TMetadata extends UnionMetadata<infer TBase, infer TUnion>
  ? SubTypeBuilder<TUnionRegistry, TBase, TUnion, T, 'SubType'>
  : never
  : never => {
  return createBuilder();
};
