import { InstanceBuilder, instanceBuilderInternal } from './instance-builder';
import { FindExactSubTypeInfo, SubTypeInfo } from './utility-types';

export type SubTypeChooser<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TBase extends Record<string, any>, TSubUnion extends TBase, TDiscriminator extends keyof TBase & string, TFinal, TBuildSuffix extends string | undefined = undefined> = {
  [K in TDiscriminator]: <V extends TSubUnion[TDiscriminator]>(value: V) => InstanceBuilder<TSubTypes, Omit<Extract<TSubUnion, { [P in K]: V }>, TDiscriminator>, {}, TFinal, TBuildSuffix extends string ? TBuildSuffix : V>;
};

export type SubTypeBuilder<TSubTypes extends readonly SubTypeInfo<any, any, any>[], TBase extends Record<string, any>, TFinal, TBuildSuffix extends string | undefined = undefined> =
  SubTypeChooser<
    TSubTypes,
    TBase,
    FindExactSubTypeInfo<TSubTypes, TBase> extends SubTypeInfo<any, infer TSubUnion, any> ? TSubUnion : never,
    FindExactSubTypeInfo<TSubTypes, TBase> extends SubTypeInfo<any, any, infer TDiscriminator> ? TDiscriminator : never,
    TFinal,
    TBuildSuffix
  >;

export const subTypeBuilderInternal = <TSubTypes extends readonly SubTypeInfo<any, any, any>[], TBase extends Record<string, any>, TFinal>(
  finalizer: (built: TBase) => TFinal = (built) => built as unknown as TFinal
): SubTypeBuilder<TSubTypes, TBase, TFinal> => {
  return instanceBuilderInternal(finalizer) as SubTypeBuilder<TSubTypes, TBase, TFinal>;
};
