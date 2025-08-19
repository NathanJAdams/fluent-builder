export type House = {
  rooms: Room[];
};
export type Room = {
  furniture: RoomObject[];
  windows?: Record<string, RoomWindow>;
};
export type RoomObject = {
  kind: string;
};
export type Chair = RoomObject & {
  kind: 'chair';
  legs: number;
};
export type Table = RoomObject & {
  kind: 'table';
  width: number;
  breadth: number;
  height: number;
};
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

export type Animal = {
  kind: string;
};
export type Dog = Animal & {
  kind: 'dog';
  food: string;
};
export type Human = Animal & {
  kind: 'human';
  age: number;
  pets?: Animal[];
  grandchildren?: Record<string, Child[]>;
};
export type Child = Animal & {
  name: string;
};

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
  kind: 'b';
  b: boolean;
  by?: boolean;
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
