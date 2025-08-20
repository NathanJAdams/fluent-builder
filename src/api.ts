import { ArrayBuilder } from './array-builder';
import { InstanceBuilder } from './instance-builder';
import { createBuilder } from './proxy';
import { RecordBuilder } from './record-builder';
import { SubTypeBuilder } from './sub-type-builder';
import { SubTypeRegistryBuilder, subTypeRegistryBuilderInternal } from './sub-type-registry-builder';
import { AsSubTypeMetadata, HasOnlyIndexSignature, IsNonBaseUserType, IsValid, RecordValueType, SubTypeMetadata } from './utility-types';

export const subTypeRegistryBuilder = (): SubTypeRegistryBuilder<[]> => {
  return subTypeRegistryBuilderInternal([] as const);
};

export const fluentBuilder = <TType, TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[] = []>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ...Generic_Parameter_1_TType_must_be_a_valid_type: IsValid<TType> extends true ? [] : ['❌ Must be a valid type']
)
  : TType extends Array<infer TElement>
  ? ArrayBuilder<TSubTypeRegistry, TElement, TType, 'Array'>
  : HasOnlyIndexSignature<TType> extends true
  ? RecordBuilder<TSubTypeRegistry, RecordValueType<TType>, TType, 'Record'>
  : IsNonBaseUserType<TSubTypeRegistry, TType> extends true
  ? InstanceBuilder<TSubTypeRegistry, TType, TType, 'Instance'>
  : AsSubTypeMetadata<TSubTypeRegistry, TType> extends infer TMetadata
  ? [TMetadata] extends [never]
  ? never
  : TMetadata extends SubTypeMetadata<infer TBase, infer TSubUnion>
  ? SubTypeBuilder<TSubTypeRegistry, TBase, TSubUnion, TType, 'SubType'>
  : never
  : never => {
  return createBuilder();
};
