import { ARRAY_SUFFIX, INSTANCE_SUFFIX, RECORD_SUFFIX, SUB_TYPE_SUFFIX } from './suffixes';

type ValueReducer<TValue, TReduced> = {
  accumulate: (property: string, value: TValue, name?: string) => void;
  reduce: () => TReduced;
};

export const createBuilder = <TValue, TSchema, TFinal>(
  reducer: ValueReducer<TValue, TSchema>,
  finalizer: (built: TSchema) => TFinal = (built) => built as unknown as TFinal,
): any => {
  const handler: ProxyHandler<any> = {
    get(_, property: string) {
      if (property.startsWith('build')) {
        return () => finalizer(reducer.reduce());
      }
      const nestedReducer = property.endsWith(ARRAY_SUFFIX)
        ? reducers.ofArray()
        : property.endsWith(RECORD_SUFFIX)
          ? reducers.ofRecord()
          : (property.endsWith(INSTANCE_SUFFIX) || property.endsWith(SUB_TYPE_SUFFIX))
            ? reducers.ofInstance()
            : undefined;
      if (nestedReducer === undefined) {
        if (property === 'set') {
          return (name: string, value: TValue) => {
            reducer.accumulate(property, value, name);
            return proxy;
          };
        } else {
          return (value: TValue) => {
            reducer.accumulate(property, value);
            return proxy;
          };
        }
      }
      if (property.startsWith('set')) {
        return (name: string) => createBuilder(nestedReducer, instance => {
          reducer.accumulate(property, instance as TValue, name);
          return proxy;
        });
      } else {
        return () => createBuilder(nestedReducer, instance => {
          reducer.accumulate(property, instance as TValue, undefined);
          return proxy;
        });
      }
    }
  };
  const proxy = new Proxy({}, handler);
  return proxy;
};

export const reducers = {
  ofInstance: <TSchema extends Record<string, any>>(): ValueReducer<TSchema[string], TSchema> => {
    const values: Partial<TSchema> = {};
    return {
      accumulate(property, value) {
        const key = toKey(property);
        values[key as keyof TSchema] = value;
      },
      reduce() {
        return values as TSchema;
      },
    };
  },
  ofRecord: <TValue>(): ValueReducer<TValue, Record<string, TValue>> => {
    const values: Record<string, TValue> = {};
    return {
      accumulate(property, value, name) {
        if (name === undefined) {
          throw Error('Name for record entry is undefined');
        }
        values[name] = value;
      },
      reduce() {
        return values as Record<string, TValue>;
      },
    };
  },
  ofArray: <TElement>(): ValueReducer<TElement, TElement[]> => {
    const values: TElement[] = [];
    return {
      accumulate(property, value) {
        values.push(value);
      },
      reduce() {
        return values;
      },
    };
  },
};

const stripSuffix = (property: string, suffix: string): string => property.substring(0, property.length - suffix.length);
const toKey = (property: string): string => {
  if (property.endsWith(ARRAY_SUFFIX)) {
    return stripSuffix(property, ARRAY_SUFFIX);
  }
  if (property.endsWith(RECORD_SUFFIX)) {
    return stripSuffix(property, RECORD_SUFFIX);
  }
  if (property.endsWith(SUB_TYPE_SUFFIX)) {
    return stripSuffix(property, SUB_TYPE_SUFFIX);
  }
  if (property.endsWith(INSTANCE_SUFFIX)) {
    return stripSuffix(property, INSTANCE_SUFFIX);
  }
  return property;
};
