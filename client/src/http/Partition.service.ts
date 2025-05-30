import BaseModel from './BaseModel';
import type { PartitionData } from '@server/types';
import type {
  PartitionManageParam,
  PartitionParam,
} from '@/pages/databases/collections/partitions/Types';
import { ResStatus } from '@server/types';

export class PartitionService extends BaseModel {
  static getPartitions(collectionName: string) {
    const path = `/partitions`;

    return super.find<PartitionData[]>({
      path,
      params: { collection_name: collectionName },
    });
  }

  static managePartition(param: PartitionManageParam) {
    const { collectionName, partitionName, type } = param;
    return super.create<ResStatus>({
      path: `/partitions`,
      data: {
        collection_name: collectionName,
        partition_name: partitionName,
        type,
      },
    });
  }

  static loadPartition(param: PartitionParam) {
    const { collectionName, partitionNames } = param;
    const path = `/partitions/load`;
    return super.update({
      path,
      data: {
        collection_name: collectionName,
        partition_names: partitionNames,
      },
    });
  }

  static releasePartition(param: PartitionParam) {
    const { collectionName, partitionNames } = param;
    const path = `/partitions/release`;
    return super.update({
      path,
      data: {
        collection_name: collectionName,
        partition_names: partitionNames,
      },
    });
  }
}
