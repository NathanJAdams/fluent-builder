import { ARRAY_SUFFIX, INSTANCE_SUFFIX, RECORD_SUFFIX, SUB_TYPE_SUFFIX } from './suffixes';

type AccumulatedType = 'instance' | 'array' | 'record';

export const createBuilder = () => _createBuilder();

const _createBuilder = (accumulatedType?: AccumulatedType, accumulatedValues?: any, finalizer: (built: any) => any = (built) => built): any => {
  const handler: ProxyHandler<any> = {
    get(_, property: string) {
      if (property.startsWith('build')) {
        return () => {
          if (accumulatedValues === undefined) {
            throw Error('Cannot build something from nothing.');
          }
          return finalizer(accumulatedValues);
        };
      }
      if (accumulatedType === undefined) {
        if (property.startsWith('push')) {
          accumulatedType = 'array';
          accumulatedValues = [];
        } else if (property.startsWith('set')) {
          accumulatedType = 'record';
          accumulatedValues = {};
        } else {
          accumulatedType = 'instance';
          accumulatedValues = {};
        }
      } else {
        if (property.startsWith('push')) {
          if (accumulatedType !== 'array') {
            throw Error(`Cannot call a push() function on ${accumulatedType} type`);
          }
        } else if (property.startsWith('set')) {
          if (accumulatedType !== 'record') {
            throw Error(`Cannot call a set() function on ${accumulatedType} type`);
          }
        } else if (accumulatedType !== 'instance') {
          throw Error(`Cannot call a value function on ${accumulatedType} type`);
        }
      }
      const nestedAccumulatedType: AccumulatedType | undefined = property.endsWith(ARRAY_SUFFIX)
        ? 'array'
        : property.endsWith(RECORD_SUFFIX)
          ? 'record'
          : (property.endsWith(INSTANCE_SUFFIX) || property.endsWith(SUB_TYPE_SUFFIX))
            ? 'instance'
            : undefined;
      const nestedAccumulatedValues = (nestedAccumulatedType === undefined)
        ? undefined
        : (nestedAccumulatedType === 'array')
          ? []
          : {};
      if (nestedAccumulatedType === undefined) {
        if (property === 'set') {
          return (name: string, value: any) => {
            const record = accumulatedValues as Record<string, any>;
            record[name] = value;
            return proxy;
          };
        } else if (property === 'push') {
          return (value: any) => {
            const array = accumulatedValues as any[];
            array.push(value);
            return proxy;
          };
        } else {
          return (value: any) => {
            const instance = accumulatedValues as Record<string, any>;
            const key = toKey(property);
            instance[key] = value;
            return proxy;
          };
        }
      }
      if (property.startsWith('set')) {
        return (name: string) => _createBuilder(nestedAccumulatedType, nestedAccumulatedValues, value => {
          const record = accumulatedValues as Record<string, any>;
          record[name] = value;
          return proxy;
        });
      } else if (property.startsWith('push')) {
        return () => _createBuilder(nestedAccumulatedType, nestedAccumulatedValues, value => {
          const array = accumulatedValues as any[];
          array.push(value);
          return proxy;
        });
      } else {
        return () => _createBuilder(nestedAccumulatedType, nestedAccumulatedValues, value => {
          const instance = accumulatedValues as Record<string, any>;
          const key = toKey(property);
          instance[key] = value;
          return proxy;
        });
      }
    }
  };
  const proxy = new Proxy({}, handler);
  return proxy;
};

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

const stripSuffix = (property: string, suffix: string): string => property.substring(0, property.length - suffix.length);
