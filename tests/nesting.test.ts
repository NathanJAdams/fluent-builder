import { describe, expect, test } from 'vitest';
import { instanceBuilder, subTypeRegistryBuilder } from '../src';
import { Chair, House, Nested1, RoomObject, Table } from './test-types';

describe('nesting', () => {
  test('arbitrarily nested types can be built in one go', () => {
    const nested1 = instanceBuilder<Nested1>()
      .nested2Instance()
      .nested3Instance()
      .nested4Instance()
      .nested5Instance()
      .xyz('hello')
      .build()
      .build()
      .build()
      .build()
      .build();
    expect(nested1.nested2.nested3.nested4.nested5.xyz).toBe('hello');
  });
  test('random', () => {
    const subTypeRegistry = subTypeRegistryBuilder()
      .add<RoomObject, Chair | Table>()
      .build();
    type MySubTypeRegistry = typeof subTypeRegistry;
    const house = instanceBuilder<House, MySubTypeRegistry>()
      .roomsArray()
      .pushInstance()
      .windowsRecord()
      .set('fds', { height: 12, material: 'plastic', width: 34 })
      .setInstance('front').height(3).width(4).material('pvc').buildFront()
      .buildWindows()
      .furnitureArray()
      .pushSubType().kind('chair').legs(3).buildElement()
      .buildFurniture()
      .buildElement()
      .buildRooms()
      .build();
  });
});
