import { describe, expect, test } from 'vitest';

import { fluentBuilder } from '../api';
import { Dog, Employee, Human } from './test-types';

describe('record-builder', () => {
  describe('building', () => {
    test('builds a record type with literal entries', () => {
      const people = fluentBuilder<Record<string, Employee>>()
        .setObject('Employee1').name('Jim').age(42).alive(true).buildEmployee1()
        .setObject('Employee2').name('Alice').age(39).alive(true).buildEmployee2()
        .setObject('Employee3').name('Edna').age(102).alive(false).buildEmployee3()
        .buildRecord();
      expect(people.Employee1.age).toBe(42);
      expect(people.Employee1.alive).toBe(true);
      expect(people.Employee2.age).toBe(39);
      expect(people.Employee2.alive).toBe(true);
      expect(people.Employee3.age).toBe(102);
      expect(people.Employee3.alive).toBe(false);
    });
    test('builds a union of records', () => {
      type Small = { a: string; };
      type Large = { a: string; b?: number; };
      type Larger = { a: string; c: boolean; };
      type SINGULAR_RECORDS = Record<string, Small> | Record<string, Large> | Record<string, Larger>;
      fluentBuilder<SINGULAR_RECORDS>().set('fdsfd', { a: 'fds', b: undefined }).set('abc', { a: '654' }).set('gfdgfd', { a: '432', b: 432 });
      type ARRAY_RECORDS = Record<string, (Small | Large | Larger)[]>;
      fluentBuilder<ARRAY_RECORDS>().setArray('abc').pushObject().a('fds').c(true).buildElement().buildAbc().build();
    });
    test('builds sub types', () => {
      const animals = fluentBuilder<Record<string, Dog | Human>>()
        .setObject('Sparky').kind('dog').food('sausage').buildSparky()
        .setObject('Jim').kind('human').age(55).grandchildren(undefined).pets(undefined).buildJim()
        .buildRecord();
      expect(animals.Jim.kind).toBe('human');
      expect(animals.Sparky.kind).toBe('dog');
    });
    test('builds record of records', () => {
      const animals = fluentBuilder<Record<string, Record<string, Dog | Human>>>()
        .setRecord('a')
        .setObject('Sparky').kind('dog').food('sausage').buildSparky()
        .setObject('Jim').kind('human').age(55).grandchildren(undefined).pets(undefined).buildJim()
        .buildA()
        .buildRecord();
      expect(animals.a.Jim.kind).toBe('human');
      expect(animals.a.Sparky.kind).toBe('dog');
    });
    test('builds record of array', () => {
      const tom = fluentBuilder<Record<string, Human[]>>()
        .setArray('one')
        .pushObject()
        .grandchildrenRecord()
        .buildGrandchildren()
        .age(123)
        .kind('human')
        .buildElement()
        .buildOne()
        .setArray('Phil')
        .buildPhil()
        .buildRecord();
      expect(tom.one.length).toBe(1);
    });
  });
});
