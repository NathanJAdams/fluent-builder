import { errorMessages } from './constants';

export type ErrorNotValid = HasError<typeof errorMessages.notValid>
export type ErrorNotBuildable = HasError<typeof errorMessages.notBuildable>;

type HasError<TError extends string> = {
  error: TError;
};
