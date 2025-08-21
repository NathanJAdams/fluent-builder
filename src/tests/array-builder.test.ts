import { describe, expect, test } from 'vitest';

import { fluentBuilder } from '../api';
import type { Dog, Employee } from './test-types';

describe('array-builder', () => {
  describe('building', () => {
    test('values', () => {
      const values = fluentBuilder<string[]>()
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
      const values = fluentBuilder<Employee[][]>()
        .pushArray()
        .pushObject().name('Tim').age(31).alive(true).buildElement()
        .pushObject().name('Ann').age(48).alive(true).buildElement()
        .buildElement()
        .pushArray()
        .pushObject().name('Timmy').age(1).alive(true).buildElement()
        .pushObject().name('Annie').age(8).alive(true).buildElement()
        .buildElement()
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
      const values = fluentBuilder<Record<string, Dog>[]>()
        .pushRecord()
        .setObject('Tim').food('chicken').kind('dog').buildTim()
        .buildElement()
        .pushRecord()
        .setObject('Jenny').food('pork').kind('dog').buildJenny()
        .buildElement()
        .buildArray();
      expect(Array.isArray(values)).toBe(true);
      expect(values.length).toBe(2);
      expect(values[0]['Tim'].food).toBe('chicken');
      expect(values[1]['Jenny'].food).toBe('pork');
    });
    test('instance', () => {
      const values = fluentBuilder<Employee[]>()
        .pushObject().name('Tim').age(31).alive(true).buildElement()
        .pushObject().name('Ann').age(48).alive(true).buildElement()
        .build();
      expect(Array.isArray(values)).toBe(true);
      expect(values.length).toBe(2);
      expect(values[0].name).toBe('Tim');
      expect(values[1].name).toBe('Ann');
    });
    test('builds a tuple type with literal entries', () => {
      const values = fluentBuilder<[boolean, string, number]>()
        .index0(true)
        .index1('hello')
        .index2(3543)
        .buildArray();
      expect(values[0]).toBe(true);
      expect(values[1]).toBe('hello');
      expect(values[2]).toBe(3543);
    });
  });
});
