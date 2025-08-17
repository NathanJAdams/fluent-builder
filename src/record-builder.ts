import { ArrayBuilder, arrayBuilderInternal } from './array-builder';
import { InstanceBuilder, instanceBuilderInternal } from './instance-builder';
import { subTypeBuilderInternal, SubTypeChooser } from './sub-type-builder';
import { ArrayElementType, Builder, FindExactSubTypeInfo, IsABaseType, IsANonBaseUserType, IsExact, IsSingleLevelArray, SubTypeInfo } from './utility-types';

type UnusedName<TEntries, TName extends string> = TName extends keyof TEntries ? never : TName;

type RecordEntryBuilder<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TEntries extends Record<string, TValue>, TValue, TFinal> = {
  add: <TName extends string> (name: UnusedName<TEntries, TName>, value: TValue) => RecordBuilder<TSubTypes, TEntries & { [K in TName]: TValue }, TValue, IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal, UnusedName<TEntries, TName>>;
};

type RecordEntryArrayBuilder<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TEntries extends Record<string, TValue>, TValue, TFinal, TBuildSuffix extends string> = {
  addArrayBuilder: <TName extends string>(name: UnusedName<TEntries, TName>) => ArrayBuilder<TSubTypes, ArrayElementType<TValue>, RecordBuilder<TSubTypes, TEntries & { [K in TName]: TValue }, TValue, IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal, TBuildSuffix>, TName>;
};

type RecordEntrySubTypeBuilder<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TEntries extends Record<string, TValue>, TValue, TFinal, TBuildSuffix extends string> = {
  addSubTypeBuilder: FindExactSubTypeInfo<TSubTypes, TValue> extends SubTypeInfo<infer TBase, infer TSubUnion, infer TDiscriminator>
  ? <TName extends string>(name: UnusedName<TEntries, TName>) => SubTypeChooser<
    TSubTypes, TBase, TSubUnion, TDiscriminator,
    RecordBuilder<TSubTypes, TEntries & { [K in TName]: TValue }, TValue, IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal, TBuildSuffix>,
    UnusedName<TEntries, TName>
  >
  : never;
};

type RecordEntryNonBaseUserTypeBuilder<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TEntries extends Record<string, TValue>, TValue extends Record<string, any>, TFinal, TBuildSuffix extends string> = {
  addBuilder: <TName extends string>(name: UnusedName<TEntries, TName>) => InstanceBuilder<
    TSubTypes,
    TValue,
    {},
    RecordBuilder<TSubTypes, TEntries & { [K in TName]: TValue }, TValue, IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal, TBuildSuffix>,
    UnusedName<TEntries, TName>
  >;
};

export type RecordBuilder<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TEntries extends Record<string, TValue>, TValue, TFinal, TBuildSuffix extends string> =
  & Builder<TFinal, TBuildSuffix>
  & RecordEntryBuilder<TSubTypes, TEntries, TValue, TFinal>
  & (IsSingleLevelArray<TValue> extends true ? RecordEntryArrayBuilder<TSubTypes, TEntries, TValue, TFinal, TBuildSuffix> : object)
  & (IsABaseType<TSubTypes, TValue> extends true ? RecordEntrySubTypeBuilder<TSubTypes, TEntries, TValue, TFinal, TBuildSuffix> : object)
  & (IsANonBaseUserType<TSubTypes, TValue> extends true ? TValue extends Record<string, any> ? RecordEntryNonBaseUserTypeBuilder<TSubTypes, TEntries, TValue, TFinal, TBuildSuffix> : object : object)
  ;

export const recordBuilderInternal = <TSubTypes extends readonly SubTypeInfo<any, any, any>[], TValue, TFinal, TBuildSuffix extends string>(
  finalizer: (built: Record<string, TValue>) => TFinal = (built) => built as unknown as TFinal,
): RecordBuilder<TSubTypes, {}, TValue, TFinal, TBuildSuffix> => {
  const entries: Record<string, TValue> = {};
  const handler: ProxyHandler<any> = {
    get(_, property: string) {
      if (property.startsWith('build')) {
        return () => finalizer(entries);
      }
      if (property === 'add') {
        return (name: string, value: TValue) => {
          entries[name] = value;
          return proxy;
        };
      }
      if (property === 'addArrayBuilder') {
        return (name: string) => {
          return arrayBuilderInternal(value => {
            entries[name] = value as TValue;
            return proxy;
          });
        };
      }
      if (property === 'addSubTypeBuilder') {
        return (name: string) => {
          return subTypeBuilderInternal(value => {
            entries[name] = value as TValue;
            return proxy;
          });
        };
      }
      if (property === 'addBuilder') {
        return (name: string) => {
          return instanceBuilderInternal(value => {
            entries[name] = value as TValue;
            return proxy;
          });
        };
      }
      throw Error(`Unrecognized function ${property}()`);
    }
  };
  const proxy = new Proxy({}, handler) as RecordBuilder<TSubTypes, {}, TValue, TFinal, TBuildSuffix>;
  return proxy;
};
