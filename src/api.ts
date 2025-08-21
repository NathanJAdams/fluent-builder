import { ArrayBuilder } from './array-builder';
import { suffixes } from './constants';
import { ErrorIsArrayNotExtendArray, ErrorIsTupleNotExtendReadonlyArray, ErrorNotBuildable, ErrorValidButNotBuildable } from './errors';
import { ObjectBuilder } from './object-builder';
import { createBuilder } from './proxy';
import { RecordBuilder } from './record-builder';
import { TupleBuilder } from './tuple-builder';
import { HasOnlyIndexSignature, IsArray, IsTuple, IsUserType, IsValid, RecordValueType } from './utility-types';

export const fluentBuilder = <T>(): ReturnType<T> => {
  return createBuilder();
};

type ReturnType<T> =
  IsValid<T> extends false
    ? ErrorNotBuildable
    : HasOnlyIndexSignature<T> extends true
      ? RecordBuilder<RecordValueType<T>, T, typeof suffixes.record>
      : IsTuple<T> extends true
        ? T extends readonly any[]
          ? TupleBuilder<T, T, typeof suffixes.tuple>
          : ErrorIsTupleNotExtendReadonlyArray
        : IsArray<T> extends true
          ? T extends Array<infer TElement>
            ? ArrayBuilder<TElement, T, typeof suffixes.array>
            : ErrorIsArrayNotExtendArray
          : IsUserType<T> extends true
            ? ObjectBuilder<T, T, typeof suffixes.object>
            : ErrorValidButNotBuildable
;


// const _unionRegistry = unionRegistryBuilder()
//   // .register<Root, SubA | SubB | SubBB>()
//   .build();
// type MyUnionRegistry = typeof _unionRegistry;
// fluentBuilder<Root, MyUnionRegistry>()
//   .error('Internal Error: Type is valid but cannot currently be built. Please raise an issue at https://github.com/NathanJAdams/ts-fluent-builder/issues and include the type causing this error. Thank you.');

// export type Root = {
//   kind: string;
// };
// export type SubA = {
//   kind: 'a';
//   a: number;
// };
// export type SubB = {
//   kind: 'b';
//   b: string;
//   bx?: string;
// };
// export type SubBB = {
//   kind: 'b';
//   b: boolean;
//   by?: boolean;
// };
