import { describe, expect, test } from 'vitest';
import { fluentBuilder } from '../src';
import { Employee, Example, Human } from './test-types';
import { errorMessages } from '../src/constants';

describe('compile errors', () => {
  describe('unsupported built types', () => {
    test('never is not supported', () => {
      fluentBuilder<never>().error(errorMessages.notBuildable);
    });
    test('unknown is not supported', () => {
      fluentBuilder<unknown>().error(errorMessages.notBuildable);
    });
    test('any is not supported', () => {
      fluentBuilder<any>().error(errorMessages.notBuildable);
    });
    test('null is not supported', () => {
      fluentBuilder<null>().error(errorMessages.notBuildable);
    });
    test('undefined is not supported', () => {
      fluentBuilder<undefined>().error(errorMessages.notBuildable);
    });
    test('string is not supported', () => {
      fluentBuilder<string>().error(errorMessages.notBuildable);
    });
    test('number is not supported', () => {
      fluentBuilder<number>().error(errorMessages.notBuildable);
    });
    test('bigint is not supported', () => {
      fluentBuilder<bigint>().error(errorMessages.notBuildable);
    });
    test('symbol is not supported', () => {
      fluentBuilder<symbol>().error(errorMessages.notBuildable);
    });
    test('function is not supported', () => {
      fluentBuilder<Function>().error(errorMessages.notBuildable);
    });
    test('object is not supported', () => {
      fluentBuilder<object>().error(errorMessages.notBuildable);
    });
    test('empty type is not supported', () => {
      fluentBuilder<{}>().error(errorMessages.notBuildable);
    });
    test('empty type is not supported', () => {
      fluentBuilder<[]>().error(errorMessages.notBuildable);
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
        build
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
