import { describe, test, expect } from 'vitest';

import { subTypeBuilder, subTypeInfoBuilder } from '../src';

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

const subTypes = subTypeInfoBuilder()
  .add<Root, SubA | SubB, 'kind'>()
  .build();
const subTypes2 = subTypeInfoBuilder()
  .add<Root, SubA | SubB, 'kind'>()
  .add<Root2, SubA2 | SubB2, 'kind2'>()
  .build();
type MySubTypes = typeof subTypes;
type MySubTypes2 = typeof subTypes2;

describe('sub-type-builder', () => {
  describe('building', () => {
    test('builds an object of sub-type', () => {
      const exampleA = subTypeBuilder<Root, MySubTypes>().kind('a').a(1).build();
      expect(exampleA.kind).toBe('a');
      expect((exampleA as SubA).a).toBe(1);
      expect((exampleA as SubB).b).toBe(undefined);

      const exampleB = subTypeBuilder<Root, MySubTypes>().kind('b').b(true).build();
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
        <SubA, MySubTypes>();
    });
    test('base type is not available if not in sub types', () => {
      // @ts-expect-error
      subTypeBuilder
        <Root2, MySubTypes>();
    });
    test('first function is always the discriminator', () => {
      subTypeBuilder<Root, MySubTypes>().
        // @ts-expect-error
        a
        (1);
    });
    test('cannot choose a discriminator if not one of the sub types', () => {
      subTypeBuilder<Root, MySubTypes>().kind(
        // @ts-expect-error
        'xyz'
      );
    });
  });
});
