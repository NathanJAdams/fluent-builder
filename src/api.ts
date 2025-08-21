import { ArrayBuilder } from './array-builder';
import { suffixes } from './constants';
import { ErrorNotBuildable, ErrorValidButNotBuildable } from './errors';
import { ObjectBuilder } from './object-builder';
import { createBuilder } from './proxy';
import { RecordBuilder } from './record-builder';
import { HasOnlyIndexSignature, IsUserType, IsValid, RecordValueType } from './utility-types';

export const fluentBuilder = <T>(): ReturnType<T> => {
  return createBuilder();
};

type ReturnType<T> =
  [T] extends [any] // prevent distribution
    ? IsValid<T> extends false
      ? ErrorNotBuildable
      : HasOnlyIndexSignature<T> extends true
        ? RecordBuilder<RecordValueType<T>, T, typeof suffixes.record>
        : [T] extends [infer U]
          ? U extends any[]
            ? ArrayBuilder<U, U, typeof suffixes.array>
            : IsUserType<T> extends true
              ? ObjectBuilder<T, T, typeof suffixes.object>
              : ErrorValidButNotBuildable
          : never
    : never
;
