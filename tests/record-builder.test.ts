import { describe, test, expect } from 'vitest';

import { recordBuilder } from '../src';

type Person = {
  age: number;
  alive: boolean;
};

describe('record-builder', () => {
  describe('building', () => {
    test('builds a record type with literal entries', () => {
      const people = recordBuilder<Person>()
        .addBuilder('Jim').age(42).alive(true).build()
        .addBuilder('Alice').age(39).alive(true).build()
        .addBuilder('Edna').age(102).alive(false).build()
        .build();
      expect(people.Jim.age).toBe(42);
      expect(people.Jim.alive).toBe(true);
      expect(people.Alice.age).toBe(39);
      expect(people.Alice.alive).toBe(true);
      expect(people.Edna.age).toBe(102);
      expect(people.Edna.alive).toBe(false);
    });
  });
  describe('compile errors', () => {
    test('functions not backed by the type do not compile and would throw if ran', () => {
      expect(() => recordBuilder<Person>().
        // @ts-expect-error
        abcdef
        ()).toThrow();
    });
    test('cannot add the same record twice even after other records have been added in between', () => {
      recordBuilder<Person>()
        .addBuilder('Olive')
        .age(70)
        .alive(false)
        .build()
        .addBuilder('Frederick')
        .age(21)
        .alive(true)
        .build()
        .addBuilder('Ann')
        .age(70)
        .alive(false)
        .build()
        // @ts-expect-error
        .addBuilder('Frederick');
    });
    test('build function is not available until all non-optional fields have been set', () => {
      recordBuilder<Person>()
        .addBuilder('Fred')
        // @ts-expect-error
        .build();
    });
    test('cannot use the same function twice even if other functions have been called in between', () => {
      recordBuilder<Person>()
        .addBuilder('John')
        .age(1)
        .alive(true)
        // @ts-expect-error
        .age(1);
    });
  });
});
