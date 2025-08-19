import { ArrayBuilder } from './array-builder';
import { InstanceBuilder } from './instance-builder';
import { createBuilder, reducers } from './proxy';
import { RecordBuilder } from './record-builder';
import { SubTypeBuilder } from './sub-type-builder';
import { SubTypeRegistryBuilder, subTypeRegistryBuilderInternal } from './sub-type-registry-builder';
import { ARRAY_SUFFIX, INSTANCE_SUFFIX, RECORD_SUFFIX, SUB_TYPE_SUFFIX } from './suffixes';
import { AsNonBaseUserType, AsSubTypeMetadata, SubTypeMetadata } from './utility-types';

export const arrayBuilder = <TElement, TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[] = []>()
  : ArrayBuilder<TSubTypeRegistry, TElement, TElement[], typeof ARRAY_SUFFIX> => {
  return createBuilder<TElement, TElement[], TElement[]>(reducers.ofArray());
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const instanceBuilder = <TSchema extends Record<string, any>, TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[] = []>(...Non_Empty_User_type_required_for_second_generic_parameter: AsNonBaseUserType<TSubTypeRegistry, TSchema> extends never ? ['❌ Must be a non-empty user type'] : [])
  : InstanceBuilder<TSubTypeRegistry, TSchema, TSchema, typeof INSTANCE_SUFFIX> => {
  return createBuilder<TSchema[string], TSchema, TSchema>(reducers.ofInstance());
};

export const recordBuilder = <TValue, TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[] = []>()
  : RecordBuilder<TSubTypeRegistry, TValue, Record<string, TValue>, typeof RECORD_SUFFIX> => {
  return createBuilder<TValue, Record<string, TValue>, Record<string, TValue>>(reducers.ofRecord());
};

export const subTypeBuilder = <TBase extends Record<string, any>, TSubTypeRegistry extends readonly SubTypeMetadata<any, any>[]>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ...Generic_Parameter_1_BaseType_must_be_contained_in_Generic_Parameter_2_SubTypes: AsSubTypeMetadata<TSubTypeRegistry, TBase> extends never ? ['❌ Must be a base type'] : []
): AsSubTypeMetadata<TSubTypeRegistry, TBase> extends SubTypeMetadata<any, infer TSubUnion> ? SubTypeBuilder<TSubTypeRegistry, TBase, TSubUnion, TBase, typeof SUB_TYPE_SUFFIX> : never => {
  return createBuilder<
    any,
    AsSubTypeMetadata<TSubTypeRegistry, TBase> extends SubTypeMetadata<any, infer TSubUnion>
    ? Partial<Record<keyof TSubUnion, TSubUnion[string]>>
    : never,
    TBase
  >(reducers.ofInstance());
};

export const subTypeRegistryBuilder = (): SubTypeRegistryBuilder<[]> => {
  return subTypeRegistryBuilderInternal([] as const);
};
