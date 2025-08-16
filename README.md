# ts-fluent-builder
A TypeScript library for building types - 100% fluent, arbitrarily nested, zero/de minimis config with compile time type & data safety mechanisms.


## Contents

[Install](#Install)

[Usage](#Usage)

[Safety](#Safety)

[Nesting](#Nesting)


## Install

Install via one of the commands

```sh
npm -i ts-fluent-builder
yarn add ts-fluent-builder
```


## Usage

There are 4 types of object which `ts-fluent-builder` can build:

- A user defined type
- An array
- A record
- A sub type of a user defined type

#### User defined type

```typescript
import { instanceBuilder } from 'ts-fluent-builder';

type Car = {
  color: string;
  doors: number;
};

const car = instanceBuilder<Car>()
  .color('red')
  .doors(4)
  .build();
```

#### Array

Array elements can be built by value or by a nested builder or a mix of both.

```typescript
import { arrayBuilder } from 'ts-fluent-builder';

type Employee = {
  name: string;
  department: string;
};

const employees = arrayBuilder<Employee>()
  .add({ name: 'Laura', department: 'Accounts' })
  .addBuilder().name('John').department('Sales').build()
  .build();
```

#### Record

Record entries can also be built by value or by a nested builder or a mix of both. They also require a name for each entry.

```typescript
import { recordBuilder } from 'ts-fluent-builder';

type Child = {
  age: number;
  hairColor: string;
};

const children = recordBuilder<Child>()
  .add('Timmy', { age: 2, hairColor: 'brown' })
  .addBuilder('Alice').age(4).hairColor('red').buildAlice()
  .build();

// A top level record will also have named fields for each entry
const timmyAge = children.Timmy.age;
const aliceHairColor = children.Alice.hairColor;
```

#### SubType of user defined type

Sometimes a type is a base type which shouldn't be built directly, but might still need to be used as a field type. To let ts-fluent-builder know which types are available requires a small amount of config which can itself be built via generic parameters.

```typescript
import { subTypeBuilder, subTypeInfoBuilder } from 'ts-fluent-builder';

type Vehicle = {
  vehicleType: string;
  color: string;
};
type Bike = Vehicle & {
  vehicleType: 'bike';
  wheelSpokes: number;
};
type Truck = Vehicle & {
  vehicleType: 'truck';
  haulageCapacity: number;
};

const subTypes = subTypeInfoBuilder()
  .add<Vehicle, Bike | Truck, 'vehicleType'>()
  .build();
type MySubTypes = typeof subTypes;
```

The 3 generic parameters are, in order:

- The root/base type
- A union of all sub types
- The discriminator used to distinguish between sub types

The `type` of the resulting sub types array will be needed for building objects as shown here

```typescript
const bike = subTypeBuilder<Vehicle, MySubTypes>()
  .vehicleType('bike')
  .color('blue')
  .wheelSpokes(48)
  .buildBike();
```

The sub type builder will first provide a discriminator function to choose which sub type to build, then provide builder functions for that specific sub type as normal.

#### Build functions

In addition to the normal `build()` functions, some builders also offer aliased named build functions which say what they are building, eg. `buildBike()`. These are simply aliases and do exactly the same as their normal `build()` counterparts. They are available as hints to their builder chain location in case the developer finds it useful or more readable to avoid long consecutive `.build().build()` chains.

The normal `build()` function will always be provided eg. in case the function name produced contained non-alphanumeric characters and couldn't be called in the normal manner. Future releases may also offer a `buildAll()` or `buildAllPossible()` function.


## Safety

A number of compile time safety mechanisms are included to prevent runtime errors.

#### Build functions are only available when all required fields are set

When creating a type, fields are very often required and will cause runtime errors if undefined. Therefore to guarantee data safety at runtime, ts-fluent-builder actively prevents building until all non-optional fields are given, the build function will simply not be available. A field counts as optional if it has a question mark or if it's value type is a union with undefined.

```typescript
import { instanceBuilder } from 'ts-fluent-builder';

type Car = {
  color: string;
  doors: number;
  hasSunRoof: boolean | undefined;
  isRusty?: boolean;
};

const car = instanceBuilder<Car>()
  .color('red')
  .doors(4)
  .build();
  // compiles without error as fields `hasSunRoof` and `isRusty` are both optional

const unbuilt = instanceBuilder<Car>()
  .color('yellow')
  .build(); // <- compile time error prevents building until required `doors` field has been set
```

#### Fields cannot be overwritten

The ability to overwrite data can give rise to reasonable but invalid assumptions about what data is being used. To prevent this occuring, ts-fluent-builder keeps track of fields and does not make them available after they have been set, all at compile time.

```typescript
import { instanceBuilder } from 'ts-fluent-builder';

type Task = {
  name: string;
  hours: number;
  ... // other fields
  description: string;
};

const task = instanceBuilder<Task>()
  .name('Do some work')
  .hours(4)
  ... // other function calls
  .description('Long task description')
  .hours(10) // <- compile time error prevents overwriting data
  .build();
```

#### Named record entries cannot be overwritten

In a similar manner, ts-fluent-builder will prevent overwriting entries in a record if the key is a duplicate of one already added.

```typescript
import { recordBuilder } from 'ts-fluent-builder';

type Book = {
  title: string;
};

const books = recordBuilder<Book>()
  .addBuilder('').age(1).buildTimmy()
  .addBuilder('Sarah').age(4).buildSarah()
  .addBuilder('Timmy') // <- compile time error prevents overwriting entry previously added
  .age(1.5)
  .buildTimmy();
```


## Nesting

Arbitrarily deep nesting is supported, only limited by the compiler. Future releases may allow configuring a limit on this.

```typescript
import { instanceBuilder, subTypeInfoBuilder } from 'ts-fluent-builder';

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
```
