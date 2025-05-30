export {
  KeyValuePair,
  ShowCollectionsType,
  MilvusClient,
  ResStatus,
  RerankerObj,
  TypeParamKey,
  TypeParam,
  QueryResults,
  SearchResultData,
  MutationResult,
} from '@zilliz/milvus2-sdk-node';

export * from './collections.type';
export * from './partitions.type';
export * from './users.type';

export type AuthReq = {
  username: string;
  password: string;
  address: string;
  token: string;
  ssl: boolean;
  database: string;
  checkHealth: boolean;
  clientId: string;
};

export type AuthObject = {
  clientId: string;
  database: string;
};
