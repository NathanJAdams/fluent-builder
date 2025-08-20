import { describe, expect, test } from 'vitest';
import { fluentBuilder, unionRegistryBuilder } from '../src';
import { AlteredRootStructure, AlteredSubA, AlteredSubB, DuplicateRootStructure, DuplicateSubA, DuplicateSubB, Employee, Example, Human, Root, Root2, Root3, SubA, SubA2, SubA3, SubB, SubB2, SubB3 } from './test-types';

describe('compile errors', () => {
  describe('bad union metadata', () => {
    test('cannot add the same sub type metadata type twice even after adding others in between', () => {
      unionRegistryBuilder()
        .register<Root, SubA | SubB>()
        .register<Root2, SubA2 | SubB2>()
        .register<Root, SubA | SubB>().
        // @ts-expect-error
        register
        <Root3, SubA3 | SubB3>()
        .build();
    });
    test('cannot add a base type if it has the exact same structure as one already added, no way to distinguish which type to use', () => {
      unionRegistryBuilder()
        .register<Root, SubA | SubB>()
        .register<DuplicateRootStructure, DuplicateSubA | DuplicateSubB>().
        // @ts-expect-error
        register
        <Root3, SubA3 | SubB3>()
        .build();
    });
    test('can add a base type even if it has the same discriminator as long as the structure is different to ones previously added', () => {
      unionRegistryBuilder()
        .register<Root, SubA | SubB>()
        .register<AlteredRootStructure, AlteredSubA | AlteredSubB>()
        .register<Root3, SubA3 | SubB3>()
        .build();
    });
    test('cannot add a sub type if it does not extend the base type', () => {
      unionRegistryBuilder()
        .register<Root,
          // @ts-expect-error
          SubA2
        >()
        .build();
    });
  });
  describe('unsupported built types', () => {
    test('never is not supported', () => {
      // @ts-expect-error
      fluentBuilder
        <never>();
    });
    test('unknown is not supported', () => {
      // @ts-expect-error
      fluentBuilder
        <unknown>();
    });
    test('any is not supported', () => {
      // @ts-expect-error
      fluentBuilder
        <any>();
    });
    test('null is not supported', () => {
      // @ts-expect-error
      fluentBuilder
        <null>();
    });
    test('undefined is not supported', () => {
      // @ts-expect-error
      fluentBuilder
        <undefined>();
    });
    test('string is not supported', () => {
      // @ts-expect-error
      fluentBuilder
        <string>();
    });
    test('number is not supported', () => {
      // @ts-expect-error
      fluentBuilder
        <number>();
    });
    test('bigint is not supported', () => {
      // @ts-expect-error
      fluentBuilder
        <bigint>();
    });
    test('symbol is not supported', () => {
      // @ts-expect-error
      fluentBuilder
        <symbol>();
    });
    test('function is not supported', () => {
      // @ts-expect-error
      fluentBuilder
        <Function>();
    });
    test('object is not supported', () => {
      // @ts-expect-error
      fluentBuilder
        <object>();
    });
    test('empty type is not supported', () => {
      // @ts-expect-error
      fluentBuilder
        <{}>();
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
      fluentBuilder<Record<string, Employee>>()
        .setInstance('Fred')
        .
        // @ts-expect-error
        build
        ();
    });
    test('cannot use the same function twice even if other functions have been called in between', () => {
      fluentBuilder<Record<string, Employee>>()
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
