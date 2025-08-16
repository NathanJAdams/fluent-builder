import { InstanceBuilder, instanceBuilderInternal } from './instance-builder';
import { subTypeBuilderInternal, SubTypeChooser } from './sub-type-builder';
import { Builder, FindExactSubTypeInfo, IsABaseType, IsANonBaseUserType, IsExact, SubTypeInfo } from './utility-types';

type UnusedName<TEntries, TName extends string> = TName extends keyof TEntries ? never : TName;

type RecordEntryBuilder<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TEntries extends Record<string, TValue>, TValue, TFinal = TEntries> = {
  add: <TName extends string> (name: UnusedName<TEntries, TName>, value: TValue) => RecordBuilder<TSubTypes, TEntries & { [K in TName]: TValue }, TValue, IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal>;
};

type RecordEntrySubTypeBuilder<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TEntries extends Record<string, TValue>, TValue, TFinal = TEntries> = {
  addSubType: FindExactSubTypeInfo<TSubTypes, TValue> extends SubTypeInfo<infer TBase, infer TSubUnion, infer TDiscriminator>
  ? <TName extends string>(name: UnusedName<TEntries, TName>) => SubTypeChooser<TSubTypes, TBase, TSubUnion, TDiscriminator, RecordBuilder<TSubTypes, TEntries & { [K in TName]: TValue }, TValue, IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal>>
  : never;
};

type RecordEntryNonBaseUserTypeBuilder<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TEntries extends Record<string, TValue>, TValue extends Record<string, any>, TFinal = TEntries> = {
  addBuilder: <TName extends string>(name: UnusedName<TEntries, TName>) => InstanceBuilder<TSubTypes, TValue, {}, RecordBuilder<TSubTypes, TEntries & { [K in TName]: TValue }, TValue, IsExact<TFinal, TEntries> extends true ? TEntries & { [K in TName]: TValue } : TFinal>>;
};

export type RecordBuilder<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TEntries extends Record<string, TValue>, TValue, TFinal = TEntries> =
  & Builder<TFinal>
  & RecordEntryBuilder<TSubTypes, TEntries, TValue, TFinal>
  & (IsABaseType<TSubTypes, TValue> extends true ? RecordEntrySubTypeBuilder<TSubTypes, TEntries, TValue, TFinal> : object)
  & (IsANonBaseUserType<TSubTypes, TValue> extends true ? TValue extends Record<string, any> ? RecordEntryNonBaseUserTypeBuilder<TSubTypes, TEntries, TValue, TFinal> : object : object)
  ;

export const recordBuilderInternal = <TSubTypes extends readonly SubTypeInfo<any, any, any>[], TValue, TFinal = {}>(
  finalizer: (built: Record<string, TValue>) => TFinal = (built) => built as unknown as TFinal,
): RecordBuilder<TSubTypes, {}, TValue, TFinal> => {
  const entries: Record<string, TValue> = {};
  const handler: ProxyHandler<any> = {
    get(_, property: string) {
      if (property === 'build') {
        return () => finalizer(entries);
      }
      if (property === 'add') {
        return (name: string, value: TValue) => {
          entries[name] = value;
          return proxy;
        };
      }
      if (property === 'addSubType') {
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
  const proxy = new Proxy({}, handler) as RecordBuilder<TSubTypes, {}, TValue, TFinal>;
  return proxy;
};
