import { describe, test, expect } from 'vitest';

import { subTypeRegistryBuilder } from '../src';
import { Root, Root2, SubA, SubA2, SubB, SubB2 } from './test-types';

describe('sub-type-registry-builder', () => {
  describe('building', () => {
    test('can build an array of sub-type-metadata', () => {
      const subTypeRegistry = subTypeRegistryBuilder()
        .add<Root, SubA | SubB>()
        .add<Root2, SubA2 | SubB2>()
        .build();
      expect(subTypeRegistry.length).toBe(2);
    });
  });
});
