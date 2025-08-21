import { describe, test, expect } from 'vitest';

import { fluentBuilder, unionRegistryBuilder } from '../src';
import { Union, UnionMemberNormal, UnionMemberWithNonEmptyArray } from './test-types';

describe('tuple-builder', () => {
  describe('building', () => {
    test('builds a tuple type with literal entries', () => {
      const values = fluentBuilder<[boolean, string, number]>()
        .index0(true)
        .index1('hello')
        .index2(3543)
        .buildTuple();
      expect(values[0]).toBe(true);
      expect(values[1]).toBe('hello');
      expect(values[2]).toBe(3543);
    });
  });
});

