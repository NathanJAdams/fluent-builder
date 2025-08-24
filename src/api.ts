import { ArrayBuilder } from './array-builder';
import { suffixes } from './constants';
import { ErrorNotBuildable, ErrorNotConsistent, ErrorNotValid } from './errors';
import { ObjectBuilder } from './object-builder';
import { createBuilder } from './proxy';
import { RecordBuilder } from './record-builder';
import { BuildType, FindBuildTypeApi } from './utility-types';

export const fluentBuilder = <T>(): FluentBuilder<T> => {
  return createBuilder();
};

type FluentBuilder<T> =
  FindBuildTypeApi<T> extends infer TBuildType
  ? TBuildType extends BuildType.NotValid
  ? ErrorNotValid
  : TBuildType extends BuildType.NotConsistent
  ? ErrorNotConsistent
  : TBuildType extends BuildType.Array
  ? ArrayBuilder<T, T, typeof suffixes.array>
  : TBuildType extends BuildType.Record
  ? RecordBuilder<T, T, typeof suffixes.record>
  : TBuildType extends BuildType.Object
  ? ObjectBuilder<T, T, typeof suffixes.object>
  : TBuildType extends BuildType.NotBuildable
  ? ErrorNotBuildable
  : never
  : never
  ;
