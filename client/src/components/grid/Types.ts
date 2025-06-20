import React, { ReactElement, Ref } from 'react';
import { LabelDisplayedRowsArgs } from '@mui/material';
import { IconsType } from '../icons/Types';
import { SearchType } from '../customInput/Types';
import type { SxProps, Theme } from '@mui/material';

export type IconConfigType = {
  [x: string]: JSX.Element;
};

export type ColorType = 'default' | 'inherit' | 'primary' | 'secondary';

export type SortDirection = 'asc' | 'desc';

export type SortType = 'string' | 'number';

/**
 * selected: selected data in table checkbox
 */
export type ToolBarType = {
  toolbarConfigs: ToolBarConfig[];
  selected?: any[];
  setSelected?: (selected: any[]) => void;
  hideOnDisable?: boolean;
};

export type TableSwitchType = {
  defaultActive?: 'list' | 'app';
  onListClick: () => void;
  onAppClick: () => void;
};

/**
 * postion: toolbar position
 * component: when type is not iconBtn button switch, render component
 */
export type ToolBarConfig = Partial<TableSwitchType> &
  Partial<SearchType> & {
    label: string;
    icon?: IconsType;
    color?: ColorType;
    // when type is not iconBtn, onClick is optional
    onClick?: (arg0: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    disabled?: (data: any[]) => boolean;
    tooltip?: string;
    // when disabled "disabledTooltip" will replace "tooltip"
    disabledTooltip?: string;
    hidden?: boolean;
    type?: 'iconBtn' | 'button' | 'switch' | 'select' | 'groupSelect';
    position?: 'right' | 'left';
    component?: ReactElement;
    btnVariant?: 'contained' | 'outlined' | 'text';
    btnColor?: 'primary' | 'secondary';
    alwaysShow?: boolean;
    hideOnDisable?: () => boolean;
  };

export type TableHeadType = {
  onSelectAllClick: (e: React.ChangeEvent) => void;
  order?: SortDirection;
  orderBy?: string;
  numSelected: number;
  rowCount: number;
  colDefinitions: ColDefinitionsType[];
  handleSort?: (e: any, p: string, col?: ColDefinitionsType) => void;
  openCheckBox?: boolean;
  disableSelect?: boolean;
  enableSelectAll?: boolean;
};

export type TableEditableHeadType = {
  editHeads: EditableHeads[];
};

export type EditableHeads = {
  component: ReactElement;
  value: string;
};

export type TableType = {
  selected: any[];
  onSelected: (e: React.MouseEvent, row: any) => void;
  isSelected: (data: any[]) => boolean;
  onSelectedAll: (e: React.ChangeEvent) => void;
  rowHeight: number;
  rows?: any[];
  colDefinitions: ColDefinitionsType[];
  primaryKey: string;
  openCheckBox?: boolean;
  disableSelect?: boolean;
  enableSelectAll?: boolean;
  rowDecorator?: (row: any) => SxProps<Theme> | React.CSSProperties;
  noData?: string;
  showHoverStyle?: boolean;
  isLoading?: boolean;
  headEditable?: boolean;
  editHeads: EditableHeads[];
  // with unit like '20px'
  tableCellMaxWidth?: string;
  handleSort?: (e: any, orderBy: string) => void;
  order?: SortDirection;
  orderBy?: string;
  ref?: Ref<HTMLDivElement>;
  // whether to add a spacer column to control space distribution
  addSpacerColumn?: boolean;
};

export type ColDefinitionsType = {
  id: string;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify' | undefined;
  disablePadding: boolean;
  label: React.ReactNode;
  needCopy?: boolean;
  showActionCell?: boolean;
  isHoverAction?: boolean;
  notSort?: boolean;
  // custom sort rule property, default is row id
  sortBy?: string;
  sortType?: 'string' | 'number';
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    data?: any
  ) => void;
  getStyle?: (data: any) => {};
  formatter?: (data: any, cellData?: any, cellIndex?: number) => any;
  headerFormatter?: (def: ColDefinitionsType) => React.ReactNode;
  onConnect?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    data: any
  ) => void;
  actionBarConfigs?: ActionBarConfig[];
};

export type AttuGridType = ToolBarType & {
  showPagination?: boolean;
  rowCount: number;
  rowsPerPage?: number;
  // used to dynamic set page size by table container and row height
  setRowsPerPage?: (size: number) => void;
  primaryKey: string;
  onPageChange?: (e: any, nextPageNum: number) => void;
  labelDisplayedRows?: (obj: LabelDisplayedRowsArgs) => React.ReactNode;
  page?: number;
  showToolbar?: boolean;
  rows: any[];
  colDefinitions: ColDefinitionsType[];
  isLoading?: boolean;
  title?: string[];
  openCheckBox?: boolean;
  disableSelect?: boolean;
  enableSelectAll?: boolean;
  noData?: string;
  showHoverStyle?: boolean;
  headEditable?: boolean;
  editHeads?: EditableHeads[];
  // with unit like '20px'
  tableCellMaxWidth?: string;
  handleSort?: (e: any, orderBy: string) => void;
  order?: SortDirection;
  orderBy?: string;
  tableHeaderHeight?: number;
  rowHeight?: number;
  hideOnDisable?: boolean;
  pagerHeight?: number;
  rowDecorator?: (row: any) => SxProps<Theme> | React.CSSProperties;
  sx?: SxProps<Theme>;
  // whether to add a spacer column to control space distribution
  addSpacerColumn?: boolean;
};

export type ActionBarType = {
  configs: ActionBarConfig[];
  row: any;
  isHoverType?: boolean;
};

type ActionBarConfig = {
  onClick: (e: React.MouseEvent, row: any) => void;
  icon?: IconsType;
  text?: string;
  showIconMethod?: 'iconType' | 'renderFn';
  renderIconFn?: (row: any) => ReactElement;
  label?: string;
  getLabel?: (row: any) => string;
  className?: string;
  disabled?: (row: any) => boolean;
};

export type TablePaginationActionsProps = {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
};
