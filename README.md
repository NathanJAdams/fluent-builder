# ts-fluent-builder

A powerful TypeScript library for building any complex type, 100% fluent, arbitrarily nested, zero config, with full IntelliSense support and compile-time type & data safety mechanisms.

## Features

- **Simple & Powerful**: A single function to build any complex type, interface, array, record, union or tuple
- **Type-Safe**: Full TypeScript support with compile-time validation
- **Data-Safe**: Prevents overwriting data or building incomplete objects
- **Fluent API**: Intuitive method chaining for object construction
- **IntelliSense**: Rich autocomplete and type hints in your IDE
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
    .pushObject()
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

## API Reference

#### `fluentBuilder<T>()`

Creates a new fluent builder for the specified type.

**Parameters:**
- `T`: The TypeScript type to build

**Returns:** A builder instance with functions ready to build the type

```typescript
// objects
interface Person {
  name: string;
  age: number;
  address: Address;
}
const person = fluentBuilder<Person>()
  .name('Alice')
  .age(30)
  .addressObject()
    .street('123 Main St')
    .city('Springfield')
    .country('USA')
    .buildAddress()
  .build();
```

```typescript
// arrays
const numbers = fluentBuilder<number[]>()
  .push(1)
  .push(2)
  .push(3)
  .build(); // [1, 2, 3]

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
    .pushObject()
      .id(1)
      .title('Buy groceries')
      .completed(false)
      .build()
    .pushObject()
      .id(2)
      .title('Walk the dog')
      .completed(true)
      .build()
    .buildItems()
  .build();
```

```typescript
// records
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
  .setObject('development')
    .url('https://dev.api.example.com')
    .timeout(10000)
    .enabled(false)
    .buildDevelopment()
  .buildRecord();
```

```typescript
// polymorphic types via unions

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

const shapes = fluentBuilder<(Circle | Rectangle)[]>()
  .pushObject()
    .type('circle')
    .area(Math.PI * 5 * 5)
    .radius(5)
    .buildElement()
  .pushObject()
    .type('rectangle')
    .area(20)
    .width(4)
    .height(5)
    .buildElement()
  .buildArray();
```

```typescript
// tuples
const falsyValues = fluentBuilder<[boolean, number, bigint, string]>()
  .index0(false)
  .index1(0)
  .index2(0n)
  .index3('')
  .buildTuple();
```

### Builder Methods

There are a few common patterns used:

#### Value Assignment
```typescript
.propertyName(value)    // Set a property value on an object
.push(value)            // Append to an array
.set(key, value)        // Set a key value entry on a record
.indexN(value)          // Set indexed value on a tuple
```

#### Nested Builders
```typescript
.propertyNameArray()    // Start building a nested array  
.propertyNameObject()   // Start building a nested object
.propertyNameRecord()   // Start building a nested record
.propertyNameTuple()    // Start building a nested tuple

.pushArray()            // Start building a nested array to push onto the array
.pushObject()           // Start building a nested object to push onto the array
.pushRecord()           // Start building a nested record to push onto the array

.setArray(name)         // Start building a nested array to set on the record
.setObject(name)        // Start building a nested sub-type to set on the record
.setRecord(name)        // Start building a nested record to set on the record
.setTuple(name)         // Start building a nested tuple to set on the record
```

#### Termination
```typescript
// Build and return either the result or the parent builder for continued chaining
.build()                

// all build...() functions are aliases of build() and can be used as hints to the developer, eg:
.buildRecordName()
.buildArray()
.buildObject()
.buildRecord()
.buildTuple()
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
    .pushObject()
      .name('Engineering')
      .budget(500000)
      .employeesArray()
        .pushObject()
          .id(1)
          .name('John Doe')
          .role('Senior Developer')
          .build()
        .pushObject()
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
interface User {
  id: number;
  name: string;
  email?: string;  // optional
  phone?: string;  // optional
}

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
const duplicateProperty = fluentBuilder<User>()
  .id(1)
  .id(2)  // can't set id twice
  .build();

// ❌ This won't compile - duplicate record key
const duplicateKey = fluentBuilder<Record<string, boolean>>()
  .set('production', true)
  .set('production', false)  // can't set same key twice
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

5. **Use the build...() Aliases**: Help later developers easily see where they're looking in the build chain

## Contributing

Contributions are very welcome! Please open an issue or submit a pull request on [GitHub Issues](https://github.com/NathanJAdams/ts-fluent-builder/issues).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy Building!**
