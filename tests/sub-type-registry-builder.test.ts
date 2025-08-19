import { describe, test, expect } from 'vitest';

import { subTypeRegistryBuilder } from '../src';

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

describe('sub-type-registry-builder', () => {
  describe('building', () => {
    test('can build an array of sub-type-metadata', () => {
      const subTypeRegistry = subTypeRegistryBuilder()
        .add<Root, SubA | SubB>()
        .add<Root2, SubA2 | SubB2>()
        .build();
      expect(subTypeRegistry.length).toBe(2);
    });
  });
  describe('compile errors', () => {
    test('cannot add the same sub type metadata type twice even after adding others in between', () => {
      subTypeRegistryBuilder()
        .add<Root, SubA | SubB>()
        .add<Root2, SubA2 | SubB2>()
        .add<Root, SubA | SubB>().
        // @ts-expect-error
        add
        <Root3, SubA3 | SubB3>()
        .build();
    });
    test('cannot add a base type if it has the exact same structure as one already added, no way to distinguish which type to use', () => {
      subTypeRegistryBuilder()
        .add<Root, SubA | SubB>()
        .add<DuplicateRootStructure, DuplicateSubA | DuplicateSubB>().
        // @ts-expect-error
        add
        <Root3, SubA3 | SubB3>()
        .build();
    });
    test('can add a base type even if it has the same discriminator as long as the structure is different to ones previously added', () => {
      subTypeRegistryBuilder()
        .add<Root, SubA | SubB>()
        .add<AlteredRootStructure, AlteredSubA | AlteredSubB>()
        .add<Root3, SubA3 | SubB3>()
        .build();
    });
    test('cannot add a sub type if it does not extend the base type', () => {
      subTypeRegistryBuilder()
        .add<Root,
          // @ts-expect-error
          SubA2
        >()
        .build();
    });
  });
});
