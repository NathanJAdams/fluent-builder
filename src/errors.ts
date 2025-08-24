import { errorMessages } from './constants';

export type ErrorNotValid = HasError<typeof errorMessages.notValid>
export type ErrorNotBuildable = HasError<typeof errorMessages.notBuildable>;
export type ErrorNotConsistent = HasError<typeof errorMessages.notConsistent>;

type HasError<TError extends string> = {
  error: (errorMessage: string extends TError ? never : TError) => never;
};
