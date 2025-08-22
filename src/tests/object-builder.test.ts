import { describe, expect, test } from 'vitest';

import { fluentBuilder } from '../api';
import { Example, Human, Library, Numbers, Places, Single, Strings, SubA, SubB, SubBB, UnionMemberNormal, UnionMemberWithNonEmptyArray } from './test-types';

describe('object-builder', () => {
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
      fluentBuilder<SubA | SubB | SubBB>().b('fds').bx('32').exampleObject().a(8).b('sada').buildExample();
    });
    test('builds an object from a union type', () => {
      const exampleA = fluentBuilder<SubA | SubB | SubBB>().kind('a').a(1).exampleObject().a(0).b('').c(543).buildExample().buildObject();
      expect(exampleA.kind).toBe('a');
      expect((exampleA as SubA).a).toBe(1);
      // @ts-expect-error
      const cannotCastA = exampleA as SubB;
      expect(cannotCastA.b).toBeUndefined();

      const exampleB = fluentBuilder<SubA | SubB | SubBB>().kind('b').b('fdsfd').bx('fdiguir').exampleObject().a(1).b('f').c(9432594).buildExample().buildObject();
      expect(exampleB.kind).toBe('b');
      expect(exampleB.b).toBe('fdsfd');
      // @ts-expect-error
      const cannotCastB = exampleB as SubA;
      expect(cannotCastB.a).toBeUndefined();
    });
    test('can build an instance field', () => {
      const example = fluentBuilder<Example>().a(8).b('sada').buildObject();
      expect(example.a).toBe(8);
      expect(example.b).toBe('sada');
    });
    test('builds a progressive object of sub-type', () => {
      fluentBuilder<SubA | SubB | SubBB>().b('hello').kind('b').bx('xyz').exampleObject().a(8).b('sada').buildExample().buildObject();
    });
    test('builds a progressive object', () => {
      const human = fluentBuilder<Human>()
        .kind('human')
        .grandchildrenRecord()
        // TODO get object records working
        // .setArray('Phil')
        // .pushObject().name('Timmy').buildElement()
        // .buildPhil()
        .buildGrandchildren()
        .age(45)
        .buildObject();
      expect(human).not.toBe(undefined);
    });
    test('builds a sub-type from a union with different field types with the same name', () => {
      fluentBuilder<Library | Places>().cinemas({ a: 'fds' }).buildObject();
    });
    test('builds a union of objects containing records', () => {
      fluentBuilder<Library | Places>().cinemasRecord().buildCinemas().buildObject();
    });
    test('builds a union of objects containing arrays which filter the available type', () => {
      fluentBuilder<Strings | Numbers | Single>().valuesArray().push(543).push(
        // @ts-expect-error
        ''
      );
    });
    test('builds a sub-type type with a non empty array', () => {
      const values = fluentBuilder<UnionMemberNormal | UnionMemberWithNonEmptyArray>()
        .numbersNonEmptyArray().index0(4324).push(432).buildNumbersNonEmpty()
        .numbersNormalArray().push(123).buildNumbersNormal()
        .numbersTupleArray().index0(7483).index1(7584).index2(654).buildNumbersTuple()
        .buildObject();
      expect(values.numbersNonEmpty.length).toBe(2);
      expect(values.numbersNormal.length).toBe(1);
      expect(values.numbersTuple.length).toBe(3);
    });
  });
});
