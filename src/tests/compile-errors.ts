import { describe, expect, test } from 'vitest';

import { fluentBuilder } from '../api';
import { errorMessages } from '../constants';
import { Employee, Example, Human } from './test-types';

describe('compile errors', () => {
  describe('unsupported built types', () => {
    test('never is not supported', () => {
      expect(fluentBuilder<never>().error).toBe(errorMessages.notValid);
    });
    test('unknown is not supported', () => {
      expect(fluentBuilder<unknown>().error).toBe(errorMessages.notValid);
    });
    test('any is not supported', () => {
      expect(fluentBuilder<any>().error).toBe(errorMessages.notValid);
    });
    test('null is not supported', () => {
      expect(fluentBuilder<null>().error).toBe(errorMessages.notValid);
    });
    test('undefined is not supported', () => {
      expect(fluentBuilder<undefined>().error).toBe(errorMessages.notValid);
    });
    test('string is not supported', () => {
      expect(fluentBuilder<string>().error).toBe(errorMessages.notValid);
    });
    test('number is not supported', () => {
      expect(fluentBuilder<number>().error).toBe(errorMessages.notValid);
    });
    test('bigint is not supported', () => {
      expect(fluentBuilder<bigint>().error).toBe(errorMessages.notValid);
    });
    test('symbol is not supported', () => {
      expect(fluentBuilder<symbol>().error).toBe(errorMessages.notValid);
    });
    test('function is not supported', () => {
      expect(fluentBuilder<Function>().error).toBe(errorMessages.notValid);
    });
    test('object is not supported', () => {
      expect(fluentBuilder<object>().error).toBe(errorMessages.notValid);
    });
    test('empty type is not supported', () => {
      expect(fluentBuilder<{}>().error).toBe(errorMessages.notValid);
    });
    test('empty type is not supported', () => {
      expect(fluentBuilder<[]>().error).toBe(errorMessages.notValid);
    });
  });
  describe('fluent-builder', () => {
    test('functions not backed by the type do not compile and would throw if ran', () => {
      fluentBuilder<Employee[]>().
        // @ts-expect-error
        abcdef
        ();
    });
    test('functions not backed by the type do not compile', () => {
      fluentBuilder<Example>().
        // @ts-expect-error
        abcdef
        ();
    });
    test('build function is not available until all non-optional fields have been set', () => {
      fluentBuilder<Example>().
        // @ts-expect-error
        build
        ();
    });
    test('cannot use the same function twice even if other functions have been called in between', () => {
      fluentBuilder<Example>()
        .a(1)
        .b('b')
        .c(3)
        .d(4)
        .e(5).
        // @ts-expect-error
        a
        (2);
    });
    test('functions not backed by the type do not compile and would throw if ran', () => {
      expect(() => fluentBuilder<Employee>().
        // @ts-expect-error
        abcdef
        ()).toThrow();
    });
    test('cannot add the same record twice even after other records have been added in between', () => {
      fluentBuilder<Record<string, Human>>()
        .setObject('Olive')
        .age(70)
        .kind('human')
        .buildOlive()
        .setObject('Frederick')
        .age(21)
        .kind('human')
        .buildFrederick()
        .setObject('Ann')
        .age(70)
        .kind('human')
        .buildAnn()
        .setObject(
          // @ts-expect-error
          'Frederick'
        );
    });
    test('build function is not available until all non-optional fields have been set', () => {
      fluentBuilder<Record<string, Employee>>()
        .setObject('Fred')
        .
        // @ts-expect-error
        buildFred
        ();
    });
    test('cannot use the same function twice even if other functions have been called in between', () => {
      fluentBuilder<Record<string, Employee>>()
        .setObject('John')
        .age(1)
        .alive(true)
        .
        // @ts-expect-error
        age
        (1);
    });
  });
});
