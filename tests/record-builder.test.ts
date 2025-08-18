import { describe, test, expect } from 'vitest';

import { recordBuilder, subTypeRegistryBuilder } from '../src';

type Animal = {
  kind: string;
};
type Dog = Animal & {
  kind: 'dog';
  food: string;
};
type Human = Animal & {
  kind: 'human';
  age: number;
  pets: Animal[];
};

type Employee = {
  age: number;
  alive: boolean;
};

const subTypeRegistry = subTypeRegistryBuilder()
  .add<Animal, Dog | Human, 'kind'>()
  .build();
type MySubTypeRegistry = typeof subTypeRegistry;

describe('record-builder', () => {
  describe('building', () => {
    test('builds a record type with literal entries', () => {
      const people = recordBuilder<Employee>()
        .addBuilder('Jim').age(42).alive(true).buildJim()
        .addBuilder('Alice').age(39).alive(true).buildAlice()
        .addBuilder('Edna').age(102).alive(false).buildEdna()
        .buildRecord();
      expect(people.Jim.age).toBe(42);
      expect(people.Jim.alive).toBe(true);
      expect(people.Alice.age).toBe(39);
      expect(people.Alice.alive).toBe(true);
      expect(people.Edna.age).toBe(102);
      expect(people.Edna.alive).toBe(false);
    });
    test('builds sub types', () => {
      const animals = recordBuilder<Animal, MySubTypeRegistry>()
        .addSubTypeBuilder('Sparky').kind('dog').food('sausage').buildSparky()
        .addSubTypeBuilder('Jim').kind('human').age(55).petsArrayBuilder().addSubTypeBuilder().kind('dog').food('dog-food').buildDog().buildPets().buildJim()
        .buildRecord();
      expect(animals.Jim.kind).toBe('human');
      expect(animals.Sparky.kind).toBe('dog');
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
      recordBuilder<Employee>()
        .addBuilder('Olive')
        .age(70)
        .alive(false)
        .buildOlive()
        .addBuilder('Frederick')
        .age(21)
        .alive(true)
        .buildFrederick()
        .addBuilder('Ann')
        .age(70)
        .alive(false)
        .buildAnn()
        // @ts-expect-error
        .addBuilder('Frederick');
    });
    test('build function is not available until all non-optional fields have been set', () => {
      recordBuilder<Employee>()
        .addBuilder('Fred')
        // @ts-expect-error
        .build();
    });
    test('cannot use the same function twice even if other functions have been called in between', () => {
      recordBuilder<Employee>()
        .addBuilder('John')
        .age(1)
        .alive(true)
        // @ts-expect-error
        .age(1);
    });
  });
});
