import { describe, expect, test } from 'vitest';

import { fluentBuilder } from '../api';
import { House, Nested1 } from './test-types';

describe('nesting', () => {
  test('arbitrarily nested types can be built in one go', () => {
    const nested1 = fluentBuilder<Nested1>()
      .nested2Object()
      .nested3Object()
      .nested4Object()
      .nested5Object()
      .xyz('hello')
      .build()
      .build()
      .build()
      .build()
      .build();
    expect(nested1.nested2.nested3.nested4.nested5.xyz).toBe('hello');
  });
  test('random', () => {
    const house = fluentBuilder<House>()
      .roomsArray()
      .pushObject()
      .windowsRecord()
      .set('fds', { height: 12, material: 'plastic', width: 34 })
      .setObject('front').height(3).width(4).material('pvc').buildFront()
      .buildWindows()
      .furnitureArray()
      .pushObject().kind('chair').legs(3).buildElement()
      .buildFurniture()
      .buildElement()
      .buildRooms()
      .build();
    expect(house.a).toBeUndefined();
    expect(house.rooms.length).toBe(1);
  });
});
