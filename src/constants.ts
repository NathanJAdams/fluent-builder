export const errorMessages = {
  notValid: 'Primitives, any, unknown, never, function and empty object/tuple types cannot be built. Please choose another type.',
  notBuildable: 'Unions of arrays/records are currently not buildable. If this is a nested array/record, the setter function can be used with a nested fluentBuilder().build() instead. For other types please raise an issue at https://github.com/NathanJAdams/ts-fluent-builder/issues and include the type causing this error. Thank you.',
} as const;

export const suffixes = {
  array: 'Array',
  object: 'Object',
  record: 'Record',
} as const;
