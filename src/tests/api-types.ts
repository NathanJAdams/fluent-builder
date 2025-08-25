import { FluentBuilder } from '../api';
import { ArrayBuilderTopLevel } from '../array-builder';
import { ErrorNotValid } from '../errors';
import { ObjectBuilderTopLevel } from '../object-builder';
import { RecordBuilderTopLevel } from '../record-builder';
import { IsExact } from '../utility-types';

const _FluentBuilder_never: IsExact<FluentBuilder<never>, ErrorNotValid> = true;
const _FluentBuilder_any: IsExact<FluentBuilder<any>, ErrorNotValid> = true;
const _FluentBuilder_unknown: IsExact<FluentBuilder<unknown>, ErrorNotValid> = true;
const _FluentBuilder_undefined: IsExact<FluentBuilder<undefined>, ErrorNotValid> = true;
const _FluentBuilder_null: IsExact<FluentBuilder<null>, ErrorNotValid> = true;
const _FluentBuilder_string: IsExact<FluentBuilder<string>, ErrorNotValid> = true;
const _FluentBuilder_number: IsExact<FluentBuilder<number>, ErrorNotValid> = true;
const _FluentBuilder_boolean: IsExact<FluentBuilder<boolean>, ErrorNotValid> = true;
const _FluentBuilder_plainObject: IsExact<FluentBuilder<object>, ErrorNotValid> = true;
const _FluentBuilder_emptyObject: IsExact<FluentBuilder<{}>, ErrorNotValid> = true;
const _FluentBuilder_emptyTuple: IsExact<FluentBuilder<[]>, ErrorNotValid> = true;

const _FluentBuilder_array: IsExact<FluentBuilder<string[]>, ArrayBuilderTopLevel<string[]>> = true;
const _FluentBuilder_object: IsExact<FluentBuilder<{ a: string }>, ObjectBuilderTopLevel<{ a: string }>> = true;
const _FluentBuilder_record: IsExact<FluentBuilder<Record<string, string>>, RecordBuilderTopLevel<Record<string, string>>> = true;

const _FluentBuilder_unionArrays: IsExact<FluentBuilder<string[] | number[]>, ArrayBuilderTopLevel<string[]> & ArrayBuilderTopLevel<number[]>> = true;
const _FluentBuilder_unionObjects: IsExact<FluentBuilder<{ a: string } | { b: string }>, ObjectBuilderTopLevel<{ a: string }> & ObjectBuilderTopLevel<{ b: string }>> = true;
const _FluentBuilder_unionRecords: IsExact<FluentBuilder<Record<string, string> | Record<string, number>>, RecordBuilderTopLevel<Record<string, string>> & RecordBuilderTopLevel<Record<string, number>>> = true;

const _FluentBuilder_unionArrayObject: IsExact<FluentBuilder<string[] | { a: string }>, ArrayBuilderTopLevel<string[]> & ObjectBuilderTopLevel<{ a: string }>> = true;
const _FluentBuilder_unionArrayRecord: IsExact<FluentBuilder<{ a: string } | { b: string }>, ObjectBuilderTopLevel<{ a: string }> & ObjectBuilderTopLevel<{ b: string }>> = true;
const _FluentBuilder_unionObjectRecord: IsExact<FluentBuilder<{ a: string } | Record<string, number>>, ObjectBuilderTopLevel<{ a: string }> & RecordBuilderTopLevel<Record<string, number>>> = true;

const _FluentBuilder_unionArrayObjectRecord: IsExact<FluentBuilder<string[] | { a: string } | Record<string, number>>, ArrayBuilderTopLevel<string[]> & ObjectBuilderTopLevel<{ a: string }> & RecordBuilderTopLevel<Record<string, number>>> = true;

const _FluentBuilder_unionMixed: IsExact<FluentBuilder<string | string[]>, ErrorNotValid & ArrayBuilderTopLevel<string[]>> = true;
