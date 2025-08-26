import { ObjectBuilderTopLevel } from '../object-builder';

declare const testValue: ObjectBuilderTopLevel<{ a: string; }>;
declare const testArray: ObjectBuilderTopLevel<{ a: string[]; }>;
declare const testObject: ObjectBuilderTopLevel<{ a: { b: number; }; }>;
declare const testRecord: ObjectBuilderTopLevel<{ a: Record<string, number>; }>;
declare const testOptional: ObjectBuilderTopLevel<{ a?: boolean }>;
declare const testUnion: ObjectBuilderTopLevel<{ a: string; } | { b: number } | { c?: boolean }>;
declare const testUnionNestedArrays: ObjectBuilderTopLevel<{ a: string[]; } | { a: number[] }>;
declare const testUnionNestedObjects: ObjectBuilderTopLevel<{ a: { b: string; bb: string; } } | { a: { c: number; cc: number; } }>;
declare const testUnionNestedRecords: ObjectBuilderTopLevel<{ a: Record<string, number>; } | { a: Record<string, string>; }>;

testValue.a('gfd').buildObject();

testArray.a(['fds']).buildObject();
testArray.aArray().push('gfd').buildA();

testObject.a({ b: 67 }).buildObject();
testObject.aObject().b(6543).buildA().buildObject();

testRecord.a({ xyz: 67 }).buildObject();
testRecord.aRecord().set('fdskfd', 654).buildA().buildObject();

testOptional.a(true).buildObject();

testUnion.a('gfd').buildObject();
testUnion.b(645).buildObject();

testUnionNestedArrays.a(['hfnvc']).buildObject();
testUnionNestedArrays.a([7483]).buildObject();
testUnionNestedArrays.aArray().error;

testUnionNestedObjects.aObject().b('gfd').bb('gfd').buildA().buildObject();
testUnionNestedObjects.aObject().c(543).cc(654).buildA().buildObject();

testUnionNestedRecords.a({ gfd: 'gfd', bvcbvc: 'ds' }).buildObject().a.gfd;
testUnionNestedRecords.a({ otrebjkc: 43728, kfgfg: 965 }).buildObject().a.kfgfg;
testUnionNestedRecords.aRecord().error;
