import { errorMessages } from './constants';
import { HasError } from './utility-types';

export type ErrorNotBuildable = HasError<typeof errorMessages.notBuildable>
export type ErrorUnionNotRegistered = HasError<typeof errorMessages.unionNotRegistered>
export type ErrorIsArrayNotExtendArray = HasError<typeof errorMessages.isArrayNotExtendArray>
export type ErrorIsTupleNotExtendReadonlyArray = HasError<typeof errorMessages.isTupleNotExtendReadonlyArray>;
export type ErrorIsUnionUnusableMetadata = HasError<typeof errorMessages.isUnionMetadataFoundUnusable>;
export type ErrorValidButNotBuildable = HasError<typeof errorMessages.validNotBuildable>;
