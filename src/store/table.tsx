import { ISchema, observer, useFieldSchema } from '@formily/react';
import { define, observable } from '@formily/reactive';
import { IFieldConfig, IFieldsConfig, ListStore, dataToOptions, getFieldSplitter, getFieldType, judgeIsEmpty, toNumber, useCurStore, useListData } from '@yimoko/store';
import { TablePaginationConfig } from 'antd';
import { FilterValue, SorterResult, TableCurrentDataSource } from 'antd/es/table/interface';
import { ColumnType } from 'antd/lib/table';
import { ColumnFilterItem } from 'antd/lib/table/interface';
import dayjs from 'dayjs';
import { get } from 'lodash-es';
import React, { FC, Key, ReactNode, isValidElement, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { DataIndex, Table, TableProps, dataIndexToKey, schemaToColumns } from '../out/table';
import { Tooltip, TooltipProps } from '../out/tooltip';

export type StoreTableProps<T = any> = Omit<TableProps<T>, 'loading' | 'value' | 'dataSource' | 'columns'> & {
  // 表格的筛选、排序、页码等参数与 store 的 values 绑定
  isBindValues?: boolean;
  columns?: Array<string | IColumn>
  store?: ListStore<any, any>
  tipIcon?: TooltipProps['icon']
  onPage?: (pagination: TablePaginationConfig) => void | Promise<void>;
  onSort?: (sort: SorterResult<T> | SorterResult<T>[]) => void | Promise<void>;
  onFilter?: (filter: Record<string, FilterValue | null>) => void | Promise<void>;
};

export const StoreTable: <T = any>(props: StoreTableProps<T>) => ReturnType<FC> = observer((props) => {
  const { isBindValues = true, store, columns = [], pagination, rowSelection, onPage, onSort, onFilter, tipIcon, ...rest } = props;
  const schema = useFieldSchema();
  const { items } = schema ?? {};
  const curStore = useCurStore(store) as ListStore<any, any>;
  const dataSource = useListData(store);
  const location = useLocation();
  const nav = useNavigate();
  const {
    setValues, setValuesByField, runAPI, setSelectedRowKeys, getURLSearch,
    selectedRowKeys, isBindRouter, queryRoutingType,
    response: { data } = {},
    keysConfig: { total, page, pageSize, sortOrder } = {},
  } = (curStore ?? {}) as ListStore<any, any>;

  const curRowSelection = useMemo(() => (rowSelection
    ? {
      selectedRowKeys,
      ...rowSelection,
      onChange: (keys: Key[], selectedRows: any[], info: any) => {
        rowSelection?.onChange?.(keys, selectedRows, info);
        setSelectedRowKeys?.(keys);
      },
    }
    : rowSelection
  ), [rowSelection, selectedRowKeys, setSelectedRowKeys]);

  const curPagination = useMemo(() => {
    if (pagination === false) {
      return pagination;
    }
    const newPagination = { ...DF_PAGINATION, ...pagination };
    if (isBindValues) {
      newPagination.pageSize = data?.[pageSize];
      newPagination.current = data?.[page];
      newPagination.total = data?.[total];
    }
    return newPagination;
  }, [data, isBindValues, page, pageSize, pagination, total]);

  // 解决默认 rowKey 各 低代码时取 实际数据 index 的问题
  const getRecordIndex = useMemo(() => {
    // 利用闭包 按需生成
    let recordIndexMap: Map<any, number>;
    return (record: any) => {
      if (!recordIndexMap) {
        recordIndexMap = new Map();
        dataSource?.forEach((item: any, index: any) => {
          recordIndexMap.set(item, index);
        });
      }
      return recordIndexMap.get(record) ?? 0;
    };
  }, [dataSource]);

  const curColumns = useMemo(() => {
    const newColumns = [...columns];
    if (!judgeIsEmpty(items)) {
      const itemArr = Array.isArray(items) ? items : [items];
      itemArr.forEach((item) => {
        newColumns.push(...schemaToColumns(item, getRecordIndex));
      });
    }
    const cStore = new ColumnsStore(curStore, newColumns, isBindValues, schema, tipIcon);
    return cStore.columns;
  }, [columns, curStore, getRecordIndex, isBindValues, items, schema, tipIcon]);

  const queryData = () => {
    runAPI();
    setSelectedRowKeys?.();
    if (isBindRouter) {
      const { pathname, search } = location;
      const valSearch = getURLSearch();
      search !== `?${valSearch}` && nav(`${pathname}?${valSearch}`, { replace: queryRoutingType === 'replace' });
    }
  };

  const handlePagination = (pagination: TablePaginationConfig, extra: TableCurrentDataSource<any>) => {
    if (extra.action === 'paginate') {
      onPage?.(pagination);
      if (isBindValues) {
        setValuesByField(page, pagination.current);
        setValuesByField(pageSize, pagination.pageSize);
        queryData();
      }
    }
  };

  const handleFilters = (filters: Record<string, FilterValue | null>, extra: TableCurrentDataSource<any>) => {
    if (extra.action === 'filter') {
      onFilter?.(filters);
      if (isBindValues) {
        const newValues: Record<any, any> = { [page]: 1 };
        Object.entries(filters).forEach(([key, value]) => {
          const val = value === null ? [] : value;
          const col = curColumns.find(item => item.dataIndex === key);
          if (col?.filterMultiple === false) {
            newValues[key] = val?.[0];
          } else {
            const type = getFieldType(key, curStore) ?? 'string';
            const splitter = getFieldSplitter(key, curStore);
            newValues[key] = type === 'string' ? val.join(splitter) : val;
          }
        });
        setValues(newValues);
        queryData();
      }
    }
  };

  const handleSorter = (sorter: SorterResult<any> | SorterResult<any>[], extra: TableCurrentDataSource<any>) => {
    if (extra.action === 'sort') {
      onSort?.(sorter);
      if (isBindValues) {
        const val: ISortOrder[] = [];
        (Array.isArray(sorter) ? sorter : [sorter]).forEach((item) => {
          const { field, order } = item;
          const key = `${field}`;
          typeof order === 'string' && val.push({ field: key, order });
        });
        setValuesByField(page, 1);
        setValuesByField(sortOrder, val);
        queryData();
      }
    }
  };

  return (
    <Table
      {...rest}
      // 避免重复将 schema 转换为 columns
      isSchemaToColumns={false}
      columns={curColumns}
      rowSelection={curRowSelection}
      loading={curStore?.loading}
      dataSource={dataSource}
      pagination={curPagination}
      onTableChange={(pagination, filters, sorter, extra) => {
        handlePagination(pagination, extra);
        handleFilters(filters, extra);
        handleSorter(sorter, extra);
      }}
    />
  );
});

class ColumnsStore {
  fieldSchema?: ISchema;
  tipIcon?: TooltipProps['icon'];
  store?: ListStore<any, any>;
  columnsConfig: Array<string | IColumn<any>> = [];
  isBindValues = true;
  constructor(store: ListStore<any, any>, columnsConfig: Array<any>, isBindValues: boolean, fieldSchema?: ISchema, icon?: TooltipProps['icon']) {
    this.store = store;
    this.fieldSchema = fieldSchema;
    this.columnsConfig = columnsConfig;
    this.isBindValues = isBindValues;
    this.tipIcon = icon;

    define(this, {
      mergeColumns: observable.computed,
      filterConfigs: observable.computed,
      filtersMap: observable.computed,
      columns: observable.computed,
    });
  }

  // 实现根据依赖更新
  get mergeColumns() {
    return mergeColumnsConfig(this.columnsConfig, this.store?.fieldsConfig, this.fieldSchema, this.tipIcon);
  }

  get filterConfigs() {
    const arr: IAutoFilterConfig[] = [];
    const handle = (column: IColumn) => {
      if (typeof column === 'object') {
        if ('dataIndex' in column) {
          const { dataIndex = '', autoFilter, isFilterContains, filterSplitter } = column;
          if (judgeIsAutoFilter(column) && judgeIsEmpty(get(this.store?.dict, dataIndexToKey(dataIndex)))) {
            arr.push({ dataIndex, autoFilter, isFilterContains, filterSplitter });
          }
        } else if ('children' in column) {
          column.children?.forEach((item: IColumn) => handle(item));
        }
      }
    };
    this.mergeColumns.forEach((item => handle(item)));
    return arr;
  }

  get filtersMap() {
    const obj: Record<string, ColumnFilterItem[]> = {};
    const hash: Record<string, Record<string, boolean>> = {};
    if (judgeIsEmpty(this.filterConfigs)) {
      return obj;
    }
    this.filterConfigs?.forEach((field) => {
      const key = dataIndexToKey(field.dataIndex);
      obj[key] = [];
      hash[key] = {};
    });

    this.store?.listData?.forEach((item) => {
      this.filterConfigs.forEach((field) => {
        const { dataIndex, isFilterContains, filterSplitter = ',' } = field;
        const key = dataIndexToKey(dataIndex);
        const val = get(item, key);
        if (!judgeIsEmpty(val)) {
          if (isFilterContains) {
            let arr: any[];
            if (typeof val === 'string') {
              arr = val.split(filterSplitter);
            } else {
              arr = Array.isArray(val) ? val : [];
            }
            arr.forEach((v) => {
              if (!hash[key][v]) {
                hash[key][v] = true;
                obj[key].push({ text: v, value: v });
              }
            });
          } else if (!hash[key][val]) {
            obj[key].push({ text: val, value: val });
            hash[key][val] = true;
          }
        }
      });
    });
    return obj;
  }

  get columns() {
    if (!this.store) {
      return this.mergeColumns;
    }
    const { store } = this;

    const autoColumns = (item: IColumn<any>): Required<TableProps>['columns'][0] => {
      const { isFilterContains, autoFilter, autoSorter, filterKeys, ...rest } = item;
      const col = { ...rest };
      const filterProps = getFilterProps(item, store, this.filtersMap, this.isBindValues);
      const sortProps = getSortProps(item, store, this.isBindValues);
      if ('children' in col) {
        col.children = col.children?.map?.(autoColumns);
      }
      return { ...col, ...filterProps, ...sortProps };
    };

    return this.mergeColumns.map(autoColumns);
  }
}

const getTitle = (field: string | number = '', column: IColumn<any> = {}, fieldsConfig?: IFieldsConfig, icon?: TooltipProps['icon']): any => {
  const { title, tooltip } = column;
  const fieldConfig = fieldsConfig?.[`${field}`] as IFieldsConfig | undefined;
  const curTitle = title ?? fieldConfig?.title ?? field;
  let tooltipProps: TooltipProps = {};

  [fieldConfig?.tooltip, fieldConfig?.column?.tooltip, tooltip].forEach((item) => {
    if (!judgeIsEmpty(item)) {
      if ((isValidElement(item) || typeof item !== 'object')) {
        tooltipProps.title = item;
      } else {
        tooltipProps = { ...tooltipProps, ...item };
      }
    }
  });

  if (judgeIsEmpty(tooltipProps)) {
    return curTitle;
  }

  judgeIsEmpty(tooltipProps.icon) && (tooltipProps.icon = icon);

  return <>{curTitle} <Tooltip  {...tooltipProps} /></>;
};


const mergeColumnsConfig = (columns: Array<string | IColumn<any>>, fieldsConfig?: IFieldsConfig, fieldSchema?: ISchema, tipIcon?: TooltipProps['icon']) => {
  // eslint-disable-next-line complexity
  const handleItem = (item: string | IColumn<any>) => {
    let newItem: IColumn<any> = {};
    if (typeof item === 'string') {
      if (fieldsConfig?.[item]?.column) {
        newItem = { ...fieldsConfig?.[item]?.column, dataIndex: item };
      } else {
        newItem = { dataIndex: item };
      }
    } else if (typeof item === 'object') {
      if ('dataIndex' in item) {
        const { dataIndex } = item;
        if (dataIndex) {
          newItem = { ...fieldsConfig?.[dataIndexToKey(dataIndex)]?.column, ...item };
        }
      }
      if ('children' in item) {
        newItem.children = item.children?.map(handleItem);
      }
    }
    const title = getTitle(newItem.dataIndex, newItem, fieldsConfig, tipIcon);
    return { ...newItem, title };
  };
  return columns.map(handleItem);
};

// eslint-disable-next-line complexity
const getFilterProps = (col: IColumnType<any>, store: ListStore<any, any>, filtersMap: Record<string, ColumnFilterItem[]>, isBindValues: boolean) => {
  const props: ColumnType<any> = {};
  const { dataIndex, isFilterContains, filterSplitter = ',', filterKeys } = col;
  if (col.autoFilter && isBindValues) {
    const field = dataIndexToKey(dataIndex);
    props.filteredValue = getFilteredValue(field, store);
  }
  if (dataIndex && judgeIsAutoFilter(col)) {
    const key = dataIndexToKey(dataIndex);
    const dictFilters = dataToOptions(get(store?.dict, key), { text: 'label', value: 'value', ...filterKeys }, filterSplitter);
    const filters = (!judgeIsEmpty(dictFilters) ? dictFilters : filtersMap[key]) as ColumnFilterItem[];
    if (!judgeIsEmpty(filters)) {
      props.filters = filters;
      typeof props.filteredValue === 'undefined' && (props.onFilter = (value: any, record: any) => {
        const val = get(record, key);
        if (isFilterContains) {
          if (typeof val === 'string') {
            return val.split(filterSplitter).includes(value);
          }
          return Array.isArray(val) && val.includes(value);
        }
        return val === value;
      });
    }
  }
  return props;
};

const getFilteredValue = (field: string | number, store: ListStore<any, any>) => {
  const { values } = store;
  const val = get(values, field);
  if (Array.isArray(val)) {
    return val;
  } if (typeof val === 'string' && val) {
    return val.split(getFieldSplitter(field, store));
  }
  if (judgeIsEmpty(val)) {
    return null;
  }
  return [val];
};

const getSortProps = (col: ColumnType<any>, store: ListStore<any, any>, isBindValues: boolean) => {
  const { values, keysConfig } = store;
  const { dataIndex } = col;
  const sorter = getAutoSorter(col);
  if (sorter && isBindValues) {
    const val = values?.[keysConfig?.sortOrder]?.find?.((item: ISortOrder) => item.field === `${dataIndex}`);
    return { sortOrder: val?.order };
  }
  return { sorter };
};

const getAutoSorter = (column: IColumnType<any>) => {
  const { dataIndex, sorter, autoSorter, sorterParams } = column;
  if (sorter) {
    return sorter;
  }
  if (!autoSorter) {
    return undefined;
  }

  const fnMap: Record<any, (a: any, b: any) => number> = {
    number: (a, b) => toNumber(a, sorterParams) - toNumber(b, sorterParams),
    string: (a, b) => (sorterParams ? a?.localeCompare(b, ...(Array.isArray(sorterParams) ? sorterParams : [sorterParams])) : a?.localeCompare(b)),
    percentage: (a, b) => Number(a.replace('%', '')) - Number(b.replace('%', '')),
    date: (a, b) => (dayjs(a).isBefore(b) ? -1 : 1),
    time: (a, b) => (dayjs(`2022-01-01 ${a}`).isBefore(`2022-01-01 ${b}`) ? -1 : 1),
    length: (a, b) => a?.length - b?.length,
  };
  return (a: any, b: any) => {
    const valA = get(a, dataIndexToKey(dataIndex));
    const valB = get(b, dataIndexToKey(dataIndex));
    return fnMap[autoSorter]?.(valA, valB);
  };
};

export const judgeIsAutoFilter = (column: IColumnType<any>) => {
  const { autoFilter, onFilter, filters } = column;
  return autoFilter && !onFilter && !filters;
};

export type IDfPagination = Required<Pick<TablePaginationConfig, 'defaultPageSize' | 'size' | 'showQuickJumper' | 'showSizeChanger' | 'showTotal'>>;

export const DF_PAGINATION: IDfPagination = {
  defaultPageSize: 20,
  size: 'small',
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal: (total, range) => `第${range[0]}-${range[1]}条/共${total}条`,
};

export interface ISortOrder {
  field: string,
  order: 'ascend' | 'descend' | false
}

export type IColumnType<T extends object = Record<any, any>> = ColumnType<T> & IFieldConfig<T>['column'];
export interface IColumnGroupType<T extends object = Record<any, any>> extends Omit<ColumnType<T>, 'dataIndex'> {
  children: IColumns<T>;
}

export type IColumn<T extends object = Record<any, any>> = (IColumnType<T> | IColumnGroupType<T>) & { tooltip?: ReactNode | TooltipProps };

export type IColumns<T extends object = Record<any, any>> = IColumn<T>[];

export type IAutoFilterConfig = Pick<IColumnType, 'isFilterContains' | 'filterSplitter' | 'autoFilter'> & { 'dataIndex': DataIndex };

