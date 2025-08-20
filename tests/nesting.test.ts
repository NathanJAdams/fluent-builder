import { describe, expect, test } from 'vitest';
import { fluentBuilder, unionRegistryBuilder } from '../src';
import { Chair, House, Nested1, RoomObject, Table } from './test-types';

describe('nesting', () => {
  test('arbitrarily nested types can be built in one go', () => {
    const nested1 = fluentBuilder<Nested1>()
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
    const unionRegistry = unionRegistryBuilder()
      .register<RoomObject, Chair | Table>()
      .build();
    type MyunionRegistry = typeof unionRegistry;
    const house = fluentBuilder<House, MyunionRegistry>()
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
