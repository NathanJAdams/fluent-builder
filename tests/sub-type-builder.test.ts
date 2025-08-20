import { describe, test, expect } from 'vitest';

import { fluentBuilder, unionRegistryBuilder } from '../src';
import { Root, Root2, SubA, SubB, SubBB } from './test-types';

const unionRegistry = unionRegistryBuilder()
  .register<Root, SubA | SubB | SubBB>()
  .build();
type MyunionRegistry = typeof unionRegistry;

describe('union-builder', () => {
  describe('building', () => {
    test('builds an object of sub-type', () => {
      const exampleA = fluentBuilder<Root, MyunionRegistry>().kind('a').a(1).exampleInstance().a(0).b('').c(543).buildExample().buildSubType();
      expect(exampleA.kind).toBe('a');
      expect((exampleA as SubA).a).toBe(1);
      expect((exampleA as SubB).b).toBe(undefined);

      const exampleB = fluentBuilder<Root, MyunionRegistry>().kind('b').b(true).by(true).exampleInstance().a(1).b('f').c(9432594).buildExample().buildSubType();
      expect(exampleB.kind).toBe('b');
      expect((exampleB as SubB).b).toBe(true);
      expect((exampleB as SubA).a).toBe(undefined);
    });
    test('can build an instance field', () => {
      fluentBuilder<Root, MyunionRegistry>().exampleInstance().a(8).b('sada').buildExample();
    });
    test('builds a progressive object of sub-type', () => {
      fluentBuilder<Root, MyunionRegistry>().b('hello').kind('b').bx('xyz').exampleInstance().a(8).b('sada').buildExample();
    });
  });
});
