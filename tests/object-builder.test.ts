import { describe, test, expect } from 'vitest';

import { fluentBuilder } from '../src';
import { Example, SubA, SubB, SubBB, Union, UnionMemberWithNonEmptyArray } from './test-types';

describe('union-builder', () => {
  describe('building', () => {
    test('builds an object', () => {
      const example = fluentBuilder<Example>().a(1).b('b').c(3).d(4).e(5).buildObject();
      expect(example.a).toBe(1);
      expect(example.b).toBe('b');
      expect(example.c).toBe(3);
      expect(example.d).toBe(4);
      expect(example.e).toBe(5);
    });
    test('can build without optional fields', () => {
      const example = fluentBuilder<Example>().a(1).b('b').buildObject();
      expect(example.a).toBe(1);
      expect(example.b).toBe('b');
      expect(example.c).toBe(undefined);
      expect(example.d).toBe(undefined);
      expect(example.e).toBe(undefined);
    });
    test('can build nested instances', () => {
      fluentBuilder<SubA | SubB | SubBB>().exampleObject().a(8).b('sada').buildExample();
    });
    test('builds an object from a union type', () => {
      const exampleA = fluentBuilder<SubA | SubB | SubBB>().kind('a').a(1)/*.exampleObject().a(0).b('').c(543).buildExample()*/.buildObject();
      expect(exampleA.kind).toBe('a');
      expect((exampleA as SubA).a).toBe(1);
      expect((exampleA as SubB).b).toBe(undefined);

      const exampleB = fluentBuilder<SubA | SubB | SubBB>().kind('b').b('fdsfd').bx('fdiguir').exampleObject().a(1).b('f').c(9432594).buildExample().buildObject();
      expect(exampleB.kind).toBe('b');
      expect((exampleB as SubB).b).toBe('fdsfd');
      expect((exampleB as SubA).a).toBe(undefined);
    });
    test('can build an instance field', () => {
      const example = fluentBuilder<Example>().a(8).b('sada').buildObject();
      expect(example.a).toBe(8);
      expect(example.b).toBe('sada');
    });
    test('builds a progressive object of sub-type', () => {
      fluentBuilder<SubA | SubB | SubBB>().b('hello').kind('b').bx('xyz').exampleObject().a(8).b('sada').buildExample();
    });
    test('builds a sub-type type with a non empty array', () => {
      const values = fluentBuilder<UnionMemberWithNonEmptyArray>()
        .numbersNonEmptyArray().buildNumbersNonEmpty()
        .numbersNormalArray().push(123).buildNumbersNormal()
        .numbersTupleTuple().index0(7483).index1(7584).index2(654).buildNumbersTuple()
        .buildObject();
      expect(values.numbersNonEmpty.length).toBe(0);
      expect(values.numbersNormal.length).toBe(1);
      expect(values.numbersTuple.length).toBe(3);
    });
  });
});
