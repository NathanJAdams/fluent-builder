export type NonEmptyArray<T> = [T, ...T[]];

export type House = {
  a?: boolean;
  rooms: Room[];
};
export type Room = {
  furniture: RoomObject[];
  windows?: Record<string, RoomWindow>;
};
export type Chair = {
  kind: 'chair';
  legs: number;
};
export type Table = {
  kind: 'table';
  width: number;
  breadth: number;
  height: number;
};
export type RoomObject = Chair | Table;
export type RoomWindow = {
  width: number;
  height: number;
  material: string;
};

export type Example = {
  a: number;
  b: string;
  c?: number;
  d: number | undefined;
  e?: number | undefined;
};
export type Nested1 = {
  nested2: Nested2;
};
export type Nested2 = {
  nested3: Nested3;
};
export type Nested3 = {
  nested4: Nested4;
};
export type Nested4 = {
  nested5: Nested5;
};
export type Nested5 = {
  xyz: string;
};

export type Dog = {
  kind: 'dog';
  food: string;
};
export type Human = {
  kind: 'human';
  age: number;
  pets?: Animal[];
  grandchildren?: Record<string, Child[]>;
};
export type Child = {
  name: string;
};
export type Animal = Dog | Human | Child;

export type Employee = {
  name: string;
  age: number;
  alive: boolean;
};

export type Root = {
  kind: string;
  example?: Example;
};
export type SubA = Root & {
  kind: 'a';
  a: number;
};
export type SubB = Root & {
  kind: 'b';
  b: string;
  bx?: string;
};
export type SubBB = Root & {
  kind: 'bb';
  b: boolean;
  cy?: boolean;
};
export type Root2 = {
  kind2: string;
};
export type SubA2 = Root2 & {
  kind2: 'a';
  a: number;
};
export type SubB2 = Root2 & {
  kind2: 'b';
  b: boolean;
};

export type Root3 = {
  kind3: string;
};
export type SubA3 = Root3 & {
  kind3: 'a';
  a: number;
};
export type SubB3 = Root3 & {
  kind3: 'b';
  b: boolean;
};

export type DuplicateRootStructure = {
  kind: string;
};
export type DuplicateSubA = DuplicateRootStructure & {
  kind: 'duplicateA';
};
export type DuplicateSubB = DuplicateRootStructure & {
  kind: 'duplicateB';
};

export type AlteredRootStructure = {
  kind: string;
  extra: number;
};
export type AlteredSubA = AlteredRootStructure & {
  kind: 'duplicateA';
};
export type AlteredSubB = AlteredRootStructure & {
  kind: 'duplicateB';
};


export type UnionMemberNormal = {
  string: string;
};
export type UnionMemberWithNonEmptyArray = {
  numbersNonEmpty: NonEmptyArray<number>;
  numbersNormal: Array<number>;
  numbersTuple: [number, number, number];
};
export type Union = UnionMemberNormal | UnionMemberWithNonEmptyArray;


export type Library = {
  books: Record<string, string>;
};
export type Places = {
  cinemas: Record<string, string>;
};

export type Strings = {
  kind: 'string';
  values: string[];
};
export type Numbers = {
  kind: 'number';
  values: number[];
};
export type Single = {
  kind: 'boolean';
  values: boolean;
};


export type One = {
  place: Library;
};
export type Two = {
  place: Places;
};
