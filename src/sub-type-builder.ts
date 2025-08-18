import { InstanceBuilder, instanceBuilderInternal } from './instance-builder';
import { FindExactSubTypeMetadata, SubTypeMetadata } from './utility-types';

export type SubTypeChooser<TSubTypeRegistry extends readonly SubTypeMetadata<any, any, any>[], TBase extends Record<string, any>, TSubUnion extends TBase, TDiscriminator extends keyof TBase & string, TFinal, TBuildSuffix extends string | undefined = undefined> = {
  [K in TDiscriminator]: <V extends TSubUnion[TDiscriminator]>(value: V) => InstanceBuilder<TSubTypeRegistry, Omit<Extract<TSubUnion, { [P in K]: V }>, TDiscriminator>, {}, TFinal, TBuildSuffix extends string ? TBuildSuffix : V>;
};

export type SubTypeBuilder<TSubTypeRegistry extends readonly SubTypeMetadata<any, any, any>[], TBase extends Record<string, any>, TFinal, TBuildSuffix extends string | undefined = undefined> =
  SubTypeChooser<
    TSubTypeRegistry,
    TBase,
    FindExactSubTypeMetadata<TSubTypeRegistry, TBase> extends SubTypeMetadata<any, infer TSubUnion, any> ? TSubUnion : never,
    FindExactSubTypeMetadata<TSubTypeRegistry, TBase> extends SubTypeMetadata<any, any, infer TDiscriminator> ? TDiscriminator : never,
    TFinal,
    TBuildSuffix
  >;

export const subTypeBuilderInternal = <TSubTypeRegistry extends readonly SubTypeMetadata<any, any, any>[], TBase extends Record<string, any>, TFinal>(
  finalizer: (built: TBase) => TFinal = (built) => built as unknown as TFinal
): SubTypeBuilder<TSubTypeRegistry, TBase, TFinal> => {
  return instanceBuilderInternal(finalizer) as SubTypeBuilder<TSubTypeRegistry, TBase, TFinal>;
};
