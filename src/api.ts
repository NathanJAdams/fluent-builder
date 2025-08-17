import { ArrayBuilder, arrayBuilderInternal } from './array-builder';
import { InstanceBuilder, instanceBuilderInternal } from './instance-builder';
import { RecordBuilder, recordBuilderInternal } from './record-builder';
import { SubTypeBuilder, subTypeBuilderInternal } from './sub-type-builder';
import { SubTypeInfoBuilder, subTypeInfoBuilderInternal } from './sub-type-info-builder';
import { IsABaseType, IsUserType, SubTypeInfo } from './utility-types';

export const arrayBuilder = <TElement, TSubTypes extends readonly SubTypeInfo<any, any, any>[] = []>()
  : ArrayBuilder<TSubTypes, TElement, TElement[], 'Array'> => {
  return arrayBuilderInternal<TSubTypes, TElement, TElement[], 'Array'>();
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const instanceBuilder = <TSchema extends Record<string, any>, TSubTypes extends readonly SubTypeInfo<any, any, any>[] = []>(...Non_Empty_User_type_required_for_second_generic_parameter: IsUserType<TSchema> extends true ? [] : ['❌ Must be a non-empty user type'])
  : InstanceBuilder<TSubTypes, TSchema, {}, TSchema, ''> => {
  return instanceBuilderInternal<TSubTypes, TSchema, TSchema, ''>();
};

export const recordBuilder = <TValue, TSubTypes extends readonly SubTypeInfo<any, any, any>[] = []>()
  : RecordBuilder<TSubTypes, {}, TValue, Record<string, TValue>, 'Record'> => {
  return recordBuilderInternal<TSubTypes, TValue, Record<string, TValue>, 'Record'>();
};

export const subTypeBuilder = <TBase extends Record<string, any>, TSubTypes extends readonly SubTypeInfo<any, any, any>[]>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ...Generic_Parameter_1_BaseType_must_be_contained_in_Generic_Parameter_2_SubTypes: IsABaseType<TSubTypes, TBase> extends true ? [] : ['❌ Must be a base type']
): SubTypeBuilder<TSubTypes, TBase, TBase> => {
  return subTypeBuilderInternal<TSubTypes, TBase, TBase>();
};

export const subTypeInfoBuilder = (): SubTypeInfoBuilder<[]> => {
  return subTypeInfoBuilderInternal([] as const);
};
