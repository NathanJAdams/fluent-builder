import { describe, test, expect } from 'vitest';

import { instanceBuilder, recordBuilder, subTypeRegistryBuilder } from '../src';
import { Animal, Dog, Employee, Human } from './test-types';

const subTypeRegistry = subTypeRegistryBuilder()
  .add<Animal, Dog | Human>()
  .build();
type MySubTypeRegistry = typeof subTypeRegistry;

describe('record-builder', () => {
  describe('building', () => {
    test('builds a record type with literal entries', () => {
      const people = recordBuilder<Employee>()
        .setSubType('Tony').buildTony()
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
      const animals = recordBuilder<Animal, MySubTypeRegistry>()
        .setSubType('Sparky').kind('dog').food('sausage').buildSparky()
        .setSubType('Jim').kind('human').age(55).grandchildren(undefined).pets(undefined).buildJim()
        .buildRecord();
      expect(animals.Jim.kind).toBe('human');
      expect(animals.Sparky.kind).toBe('dog');
    });
    test('builds record of array', () => {
      const tom = instanceBuilder<Human>()
        .grandchildrenRecord().setSubType('alex')
      //   .
    });
  });
  describe('compile errors', () => {
    test('functions not backed by the type do not compile and would throw if ran', () => {
      expect(() => recordBuilder<Employee>().
        // @ts-expect-error
        abcdef
        ()).toThrow();
    });
    test('cannot add the same record twice even after other records have been added in between', () => {
      recordBuilder<Human>()
        .setInstance('Olive')
        .age(70)
        .kind('human')
        .buildOlive()
        .setInstance('Frederick')
        .age(21)
        .kind('human')
        .buildFrederick()
        .setInstance('Ann')
        .age(70)
        .kind('human')
        .buildAnn()
        .setInstance(
          // @ts-expect-error
          'Frederick'
        );
    });
    test('build function is not available until all non-optional fields have been set', () => {
      recordBuilder<Employee>()
        .setInstance('Fred')
        .
        // @ts-expect-error
        build
        ();
    });
    test('cannot use the same function twice even if other functions have been called in between', () => {
      recordBuilder<Employee>()
        .setInstance('John')
        .age(1)
        .alive(true)
        .
        // @ts-expect-error
        age
        (1);
    });
  });
});
