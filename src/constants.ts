export const errorMessages = {
  notBuildable: 'Primitives, any, unknown, never, function, empty object/tuple types cannot be built. Please choose another type.',
  unionNotRegistered: 'Is this type a union which needs to be registered in the union registry (the second generic parameter)? If not, please raise an issue at https://github.com/NathanJAdams/ts-fluent-builder/issues and include the type causing this error. Thank you.',
  validNotBuildable: 'Internal Error: Type is valid but cannot currently be built. Please raise an issue at https://github.com/NathanJAdams/ts-fluent-builder/issues and include the type causing this error. Thank you.',
  isTupleNotExtendReadonlyArray: 'Internal Error: IsTuple but does not extend readonly array.',
  isArrayNotExtendArray: 'Internal Error: IsArray but does not extend Array.',
  isUnionMetadataFoundUnusable: 'Internal Error: IsUnion metadata found but not usable.',
} as const;

export const suffixes = {
  array: 'Array',
  object: 'Object',
  record: 'Record',
  tuple: 'Tuple',
} as const;
