import { Option } from '@/components/customSelector/Types';
import { FILE_MIME_TYPE } from '@/consts';
import type { PartitionData, CollectionObject } from '@server/types';
import { SchemaObject } from '@server/types';
import { InsertStatusEnum } from './consts';

export interface InsertContentProps {
  // optional on partition page since its collection is fixed
  collections?: CollectionObject[];
  // required on partition page since user can't select collection to get schema
  schema?: SchemaObject;
  // required on partition page
  partitions?: PartitionData[];

  // insert default selected collection
  // if default value is not '', collections not selectable
  defaultSelectedCollection: string;

  // insert default selected partition
  // if default value is not '', partitions not selectable
  defaultSelectedPartition: string;

  onInsert: Function;
}

export interface InsertImportProps {
  // selectors options
  collectionOptions: Option[];
  partitionOptions: Option[];
  // selectors value
  selectedCollection: string;
  selectedPartition: string;

  // selectors change methods
  // optional if collection not selectable
  handleCollectionChange?: (collectionName: string) => void;
  handlePartitionChange: (partitionName: string) => void;
  // handle uploaded data
  handleUploadedData: (
    data: string,
    uploader: HTMLFormElement,
    type: FILE_MIME_TYPE
  ) => void;
  handleUploadFileChange: (file: File, uploader: HTMLFormElement) => void;
  fileName: string;
  setFileName: (fileName: string) => void;
}

export interface InsertPreviewProps {
  schemaOptions: Option[];
  data: any[];

  tableHeads: string[];
  setTableHeads: (heads: string[]) => void;

  isContainFieldNames: number;
  handleIsContainedChange: (isContained: number) => void;
  file: File | null; // csv file
}

export interface InsertStatusProps {
  status: InsertStatusEnum;
  failMsg: string;
  importingCount: number;
}
