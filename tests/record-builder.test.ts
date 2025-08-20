import { describe, test, expect } from 'vitest';

import { fluentBuilder, subTypeRegistryBuilder } from '../src';
import { Animal, Dog, Employee, Human } from './test-types';

const subTypeRegistry = subTypeRegistryBuilder()
  .add<Animal, Dog | Human>()
  .build();
type MySubTypeRegistry = typeof subTypeRegistry;

describe('record-builder', () => {
  describe('building', () => {
    test('builds a record type with literal entries', () => {
      const people = fluentBuilder<Record<string, Employee>>()
        .setInstance('Employee1').name('Jim').age(42).alive(true).buildEmployee1()
        .setInstance('Employee2').name('Alice').age(39).alive(true).buildEmployee2()
        .setInstance('Employee3').name('Edna').age(102).alive(false).buildEmployee3()
        .buildRecord();
      expect(people.Employee1.age).toBe(42);
      expect(people.Employee1.alive).toBe(true);
      expect(people.Employee2.age).toBe(39);
      expect(people.Employee2.alive).toBe(true);
      expect(people.Employee3.age).toBe(102);
      expect(people.Employee3.alive).toBe(false);
    });
    test('builds sub types', () => {
      const animals = fluentBuilder<Record<string, Animal>, MySubTypeRegistry>()
        .setSubType('Sparky').kind('dog').food('sausage').buildSparky()
        .setSubType('Jim').kind('human').age(55).grandchildren(undefined).pets(undefined).buildJim()
        .buildRecord();
      expect(animals.Jim.kind).toBe('human');
      expect(animals.Sparky.kind).toBe('dog');
    });
    test('builds record of array', () => {
      const tom = fluentBuilder<Record<string, Human[]>>()
        .setArray('one')
        .pushInstance()
        .grandchildrenRecord()
        .setArray('Phil')
        .pushInstance().kind('fgjsdfd').name('nfkdsbfkd').buildElement()
        .buildPhil()
        .buildGrandchildren()
        .age(45)
        .kind('human')
        .buildElement()
        .buildOne()
        .buildRecord();
    });
  });
});
