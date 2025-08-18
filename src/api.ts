import { ArrayBuilder, arrayBuilderInternal } from './array-builder';
import { InstanceBuilder, instanceBuilderInternal } from './instance-builder';
import { RecordBuilder, recordBuilderInternal } from './record-builder';
import { SubTypeBuilder, subTypeBuilderInternal } from './sub-type-builder';
import { SubTypeRegistryBuilder, subTypeRegistryBuilderInternal } from './sub-type-registry-builder';
import { IsABaseType, IsUserType, SubTypeMetadata } from './utility-types';

export const arrayBuilder = <TElement, TSubTypeRegistry extends readonly SubTypeMetadata<any, any, any>[] = []>()
  : ArrayBuilder<TSubTypeRegistry, TElement, TElement[], 'Array'> => {
  return arrayBuilderInternal<TSubTypeRegistry, TElement, TElement[], 'Array'>();
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const instanceBuilder = <TSchema extends Record<string, any>, TSubTypeRegistry extends readonly SubTypeMetadata<any, any, any>[] = []>(...Non_Empty_User_type_required_for_second_generic_parameter: IsUserType<TSchema> extends true ? [] : ['❌ Must be a non-empty user type'])
  : InstanceBuilder<TSubTypeRegistry, TSchema, {}, TSchema, ''> => {
  return instanceBuilderInternal<TSubTypeRegistry, TSchema, TSchema, ''>();
};

export const recordBuilder = <TValue, TSubTypeRegistry extends readonly SubTypeMetadata<any, any, any>[] = []>()
  : RecordBuilder<TSubTypeRegistry, {}, TValue, Record<string, TValue>, 'Record'> => {
  return recordBuilderInternal<TSubTypeRegistry, TValue, Record<string, TValue>, 'Record'>();
};

export const subTypeBuilder = <TBase extends Record<string, any>, TSubTypeRegistry extends readonly SubTypeMetadata<any, any, any>[]>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ...Generic_Parameter_1_BaseType_must_be_contained_in_Generic_Parameter_2_SubTypes: IsABaseType<TSubTypeRegistry, TBase> extends true ? [] : ['❌ Must be a base type']
): SubTypeBuilder<TSubTypeRegistry, TBase, TBase> => {
  return subTypeBuilderInternal<TSubTypeRegistry, TBase, TBase>();
};

export const subTypeRegistryBuilder = (): SubTypeRegistryBuilder<[]> => {
  return subTypeRegistryBuilderInternal([] as const);
};
