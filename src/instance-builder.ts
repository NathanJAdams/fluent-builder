import { ArrayBuilder, arrayBuilderInternal } from './array-builder';
import { RecordBuilder, recordBuilderInternal } from './record-builder';
import { subTypeBuilderInternal, SubTypeChooser } from './sub-type-builder';
import { ArrayElementType, Builder, FindExactSubTypeInfo, HasRequiredKeys, IsABaseType, IsANonBaseUserType, IsExact, IsSingleLevelArray, RecordValueType, SubTypeInfo } from './utility-types';

const BUILDER_SUFFIX = 'Builder';
const USER_TYPE_SUFFIX = BUILDER_SUFFIX;
const SUB_TYPE_SUFFIX = `SubType${BUILDER_SUFFIX}`;
const RECORD_SUFFIX = `Record${BUILDER_SUFFIX}`;
const ARRAY_SUFFIX = `Array${BUILDER_SUFFIX}`;

type UnusedKeys<TSchema extends Record<string, any>, TPartial extends Partial<TSchema>> = string & Exclude<keyof TSchema, keyof TPartial>;

type ValueSetterFields<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TSchema extends Record<string, any>, TPartial extends Partial<TSchema>, TFinal, TBuildSuffix extends string> = {
  [K in UnusedKeys<TSchema, TPartial>]:
  (value: TSchema[K]) => InstanceBuilder<TSubTypes, TSchema, TPartial & { [P in K]: TSchema[K] }, TFinal, TBuildSuffix>;
};

type ArrayBuilderFields<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TSchema extends Record<string, any>, TPartial extends Partial<TSchema>, TFinal, TBuildSuffix extends string> = {
  [K in UnusedKeys<TSchema, TPartial> as IsSingleLevelArray<TSchema[K]> extends true ? `${K}${typeof ARRAY_SUFFIX}` : never]:
  () => ArrayBuilder<TSubTypes, ArrayElementType<TSchema[K]>, InstanceBuilder<TSubTypes, TSchema, TPartial & { [P in K]: TSchema[K] }, TFinal, TBuildSuffix>, K>;
};

type SubTypeBuilderFields<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TSchema extends Record<string, any>, TPartial extends Partial<TSchema>, TFinal, TBuildSuffix extends string> = {
  [K in UnusedKeys<TSchema, TPartial> as IsABaseType<TSubTypes, TSchema[K]> extends true ? `${K}${typeof SUB_TYPE_SUFFIX}` : never]:
  FindExactSubTypeInfo<TSubTypes, TSchema[K]> extends SubTypeInfo<infer TBase, infer TSubUnion, infer TDiscriminator>
  ? () => SubTypeChooser<TSubTypes, TBase, TSubUnion, TDiscriminator, InstanceBuilder<TSubTypes, TSchema, TPartial & { [P in K]: TSchema[K] }, TFinal, TBuildSuffix>, K>
  : never;
};

type NonBaseUserTypeBuilderFields<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TSchema extends Record<string, any>, TPartial extends Partial<TSchema>, TFinal, TBuildSuffix extends string> = {
  [K in UnusedKeys<TSchema, TPartial> as IsANonBaseUserType<TSubTypes, TSchema[K]> extends true ? `${K}${typeof USER_TYPE_SUFFIX}` : never]:
  () => InstanceBuilder<TSubTypes, TSchema[K], {}, InstanceBuilder<TSubTypes, TSchema, TPartial & { [P in K]: TSchema[K] }, TFinal, TBuildSuffix>, K>
};

type RecordBuilderFields<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TSchema extends Record<string, any>, TPartial extends Partial<TSchema>, TFinal, TBuildSuffix extends string> = {
  [K in UnusedKeys<TSchema, TPartial> as IsExact<TSchema[K], Record<string, RecordValueType<TSchema[K]>>> extends true ? `${K}${typeof RECORD_SUFFIX}` : never]:
  () => RecordBuilder<TSubTypes, {}, RecordValueType<TSchema[K]>, InstanceBuilder<TSubTypes, TSchema, TPartial & { [P in K]: TSchema[K] }, TFinal, TBuildSuffix>, K>
};

export type InstanceBuilder<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TSchema extends Record<string, any>, TPartial extends Partial<TSchema>, TFinal, TBuildSuffix extends string> =
  & (HasRequiredKeys<TSchema, TPartial> extends true ? object : Builder<TFinal, TBuildSuffix>)
  & ValueSetterFields<TSubTypes, TSchema, TPartial, TFinal, TBuildSuffix>
  & ArrayBuilderFields<TSubTypes, TSchema, TPartial, TFinal, TBuildSuffix>
  & SubTypeBuilderFields<TSubTypes, TSchema, TPartial, TFinal, TBuildSuffix>
  & NonBaseUserTypeBuilderFields<TSubTypes, TSchema, TPartial, TFinal, TBuildSuffix>
  & RecordBuilderFields<TSubTypes, TSchema, TPartial, TFinal, TBuildSuffix>
  ;

export const instanceBuilderInternal = <TSubTypes extends readonly SubTypeInfo<any, any, any>[], TSchema extends Record<string, any>, TFinal, TBuildSuffix extends string>(
  finalizer: (built: TSchema) => TFinal = (built) => built as unknown as TFinal,
): InstanceBuilder<TSubTypes, TSchema, {}, TFinal, TBuildSuffix> => {
  const values = {} as TSchema;
  const handler: ProxyHandler<any> = {
    get(_, property: string) {
      if (property.startsWith('build')) {
        return () => finalizer(values);
      }
      if (property.endsWith(ARRAY_SUFFIX)) {
        const key = property.substring(0, property.length - ARRAY_SUFFIX.length) as keyof TSchema;
        return () => {
          return arrayBuilderInternal(value => {
            values[key] = value as TSchema[keyof TSchema];
            return proxy;
          });
        };
      }
      if (property.endsWith(RECORD_SUFFIX)) {
        const key = property.substring(0, property.length - RECORD_SUFFIX.length) as keyof TSchema;
        return () => {
          return recordBuilderInternal(value => {
            values[key] = value as TSchema[keyof TSchema];
            return proxy;
          });
        };
      }
      if (property.endsWith(SUB_TYPE_SUFFIX)) {
        const key = property.substring(0, property.length - SUB_TYPE_SUFFIX.length) as keyof TSchema;
        return () => {
          return subTypeBuilderInternal(value => {
            values[key] = value as TSchema[keyof TSchema];
            return proxy;
          });
        };
      }
      // must come last in the builder functions, as it just uses 'Builder'
      if (property.endsWith(USER_TYPE_SUFFIX)) {
        const key = property.substring(0, property.length - USER_TYPE_SUFFIX.length) as keyof TSchema;
        return () => {
          return instanceBuilderInternal(value => {
            values[key] = value as TSchema[keyof TSchema];
            return proxy;
          });
        };
      }
      return (value: TSchema[keyof TSchema]) => {
        const key = property as keyof TSchema;
        values[key] = value;
        return proxy;
      };
    }
  };
  const proxy = new Proxy({}, handler) as InstanceBuilder<TSubTypes, TSchema, {}, TFinal, TBuildSuffix>;
  return proxy;
};
