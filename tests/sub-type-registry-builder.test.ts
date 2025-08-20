import { describe, test, expect } from 'vitest';

import { unionRegistryBuilder } from '../src';
import { Root, Root2, SubA, SubA2, SubB, SubB2 } from './test-types';

describe('union-registry-builder', () => {
  describe('building', () => {
    test('can build an array of union-metadata', () => {
      const unionRegistry = unionRegistryBuilder()
        .register<Root, SubA | SubB>()
        .register<Root2, SubA2 | SubB2>()
        .build();
      expect(unionRegistry.length).toBe(2);
    });
  });
});
