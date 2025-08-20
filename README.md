# ts-fluent-builder

A powerful TypeScript library for building any complex type, 100% fluent, arbitrarily nested, zero/de minimis config, with full IntelliSense support and compile-time type & data safety mechanisms.

## Features

- **Type-Safe**: Full TypeScript support with compile-time validation
- **Data-Safe**: Prevents overwriting data or building incomplete objects
- **Fluent API**: Intuitive method chaining for object construction
- **IntelliSense**: Rich autocomplete and type hints in your IDE
- **Build Any Complex Type**: Support for user-defined types & interfaces, arrays, records, unions
- **Union Registry**: Advanced support for polymorphic object construction
- **Flexible**: Works with any valid TypeScript type structure

## Installation

```bash
npm install ts-fluent-builder
# or
yarn add ts-fluent-builder
```

## Quick Start

```typescript
import { fluentBuilder } from 'ts-fluent-builder';

// Define your types
interface User {
  id: number;
  name: string;
  email: string;
  addresses: Address[];
}

interface Address {
  street: string;
  city: string;
  country: string;
}

// Build objects fluently
const user = fluentBuilder<User>()
  .id(1)
  .name('John Doe')
  .email('john@example.com')
  .addressesArray()
    .pushInstance()
      .street('123 Main St')
      .city('New York')
      .country('USA')
      .build()
    .push({
      street: '456 Oak Ave',
      city: 'Boston',
      country: 'USA'
    })
    .buildAddresses()
  .build();
```

## Core Concepts

### Instance Builder

Build complex objects with nested properties:

```typescript
interface Person {
  name: string;
  age: number;
  address: Address;
}

const person = fluentBuilder<Person>()
  .name('Alice')
  .age(30)
  .addressInstance()
    .street('123 Main St')
    .city('Springfield')
    .country('USA')
    .buildAddress()
  .build();
```

### Array Builder

Construct arrays with type-safe element addition:

```typescript
const numbers = fluentBuilder<number[]>()
  .push(1)
  .push(2)
  .push(3)
  .build(); // [1, 2, 3]

// Nested array building
interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoList {
  items: TodoItem[];
}

const todoList = fluentBuilder<TodoList>()
  .itemsArray()
    .pushInstance()
      .id(1)
      .title('Buy groceries')
      .completed(false)
      .build()
    .pushInstance()
      .id(2)
      .title('Walk the dog')
      .completed(true)
      .build()
    .buildItems()
  .build();
```

### Record Builder

Build record/dictionary types with dynamic keys:

```typescript
interface Config {
  url: string;
  timeout: number;
  enabled: boolean;
}

const config = fluentBuilder<Record<string, Config>>()
  .set('production', {
    url: 'https://api.example.com',
    timeout: 5000,
    enabled: true
  })
  .setInstance('development')
    .url('https://dev.api.example.com')
    .timeout(10000)
    .enabled(false)
    .buildDevelopment()
  .buildRecord();
```

### Union Registry

Handle polymorphic types and inheritance hierarchies:

```typescript
import { unionRegistryBuilder } from 'ts-fluent-builder';

// Define base and derived types
interface Shape {
  type: string;
  area: number;
}

interface Circle extends Shape {
  type: 'circle';
  radius: number;
}

interface Rectangle extends Shape {
  type: 'rectangle';
  width: number;
  height: number;
}

type ShapeUnion = Circle | Rectangle;

// Create union registry
const registry = unionRegistryBuilder()
  .register<Shape, ShapeUnion>()
  .build();

// Use as the optional second generic parameter when building
const shapes = fluentBuilder<Shape[], typeof registry>()
  .pushSubType()
    .type('circle')
    .area(78.54)
    .radius(5)
    .buildElement()
  .pushSubType()
    .type('rectangle')
    .area(20)
    .width(4)
    .height(5)
    .buildElement()
  .buildArray();
```

## API Reference

### Core Functions

#### `fluentBuilder<T>()`

Creates a new fluent builder for the specified type.

**Parameters:**
- `T`: The TypeScript type to build

**Returns:** A builder instance appropriate for the type (InstanceBuilder, ArrayBuilder, or RecordBuilder)

#### `unionRegistryBuilder()`

Creates a new union registry builder for handling polymorphic types.

**Returns:** `UnionRegistryBuilder` instance

### Builder Methods

All builders provide these common patterns:

#### Value Assignment
```typescript
.propertyName(value)    // Set a property value
.push(value)            // Add to array
.set(key, value)        // Add to record
```

#### Nested Builders
```typescript
.propertyNameInstance() // Start building a nested object
.propertyNameArray()    // Start building a nested array  
.propertyNameRecord()   // Start building a nested record
.propertyNameSubType()  // Start building a nested sub-type

.pushInstance()         // Start building a nested object to push onto the array
.pushArray()            // Start building a nested array to push onto the array
.pushRecord()           // Start building a nested record to push onto the array
.pushSubType()          // Start building a nested sub-type to push onto the array

.setInstance(name)      // Start building a nested object to set on the record
.setArray(name)         // Start building a nested array to set on the record
.setRecord(name)        // Start building a nested record to set on the record
.setSubType(name)       // Start building a nested sub-type to set on the record
```

#### Termination
```typescript
// Build and return either the result or the parent builder for continued chaining
.build()                

// all build...() functions are aliases of build() and can be used as hints to the developer, eg:
.buildRecordName()
.buildElement()
.buildInstance()
.buildArray()
.buildRecord()
.buildSubType()
```

## Advanced Usage

### Complex Nested Structures

```typescript
interface Company {
  name: string;
  departments: Department[];
  settings: Record<string, any>;
}

interface Department {
  name: string;
  employees: Employee[];
  budget: number;
}

interface Employee {
  id: number;
  name: string;
  role: string;
}

const company = fluentBuilder<Company>()
  .name('TechCorp')
  .departmentsArray()
    .pushInstance()
      .name('Engineering')
      .budget(500000)
      .employeesArray()
        .pushInstance()
          .id(1)
          .name('John Doe')
          .role('Senior Developer')
          .build()
        .pushInstance()
          .id(2)
          .name('Jane Smith')
          .role('Tech Lead')
          .build()
        .buildEmployees()
      .build()
    .buildDepartments()
  .settingsRecord()
    .set('theme', 'dark')
    .set('notifications', true)
    .set('autoSave', false)
    .buildSettings()
  .build();
```

### Working with Optional Properties

The builder automatically handles optional properties and will only require you to set mandatory fields:

```typescript
interface User {
  id: number;
  name: string;
  email?: string;  // optional
  phone?: string;  // optional
}

// This works - only required fields need to be set
const user = fluentBuilder<User>()
  .id(1)
  .name('John')
  .build();

// Optional fields can be added
const fullUser = fluentBuilder<User>()
  .id(1)
  .name('John')
  .email('john@example.com')
  .phone('+1234567890')
  .build();
```

## Type Safety Features

### Compile-Time Validation

ts-fluent-builder prevents common type and data mistakes at compile time:

```typescript
// ❌ This won't compile - missing required property
const invalid = fluentBuilder<User>()
  .name('John')
  // .id(1) - missing required field
  .build();

// ❌ This won't compile - wrong type
const wrongType = fluentBuilder<User>()
  .id('not-a-number')  // id expects number
  .build();

// ❌ This won't compile - duplicate property
const duplicate = fluentBuilder<User>()
  .id(1)
  .id(2)  // can't set id twice
  .build();

// ❌ This won't compile - duplicate record key
const duplicateKey = fluentBuilder<Record<string, Config>>()
  .set('production', config1)
  .set('production', config2)  // can't set same key twice
  .build();
```

### IntelliSense Support

- Autocomplete for available properties
- Type hints for expected values
- Documentation in tooltips
- Error highlighting for type mismatches

## Best Practices

1. **Use TypeScript**: ts-fluent-builder is designed for TypeScript and provides minimal value in plain JavaScript

2. **Define Interfaces or Types First**: Always define your types before using the builders

3. **Leverage IntelliSense**: Let your IDE guide you through the available methods

4. **Use a Union Registry**: For polymorphic types, create a union registry to get proper type support

## Contributing

We welcome contributions! Please open an issue or submit a pull request on [GitHub Issues](https://github.com/NathanJAdams/ts-fluent-builder/issues).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy Building!**
