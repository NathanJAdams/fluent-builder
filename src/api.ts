import { ArrayBuilder } from './array-builder';
import { suffixes } from './constants';
import { ErrorNotBuildable, ErrorValidButNotBuildable } from './errors';
import { ObjectBuilder } from './object-builder';
import { createBuilder } from './proxy';
import { RecordBuilder } from './record-builder';
import { IsRecord, IsUserType, IsValid, RecordValueType } from './utility-types';

export const fluentBuilder = <T>(): FluentBuilder<T> => {
  return createBuilder();
};

type FluentBuilder<T> =
  IsValid<T> extends false
  ? ErrorNotBuildable
  : IsRecord<T> extends true
  ? RecordBuilder<RecordValueType<T>, T, typeof suffixes.record>
  : [T] extends [readonly any[]]
  ? ArrayBuilder<T, T, typeof suffixes.array>
  : IsUserType<T> extends true
  ? ObjectBuilder<T, T, typeof suffixes.object>
  : ErrorValidButNotBuildable
  ;
