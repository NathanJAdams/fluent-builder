import { describe, test, expect } from 'vitest';

import { arrayBuilder, instanceBuilder, subTypeInfoBuilder } from '../src';


type House = {
  rooms: Room[];
};
type Room = {
  furniture: RoomObject[];
  windows: Record<string, Window>;
};
type RoomObject = {
  kind: string;
};
type Chair = RoomObject & {
  kind: 'chair';
  legs: number;
};
type Table = RoomObject & {
  kind: 'table';
  width: number;
  breadth: number;
  height: number;
};
type Window = {
  width: number;
  height: number;
  material: string;
};

const subTypes = subTypeInfoBuilder()
  .add<RoomObject, Chair | Table, 'kind'>()
  .build();
type MySubTypes = typeof subTypes;

const house = instanceBuilder<House, MySubTypes>()
  .roomsArrayBuilder()
  .add({ furniture: [], windows: {} })
  .addBuilder()
  .furnitureArrayBuilder()
  .addSubTypeBuilder().kind('table').width(4).breadth(5).height(3).buildTable()
  .buildFurniture()
  .windowsRecordBuilder()
  .addBuilder('front').height(3).width(4).material('pvc').buildFront()
  .buildWindows()
  .buildElement()
  .buildRooms()
  .build();



type Employee = {
  name: string;
  startDate: Date;
};

describe('array-builder', () => {
  describe('building', () => {
    test('builds an array with literal entries', () => {
      const values = arrayBuilder<string>()
        .add('a')
        .add('b')
        .add('c')
        .build();
      expect(Array.isArray(values)).toBe(true);
      expect(values.length).toBe(3);
      expect(values[0]).toBe('a');
      expect(values[1]).toBe('b');
      expect(values[2]).toBe('c');
    });
    test('builds an array with builders', () => {
      const values = arrayBuilder<Employee>()
        .addBuilder().name('Tim').startDate(new Date('2020/12/31')).build()
        .addBuilder().name('Ann').startDate(new Date('2015/06/27')).build()
        .build();
      expect(Array.isArray(values)).toBe(true);
      expect(values.length).toBe(2);
      expect(values[0].name).toBe('Tim');
      expect(values[1].name).toBe('Ann');
    });
  });
  describe('compile errors', () => {
    test('functions not backed by the type do not compile and would throw if ran', () => {
      expect(() => arrayBuilder<Employee>().
        // @ts-expect-error
        abcdef
        ()).toThrow();
    });
  });
});
