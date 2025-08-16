import { InstanceBuilder, instanceBuilderInternal } from './instance-builder';
import { FindExactSubTypeInfo, SubTypeInfo } from './utility-types';

export type SubTypeChooser<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TBase extends Record<string, any>, TSubUnion extends TBase, TDiscriminator extends keyof TBase & string, TFinal = TBase> = {
  [K in TDiscriminator]: <V extends TSubUnion[TDiscriminator]>(value: V) => InstanceBuilder<TSubTypes, Omit<Extract<TSubUnion, { [P in K]: V }>, TDiscriminator>, {}, TFinal>;
};

export type SubTypeBuilder<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TBase extends Record<string, any>, TFinal = TBase> =
  SubTypeChooser<
    TSubTypes,
    TBase,
    FindExactSubTypeInfo<TSubTypes, TBase> extends SubTypeInfo<any, infer TSubUnion, any> ? TSubUnion : never,
    FindExactSubTypeInfo<TSubTypes, TBase> extends SubTypeInfo<any, any, infer TDiscriminator> ? TDiscriminator : never,
    TFinal
  >;

export const subTypeBuilderInternal = <TSubTypes extends readonly SubTypeInfo<any, any, any>[], TBase extends Record<string, any>, TFinal = TBase>(
  finalizer: (built: TBase) => TFinal = (built) => built as unknown as TFinal
): SubTypeBuilder<TSubTypes, TBase, TFinal> => {
  return instanceBuilderInternal<TSubTypes, TBase, TFinal>(finalizer) as SubTypeBuilder<TSubTypes, TBase, TFinal>;
};
