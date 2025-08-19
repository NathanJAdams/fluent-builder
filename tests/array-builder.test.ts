import { describe, test, expect } from 'vitest';

import { arrayBuilder } from '../src';
import type { Employee, Dog } from './test-types';

describe('array-builder', () => {
  describe('building', () => {
    test('values', () => {
      const values = arrayBuilder<string>()
        .push('a')
        .push('b')
        .push('c')
        .build();
      expect(Array.isArray(values)).toBe(true);
      expect(values.length).toBe(3);
      expect(values[0]).toBe('a');
      expect(values[1]).toBe('b');
      expect(values[2]).toBe('c');
    });
    test('arrays', () => {
      const values = arrayBuilder<Employee[]>()
        .pushArray()
        .pushInstance().name('Tim').age(31).alive(true).buildElement()
        .pushInstance().name('Ann').age(48).alive(true).buildElement()
        .buildArray()
        .pushArray()
        .pushInstance().name('Timmy').age(1).alive(true).buildElement()
        .pushInstance().name('Annie').age(8).alive(true).buildElement()
        .buildArray()
        .buildArray();
      expect(Array.isArray(values)).toBe(true);
      expect(values.length).toBe(2);
      expect(Array.isArray(values[0])).toBe(true);
      expect(Array.isArray(values[1])).toBe(true);
      expect(values[0][0].name).toBe('Tim');
      expect(values[0][0].age).toBe(31);
      expect(values[0][1].name).toBe('Ann');
      expect(values[0][1].age).toBe(48);
      expect(values[1][0].name).toBe('Timmy');
      expect(values[1][0].age).toBe(1);
      expect(values[1][1].name).toBe('Annie');
      expect(values[1][1].age).toBe(8);
    });
    test('record', () => {
      const values = arrayBuilder<Record<string, Dog>>()
        .pushRecord()
        .setInstance('Tim').food('chicken').kind('dog').buildTim()
        .buildRecord()
        .pushRecord()
        .setInstance('Jenny').food('pork').kind('dog').buildJenny()
        .buildRecord()
        .buildArray();
      expect(Array.isArray(values)).toBe(true);
      expect(values.length).toBe(2);
      expect(values[0]['Tim'].food).toBe('chicken');
      expect(values[1]['Jenny'].food).toBe('pork');
    });
    test('instance', () => {
      const values = arrayBuilder<Employee>()
        .pushInstance().name('Tim').age(31).alive(true).buildElement()
        .pushInstance().name('Ann').age(48).alive(true).buildElement()
        .build();
      expect(Array.isArray(values)).toBe(true);
      expect(values.length).toBe(2);
      expect(values[0].name).toBe('Tim');
      expect(values[1].name).toBe('Ann');
    });
  });
  describe('compile errors', () => {
    test('functions not backed by the type do not compile and would throw if ran', () => {
      arrayBuilder<Employee>().
        // @ts-expect-error
        abcdef
        ();
    });
  });
});
