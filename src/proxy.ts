import { suffixes } from './constants';

type AccumulatedType = 'object' | 'array' | 'record';

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
        if (property.startsWith('push') || property.startsWith('index')) {
          accumulatedType = 'array';
          accumulatedValues = [];
        } else if (property.startsWith('set')) {
          accumulatedType = 'record';
          accumulatedValues = {};
        } else {
          accumulatedType = 'object';
          accumulatedValues = {};
        }
      } else {
        if (property.startsWith('push') || property.startsWith('index')) {
          if (accumulatedType !== 'array') {
            throw Error(`Cannot call a push() or index() function on ${accumulatedType} type`);
          }
        } else if (property.startsWith('set')) {
          if (accumulatedType !== 'record') {
            throw Error(`Cannot call a set() function on ${accumulatedType} type`);
          }
        } else if (accumulatedType !== 'object') {
          throw Error(`Cannot call a value function on ${accumulatedType} type`);
        }
      }
      const nestedAccumulatedType: AccumulatedType | undefined = property.endsWith(suffixes.array)
        ? 'array'
        : (property.endsWith(suffixes.object))
          ? 'object'
          : property.endsWith(suffixes.record)
            ? 'record'
            : undefined;
      const nestedAccumulatedValues = (nestedAccumulatedType === 'array')
        ? []
        : (nestedAccumulatedType === 'object' || nestedAccumulatedType === 'record')
          ? {}
          : undefined;
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
        } else if (/^index[0-9]+$/.test(property)) {
          return (value: any) => {
            const tuple = accumulatedValues as any[];
            tuple.push(value);
            return proxy;
          };
        } else {
          return (value: any) => {
            const object = accumulatedValues as Record<string, any>;
            const key = toKey(property);
            object[key] = value;
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
      } else if (property.startsWith('index')) {
        return () => _createBuilder(nestedAccumulatedType, nestedAccumulatedValues, value => {
          const tuple = accumulatedValues as any[];
          tuple.push(value);
          return proxy;
        });
      } else {
        return () => _createBuilder(nestedAccumulatedType, nestedAccumulatedValues, value => {
          const object = accumulatedValues as Record<string, any>;
          const key = toKey(property);
          object[key] = value;
          return proxy;
        });
      }
    }
  };
  const proxy = new Proxy({}, handler);
  return proxy;
};

const toKey = (property: string): string => {
  if (property.endsWith(suffixes.array)) {
    return stripSuffix(property, suffixes.array);
  }
  if (property.endsWith(suffixes.object)) {
    return stripSuffix(property, suffixes.object);
  }
  if (property.endsWith(suffixes.record)) {
    return stripSuffix(property, suffixes.record);
  }
  return property;
};

const stripSuffix = (property: string, suffix: string): string => property.substring(0, property.length - suffix.length);
