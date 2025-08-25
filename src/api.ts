import { ArrayBuilderTopLevel } from './array-builder';
import { ErrorNotBuildable, ErrorNotValid } from './errors';
import { ObjectBuilderTopLevel } from './object-builder';
import { createBuilderFromProxy } from './proxy';
import { RecordBuilderTopLevel } from './record-builder';
import { IsValid, UnionToIntersection } from './utility-types';

export const fluentBuilder = <T>(): FluentBuilder<T> => {
  return createBuilderFromProxy();
};

export type FluentBuilder<T> =
  UnionToIntersection<
    [T] extends [never]
      ? ErrorNotValid
      : T extends any
        ? IsValid<T> extends false
          ? ErrorNotValid
          : T extends readonly any[]
            ? ArrayBuilderTopLevel<T>
            : T extends Record<string, any>
              ? string extends keyof T
                ? RecordBuilderTopLevel<T>
                : ObjectBuilderTopLevel<T>
              : ErrorNotBuildable
        : never
  >;
