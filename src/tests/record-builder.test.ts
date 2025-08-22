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
      fluentBuilder<Record<string, string> | Record<string, number>>().set('a', 'dksfhkds').set('b', 43543).buildRecord();
    });
    test('builds sub types', () => {
      const animals = fluentBuilder<Record<string, Dog | Human>>()
        .setObject('Sparky').kind('dog').food('sausage').buildSparky()
        .setObject('Jim').kind('human').age(55).grandchildren(undefined).pets(undefined).buildJim()
        .buildRecord();
      expect(animals.Jim.kind).toBe('human');
      expect(animals.Sparky.kind).toBe('dog');
    });
    test('builds record of array', () => {
      const tom = fluentBuilder<Record<string, Human[]>>()
        .setArray('one')
        .pushObject()
        .grandchildrenRecord()
        .setArray('Phil')
        .pushObject().name('Timmy').buildElement()
        .buildPhil()
        .buildGrandchildren()
        .age(45)
        .buildElement()
        .buildOne()
        .buildRecord();
      expect(tom.one.length).toBe(1);
    });
  });
});
