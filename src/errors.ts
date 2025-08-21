import { errorMessages } from './constants';
import { HasError } from './utility-types';

export type ErrorNotBuildable = HasError<typeof errorMessages.notBuildable>
export type ErrorValidButNotBuildable = HasError<typeof errorMessages.validNotBuildable>;
