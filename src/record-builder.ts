import { ArrayBuilder, arrayBuilderInternal } from './array-builder';
import { InstanceBuilder, instanceBuilderInternal } from './instance-builder';
import { subTypeBuilderInternal, SubTypeChooser } from './sub-type-builder';
import { ArrayElementType, Builder, FindExactSubTypeMetadata, IsABaseType, IsANonBaseUserType, IsExact, IsSingleLevelArray, SubTypeMetadata } from './utility-types';

type UnusedName<TEntries, TName extends string> = TName extends keyof TEntries ? never : TName;

type RecordEntryBuilder<TSubTypeRegistry extends readonly SubTypeMetadata<any, any, any>[], TEntries extends Record<string, TValue>, TValue, TFinal> = {
  add: <TName extends string> (name: UnusedName<TEntries, TName>, value: TValue) => RecordBuilder<TSubTypeRegistry, TEntries & { [K in TName]: TValue }, TValue, IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal, UnusedName<TEntries, TName>>;
};

type RecordEntryArrayBuilder<TSubTypeRegistry extends readonly SubTypeMetadata<any, any, any>[], TEntries extends Record<string, TValue>, TValue, TFinal, TBuildSuffix extends string> = {
  addArrayBuilder: <TName extends string>(name: UnusedName<TEntries, TName>) => ArrayBuilder<TSubTypeRegistry, ArrayElementType<TValue>, RecordBuilder<TSubTypeRegistry, TEntries & { [K in TName]: TValue }, TValue, IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal, TBuildSuffix>, TName>;
};

type RecordEntrySubTypeBuilder<TSubTypeRegistry extends readonly SubTypeMetadata<any, any, any>[], TEntries extends Record<string, TValue>, TValue, TFinal, TBuildSuffix extends string> = {
  addSubTypeBuilder: FindExactSubTypeMetadata<TSubTypeRegistry, TValue> extends SubTypeMetadata<infer TBase, infer TSubTypes, infer TDiscriminator>
  ? <TName extends string>(name: UnusedName<TEntries, TName>) => SubTypeChooser<
    TSubTypeRegistry, TBase, TSubTypes, TDiscriminator,
    RecordBuilder<TSubTypeRegistry, TEntries & { [K in TName]: TValue }, TValue, IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal, TBuildSuffix>,
    UnusedName<TEntries, TName>
  >
  : never;
};

type RecordEntryNonBaseUserTypeBuilder<TSubTypeRegistry extends readonly SubTypeMetadata<any, any, any>[], TEntries extends Record<string, TValue>, TValue extends Record<string, any>, TFinal, TBuildSuffix extends string> = {
  addBuilder: <TName extends string>(name: UnusedName<TEntries, TName>) => InstanceBuilder<
    TSubTypeRegistry,
    TValue,
    {},
    RecordBuilder<TSubTypeRegistry, TEntries & { [K in TName]: TValue }, TValue, IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal, TBuildSuffix>,
    UnusedName<TEntries, TName>
  >;
};

export type RecordBuilder<TSubTypeRegistry extends readonly SubTypeMetadata<any, any, any>[], TEntries extends Record<string, TValue>, TValue, TFinal, TBuildSuffix extends string> =
  & Builder<TFinal, TBuildSuffix>
  & RecordEntryBuilder<TSubTypeRegistry, TEntries, TValue, TFinal>
  & (IsSingleLevelArray<TValue> extends true ? RecordEntryArrayBuilder<TSubTypeRegistry, TEntries, TValue, TFinal, TBuildSuffix> : object)
  & (IsABaseType<TSubTypeRegistry, TValue> extends true ? RecordEntrySubTypeBuilder<TSubTypeRegistry, TEntries, TValue, TFinal, TBuildSuffix> : object)
  & (IsANonBaseUserType<TSubTypeRegistry, TValue> extends true ? TValue extends Record<string, any> ? RecordEntryNonBaseUserTypeBuilder<TSubTypeRegistry, TEntries, TValue, TFinal, TBuildSuffix> : object : object)
  ;

export const recordBuilderInternal = <TSubTypeRegistry extends readonly SubTypeMetadata<any, any, any>[], TValue, TFinal, TBuildSuffix extends string>(
  finalizer: (built: Record<string, TValue>) => TFinal = (built) => built as unknown as TFinal,
): RecordBuilder<TSubTypeRegistry, {}, TValue, TFinal, TBuildSuffix> => {
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
  const proxy = new Proxy({}, handler) as RecordBuilder<TSubTypeRegistry, {}, TValue, TFinal, TBuildSuffix>;
  return proxy;
};
