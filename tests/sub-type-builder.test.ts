import { describe, test, expect } from 'vitest';

import { subTypeBuilder, subTypeRegistryBuilder } from '../src';
import { Root, Root2, SubA, SubB, SubBB } from './test-types';

const subTypeRegistry = subTypeRegistryBuilder()
  .add<Root, SubA | SubB | SubBB>()
  .build();
type MySubTypeRegistry = typeof subTypeRegistry;

describe('sub-type-builder', () => {
  describe('building', () => {
    test('builds an object of sub-type', () => {
      const exampleA = subTypeBuilder<Root, MySubTypeRegistry>().kind('a').a(1).exampleInstance().a(0).b('').c(543).buildExample().buildSubType();
      expect(exampleA.kind).toBe('a');
      expect((exampleA as SubA).a).toBe(1);
      expect((exampleA as SubB).b).toBe(undefined);

      const exampleB = subTypeBuilder<Root, MySubTypeRegistry>().kind('b').b(true).by(true).exampleInstance().a(1).b('f').c(9432594).buildExample().buildSubType();
      expect(exampleB.kind).toBe('b');
      expect((exampleB as SubB).b).toBe(true);
      expect((exampleB as SubA).a).toBe(undefined);
    });
    test('builds a progressive object of sub-type', () => {
      const builder = subTypeBuilder<Root, MySubTypeRegistry>();
      const abc = builder.b('hello').kind('b').bx('xyz').build();
    });
  });
  describe('compile errors', () => {
    test('builder requires base type and sub types generic parameters', () => {
      subTypeBuilder<
        // @ts-expect-error
        Root
      >();
    });
    test('type must be a base type', () => {
      // @ts-expect-error
      subTypeBuilder
        <SubA, MySubTypeRegistry>();
    });
    test('base type is not available if not in sub types', () => {
      // @ts-expect-error
      subTypeBuilder
        <Root2, MySubTypeRegistry>();
    });
  });
});
