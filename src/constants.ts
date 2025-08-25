export const errorMessages = {
  notValid: 'Primitives, any, unknown, never, function, empty object/tuple types cannot be built. Please choose another type.',
  notBuildable: 'Internal Error: Type is valid but cannot currently be built. Please raise an issue at https://github.com/NathanJAdams/ts-fluent-builder/issues and include the type causing this error. Thank you.',
} as const;

export const suffixes = {
  array: 'Array',
  object: 'Object',
  record: 'Record',
} as const;
