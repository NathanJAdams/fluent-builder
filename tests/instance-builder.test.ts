import { describe, test, expect } from 'vitest';

import { fluentBuilder } from '../src';
import { Example, Root } from './test-types';

describe('instance-builder', () => {
  describe('building', () => {
    test('builds an object', () => {
      const example = fluentBuilder<Example>().a(1).b('b').c(3).d(4).e(5).buildInstance();
      expect(example.a).toBe(1);
      expect(example.b).toBe('b');
      expect(example.c).toBe(3);
      expect(example.d).toBe(4);
      expect(example.e).toBe(5);
    });
    test('can build without optional fields', () => {
      const example = fluentBuilder<Example>().a(1).b('b').buildInstance();
      expect(example.a).toBe(1);
      expect(example.b).toBe('b');
      expect(example.c).toBe(undefined);
      expect(example.d).toBe(undefined);
      expect(example.e).toBe(undefined);
    });
    test('can build nested instances', () => {
      fluentBuilder<Root>().exampleInstance().a(8).b('sada').buildExample();
    });
  });
});
