import { METRIC_TYPES_VALUES } from '@/consts';
import type { CollectionObject } from '@server/types';

export type ValidType =
  | 'bool'
  | 'number'
  | 'email'
  | 'require'
  | 'confirm'
  | 'range'
  | 'password'
  | 'clusterName'
  | 'CIDRorIP'
  | 'integer'
  | 'positiveNumber'
  | 'collectionName'
  | 'dimension'
  | 'multiple'
  | 'partitionName'
  | 'firstCharacter'
  | 'specValueOrRange'
  | 'duplicate'
  | 'valueLength'
  | 'username'
  | 'cloudPassword'
  | 'custom';
export interface ICheckMapParam {
  value: string;
  extraParam?: IExtraParam;
  rule: ValidType;
}
export interface IExtraParam {
  // used for confirm or any compare type
  compareValue?: string | number;
  // used for length type
  min?: number;
  max?: number;
  type?: 'string' | 'number';

  // used for dimension
  metricType?: METRIC_TYPES_VALUES;
  multipleNumber?: number;

  // used for check start item
  invalidTypes?: TypeEnum[];
  // used for custom validation
  compare?: (value?: any) => boolean;
}
export type CheckMap = {
  [key in ValidType]: boolean;
};

export enum TypeEnum {
  'number' = 'number',
}

export const checkEmptyValid = (value: string | number): boolean => {
  return String(value).trim() !== '';
};

export const checkEmail = (value: string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(value);
};

/* password rules:
 * 1. at least one uppercase letter
 * 2. at least one lowercase letter
 * 3. at least one number
 * 4. at least one nonalphanumeric character: ! @ # $ % ^ & * ( ) _ + - = [ ] { } | '
 */
export const checkPasswordStrength = (value: string): boolean => {
  const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*([^A-Za-z0-9]))/;
  return re.test(value);
};

export const checkRange = (param: {
  value: string | number;
  min?: number;
  max?: number;
  type?: 'string' | 'number';
}): boolean => {
  const { value, min = 0, max = 0, type } = param;
  const length = type === 'number' ? Number(value) : (value as string).length;

  let result = true;
  const conditionMap = {
    min: length >= min,
    max: length <= max,
  };
  if (min !== 0) {
    result = result && conditionMap.min;
  }
  if (max !== 0) {
    result = result && conditionMap.max;
  }

  return result;
};

export const checkClusterName = (value: string): boolean => {
  const re = new RegExp('^[A-Za-z0-9+-=._:@/ ]*$');
  return re.test(value);
};

export const checkIP = (value: string): boolean => {
  const re =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return re.test(value);
};

export const checkCIDR = (value: string): boolean => {
  const re =
    /^(?:(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\/([0-9]|[1-2]\d|3[0-2])$/;
  return re.test(value);
};

export const checkIpOrCIDR = (value: string): boolean => {
  // const re = new RegExp('^([0-9]{1,3}.){3}[0-9]{1,3}($|/(16|24)$)');
  // return re.test(value);
  return checkIP(value) || checkCIDR(value);
};

// collection name can only be combined with number, letter or _
export const checkCollectionName = (value: string): boolean => {
  const re = /^[0-9,a-z,A-Z_]+$/;
  return re.test(value);
};

/**
 * check data type
 * @param type data types, like string, number
 * @param value
 * @returns whether value's value is equal to param type
 */
export const checkType = (type: TypeEnum, value: string): boolean => {
  switch (type) {
    case TypeEnum.number:
      return !isNaN(Number(value));
    default:
      return true;
  }
};

/**
 * check input first character
 * @param value
 * @param invalidTypes
 * @returns whether start letter type not belongs to invalid types
 */
export const checkFirstCharacter = (param: {
  value: string;
  invalidTypes?: TypeEnum[];
}): boolean => {
  const { value, invalidTypes } = param;
  const start = value[0];
  const types = invalidTypes || [];
  for (let type of types) {
    const result = checkType(type, start);
    if (result) {
      return false;
    }
  }

  return true;
};

export const checkPartitionName = (value: string): boolean => {
  return value !== '_default';
};

export const checkMultiple = (param: {
  value: string;
  multipleNumber?: number;
}): boolean => {
  const { value, multipleNumber = 1 } = param;
  return Number(value) % multipleNumber === 0;
};

export const checkDimension = (param: {
  value: string;
  metricType?: METRIC_TYPES_VALUES;
  multipleNumber?: number;
}): boolean => {
  const { value, metricType, multipleNumber } = param;
  if (
    metricType === METRIC_TYPES_VALUES.IP ||
    metricType === METRIC_TYPES_VALUES.L2
  ) {
    return true;
  }
  return checkMultiple({ value, multipleNumber });
};

/**
 * function to check whether value(type: number) is equal to specified value or in valid range
 * @param param specValue and params checkRange function needed
 * @returns whether input is valid
 */
export const checkSpecValueOrRange = (param: {
  value: number;
  min: number;
  max: number;
  compareValue: number;
}): boolean => {
  const { value, min, max, compareValue } = param;
  return (
    value === compareValue || checkRange({ min, max, value, type: 'number' })
  );
};

export const checkDuplicate = (param: {
  value: string | number;
  compare: string | number;
}) => {
  return param.value !== param.compare;
};

export const checkBool = (value: string): boolean => {
  const v = String(value).toLowerCase();
  return v === 'true' || v === 'false';
};

export const checkNumber = (value: string): boolean => {
  return !isNaN(Number(value));
};

export const checkValueLength = (value: string, min: number, max: number) => {
  return value.length >= min && value.length <= max;
};

// Username must not be empty, and must not exceed 32 characters in length. It must start with a letter, and only contains underscores, letters, or numbers.
export const checkUserName = (value: string): boolean => {
  const re = /^[a-zA-Z][a-zA-Z0-9_]{0,31}$/;
  return re.test(value);
};

// includ 3 of 4 types of characters: uppercase, lowercase, number, special character
export const checkCloudPassword = (value: string): boolean => {
  const re =
    /^(?![A-Za-z]+$)(?![A-Z\d]+$)(?![A-Z\W]+$)(?![a-z\d]+$)(?![a-z\W]+$)(?![\d\W]+$).{3,}$/;
  return re.test(value);
};

export const getCheckResult = (param: ICheckMapParam): boolean => {
  const { value, extraParam = {}, rule } = param;
  const numberValue = Number(value);

  const checkMap = {
    bool: checkBool(value),
    number: checkNumber(value),
    email: checkEmail(value),
    require: checkEmptyValid(value),
    confirm: value === extraParam?.compareValue,
    range: checkRange({
      value,
      min: extraParam?.min,
      max: extraParam?.max,
      type: extraParam?.type,
    }),
    password: checkPasswordStrength(value),
    cloudPassword: checkCloudPassword(value),
    clusterName: checkClusterName(value),
    CIDRorIP: checkIpOrCIDR(value),
    integer: !isNaN(numberValue) && Number.isInteger(numberValue),
    positiveNumber: !isNaN(numberValue) && numberValue > 0,
    collectionName: checkCollectionName(value),
    dimension: checkDimension({
      value,
      metricType: extraParam?.metricType,
      multipleNumber: extraParam?.multipleNumber,
    }),
    multiple: checkMultiple({
      value,
      multipleNumber: extraParam?.multipleNumber,
    }),
    partitionName: checkPartitionName(value),
    firstCharacter: checkFirstCharacter({
      value,
      invalidTypes: extraParam?.invalidTypes,
    }),
    specValueOrRange: checkSpecValueOrRange({
      value: Number(value),
      min: extraParam?.min || 0,
      max: extraParam?.max || 0,
      compareValue: Number(extraParam.compareValue) || 0,
    }),
    duplicate: checkDuplicate({ value, compare: extraParam.compareValue! }),
    valueLength: checkValueLength(value, extraParam.min!, extraParam.max!),
    username: checkUserName(value),
    custom:
      extraParam && typeof extraParam.compare === 'function'
        ? extraParam.compare(value)
        : true,
  };

  return checkMap[rule];
};

/**
 * Check collection is loading or not
 */
export const checkLoading = (v: CollectionObject): boolean => {
  return (
    typeof v.loadedPercentage !== 'undefined' &&
    v.loadedPercentage !== -1 &&
    v.loadedPercentage !== 100
  );
};

/**
 * Check collection is index building or not.
 * @param v
 * @returns boolean
 */
export const checkIndexBuilding = (v: CollectionObject): boolean => {
  return Boolean(
    v.schema &&
      v.schema?.fields.some(field => field.index?.state === 'InProgress')
  );
};
