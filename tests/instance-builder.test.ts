import { describe, test, expect } from 'vitest';

import { instanceBuilder } from '../src';
import { Example } from './test-types';

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
