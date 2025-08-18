import { describe, test, expect } from 'vitest';

import { subTypeBuilder, subTypeRegistryBuilder } from '../src';

type Root = {
  kind: string;
};
type SubA = Root & {
  kind: 'a';
  a: number;
};
type SubB = Root & {
  kind: 'b';
  b: boolean;
};
type Root2 = {
  kind2: string;
};
type SubA2 = Root2 & {
  kind2: 'a';
  a: number;
};
type SubB2 = Root2 & {
  kind2: 'b';
  b: boolean;
};

const subTypeRegistry = subTypeRegistryBuilder()
  .add<Root, [SubA, SubB], 'kind'>()
  .build();
type MySubTypeRegistry = typeof subTypeRegistry;

describe('sub-type-builder', () => {
  describe('building', () => {
    test('builds an object of sub-type', () => {
      const exampleA = subTypeBuilder<Root, MySubTypeRegistry>().kind('a').a(1).buildA();
      expect(exampleA.kind).toBe('a');
      expect((exampleA as SubA).a).toBe(1);
      expect((exampleA as SubB).b).toBe(undefined);

      const exampleB = subTypeBuilder<Root, MySubTypeRegistry>().kind('b').b(true).buildB();
      expect(exampleB.kind).toBe('b');
      expect((exampleB as SubB).b).toBe(true);
      expect((exampleB as SubA).a).toBe(undefined);
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
    test('first function is always the discriminator', () => {
      subTypeBuilder<Root, MySubTypeRegistry>().
        // @ts-expect-error
        a
        (1);
    });
    test('cannot choose a discriminator if not one of the sub types', () => {
      subTypeBuilder<Root, MySubTypeRegistry>().kind(
        // @ts-expect-error
        'xyz'
      );
    });
  });
});
