import { ArrayBuilderTopLevel } from './array-builder';
import { ErrorNotBuildable, ErrorNotValid } from './errors';
import { ObjectBuilderTopLevel } from './object-builder';
import { createBuilderFromProxy } from './proxy';
import { RecordBuilderTopLevel } from './record-builder';
import { IsArray, IsObject, IsRecord, IsUnion, IsValid } from './utility-types';

export const fluentBuilder = <T>(): FluentBuilder<T> => {
  return createBuilderFromProxy();
};

export type FluentBuilder<T> =
  [T] extends [never]
    ? ErrorNotValid
    : IsValid<T> extends false
      ? ErrorNotValid
      : IsObject<T> extends true
        ? ObjectBuilderTopLevel<T>
        : IsUnion<T> extends true
          ? ErrorNotBuildable
          : IsArray<T> extends true
            ? ArrayBuilderTopLevel<T>
            : IsRecord<T> extends true
              ? RecordBuilderTopLevel<T>
              : ErrorNotBuildable
  ;
