import { describe, test, expect } from 'vitest';

import { subTypeInfoBuilder } from '../src';

type Root = {
  kind: string;
};
type SubA = Root & {
  kind: 'a';
  a: number;
};
type SubB = Root & {
  kind: 'b';
  b: boolean;
};

type Root2 = {
  kind2: string;
};
type SubA2 = Root2 & {
  kind2: 'a';
  a: number;
};
type SubB2 = Root2 & {
  kind2: 'b';
  b: boolean;
};

type Root3 = {
  kind3: string;
};
type SubA3 = Root3 & {
  kind3: 'a';
  a: number;
};
type SubB3 = Root3 & {
  kind3: 'b';
  b: boolean;
};

type DuplicateRootStructure = {
  kind: string;
};
type DuplicateSubA = DuplicateRootStructure & {
  kind: 'duplicateA';
};
type DuplicateSubB = DuplicateRootStructure & {
  kind: 'duplicateB';
};

type AlteredRootStructure = {
  kind: string;
  extra: number;
};
type AlteredSubA = AlteredRootStructure & {
  kind: 'duplicateA';
};
type AlteredSubB = AlteredRootStructure & {
  kind: 'duplicateB';
};

const subTypes = subTypeInfoBuilder()
  .add<Root, SubA | SubB, 'kind'>()
  .build();
const subTypes2 = subTypeInfoBuilder()
  .add<Root, SubA | SubB, 'kind'>()
  .add<Root2, SubA2 | SubB2, 'kind2'>()
  .build();
type MySubTypes = typeof subTypes;
type MySubTypes2 = typeof subTypes2;

describe('sub-type-info-builder', () => {
  describe('building', () => {
    test('can build an array of sub-type-info', () => {
      const subTypeInfoArray = subTypeInfoBuilder()
        .add<Root, SubA | SubB, 'kind'>()
        .add<Root2, SubA2 | SubB2, 'kind2'>()
        .build();
      expect(subTypeInfoArray.length).toBe(2);
    });
  });
  describe('compile errors', () => {
    test('cannot add the same sub info type twice even after adding others in between', () => {
      subTypeInfoBuilder()
        .add<Root, SubA | SubB, 'kind'>()
        .add<Root2, SubA2 | SubB2, 'kind2'>()
        .add<Root, SubA | SubB, 'kind'>().
        // @ts-expect-error
        add
        <Root3, SubA3 | SubB3, 'kind3'>()
        .build();
    });
    test('cannot add a base type if it has the exact same structure as one already added, no way to distinguish which type to use', () => {
      subTypeInfoBuilder()
        .add<Root, SubA | SubB, 'kind'>()
        .add<DuplicateRootStructure, DuplicateSubA | DuplicateSubB, 'kind'>().
        // @ts-expect-error
        add
        <Root3, SubA3 | SubB3, 'kind3'>()
        .build();
    });
    test('can add a base type even if it has the same discriminator as long as the structure is different to ones previously added', () => {
      subTypeInfoBuilder()
        .add<Root, SubA | SubB, 'kind'>()
        .add<AlteredRootStructure, AlteredSubA | AlteredSubB, 'kind'>()
        .add<Root3, SubA3 | SubB3, 'kind3'>()
        .build();
    });
    test('cannot add a sub type if it does not extend the base type', () => {
      subTypeInfoBuilder()
        .add<Root,
          // @ts-expect-error
          SubA2
          , 'kind'>()
        .build();
    });
    test('cannot use a discriminator if it does not appear in the base type', () => {
      subTypeInfoBuilder()
        .add<Root, SubA | SubB,
          // @ts-expect-error
          'non-existent-discriminator'
        >()
        .build();
    });
  });
});
