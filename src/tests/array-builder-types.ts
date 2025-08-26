import { ArrayBuilderNested } from '../array-builder';

declare const testValue: ArrayBuilderNested<string[], 'built', ''>;
declare const testArrayAsTuple: ArrayBuilderNested<[...string[]], 'built', ''>;
declare const testTuple: ArrayBuilderNested<[string, number], 'built', ''>;
declare const testLongTuple: ArrayBuilderNested<[string, boolean, string], 'built', ''>;
declare const testArray: ArrayBuilderNested<string[][], 'built', ''>;
declare const testTupleNestedArray: ArrayBuilderNested<[string[], number], 'built', ''>;
declare const testObject: ArrayBuilderNested<[{ a: string }, number], 'built', ''>;
declare const testRecord: ArrayBuilderNested<[Record<string, string>, number], 'built', ''>;
declare const testTupleWithRest: ArrayBuilderNested<[string, number, ...boolean[]], 'built', ''>;

testValue.push('fds').push('hgfhgf').build();
testArrayAsTuple.push('fds').push('nskvnk').build();
testTuple.index0('fds').index1(543).build();
testLongTuple.index0('fds').index1(true).index2('fdssdfd').build();
testArray.pushArray().push('gfd').push('nhgh').buildElement().build();
testTupleNestedArray.index0Array().push('ds').push('gfd').buildIndex0().index1(543).build();
testObject.index0Object().a('fds').buildIndex0().index1(432).build();
testRecord.index0Record().buildIndex0().index1(432).build();
testTupleWithRest.index0('hgfgf').index1(543).push(true).push(false).build();
