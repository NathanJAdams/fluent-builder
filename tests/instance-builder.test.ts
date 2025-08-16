import { describe, test, expect } from 'vitest';

import { instanceBuilder } from '../src';

type Example = {
  a: number;
  b: string;
  c?: number;
  d: number | undefined;
  e?: number | undefined;
};
type Nested1 = {
  nested2: Nested2;
};
type Nested2 = {
  nested3: Nested3;
};
type Nested3 = {
  nested4: Nested4;
};
type Nested4 = {
  nested5: Nested5;
};
type Nested5 = {
  xyz: string;
};

describe('instance-builder', () => {
  describe('building', () => {
    test('builds an object', () => {
      const example = instanceBuilder<Example>().a(1).b('b').c(3).d(4).e(5).build();
      expect(example.a).toBe(1);
      expect(example.b).toBe('b');
      expect(example.c).toBe(3);
      expect(example.d).toBe(4);
      expect(example.e).toBe(5);
    });
    test('can build without optional fields', () => {
      const example = instanceBuilder<Example>().a(1).b('b').build();
      expect(example.a).toBe(1);
      expect(example.b).toBe('b');
      expect(example.c).toBe(undefined);
      expect(example.d).toBe(undefined);
      expect(example.e).toBe(undefined);
    });
  });
  describe('nesting', () => {
    test('arbitrarily nested types can be built in one go', () => {
      const nested1 = instanceBuilder<Nested1>()
        .nested2Builder()
        .nested3Builder()
        .nested4Builder()
        .nested5Builder()
        .xyz('hello')
        .build()
        .build()
        .build()
        .build()
        .build();
      expect(nested1.nested2.nested3.nested4.nested5.xyz).toBe('hello');
    });
  });
  describe('compile errors', () => {
    test('functions not backed by the type do not compile', () => {
      instanceBuilder<Example>().
        // @ts-expect-error
        abcdef
        ();
    });
    test('build function is not available until all non-optional fields have been set', () => {
      instanceBuilder<Example>().
        // @ts-expect-error
        build
        ();
    });
    test('cannot use the same function twice even if other functions have been called in between', () => {
      instanceBuilder<Example>()
        .a(1)
        .b('b')
        .c(3)
        .d(4)
        .e(5).
        // @ts-expect-error
        a
        (2);
    });
  });
});
