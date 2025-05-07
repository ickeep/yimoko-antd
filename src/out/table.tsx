import { createForm } from '@formily/core';
import { RecordScope, RecordsScope, Schema, observer, useField, useFieldSchema } from '@formily/react';
import { ArrayBase, SchemaBox, getItemPropsBySchema, judgeIsEmpty, useChildrenNullishCoalescing, useSchemaField } from '@yimoko/store';
import { Table as AntTable, TableProps as AntTableProps } from 'antd';
import { ColumnType as AntColumnType } from 'antd/lib/table';
import React, { FC, useEffect, useMemo } from 'react';

export type TableProps<T = any> = Omit<AntTableProps<T>, 'onChange' | 'columns'> & {
  value?: AntTableProps<T>['dataSource'],
  defaultColumnsWidth?: number
  onTableChange?: AntTableProps<T>['onChange']
  isSchemaToColumns?: boolean
  columns?: ColumnsType<T>
};

export const Table: <T = any>(props: TableProps<T>) => ReturnType<FC> = observer((props) => {
  const { columns = [], dataSource, scroll, defaultColumnsWidth, rowKey, value, children, onTableChange, isSchemaToColumns = true, ...rest } = props;
  const field = useField();
  const fieldSchema = useFieldSchema();
  const { items } = fieldSchema ?? {};
  const curDataSource = (dataSource ?? value) as any[];
  const curChildren = useChildrenNullishCoalescing(children);
  const SchemaField = useSchemaField();

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
    // 处理 schema 的函数
    const handleSchema = (col: ColumnsType<any>[0]) => {
      const { schema, ...rest } = col;
      const newCol = { ...rest };
      if ('children' in newCol) {
        newCol.children = newCol.children.map(handleSchema);
      } else if ('dataIndex' in col && fieldSchema && schema && !col.render) {
        newCol.render = (v: any, r: any) => {
          console.log('rowKey ?? ');

          return <ColRender getRecordIndex={getRecordIndex} col={col} r={r} v={v} />;

          // const i = getRecordIndex(r);
          // const key = dataIndexToKey(col.dataIndex);
          // return (
          //   <RecordScope getRecord={() => r ?? {}} getIndex={() => i}>
          //     {/* @ts-ignore */}
          //     <SchemaBox model={createForm({ values: { ...r, [key]: v } })} >
          //       <SchemaField schema={{ type: 'object', properties: { [key]: schema } }} />
          //     </SchemaBox>
          //   </RecordScope>
          // );
        };
      }
      return newCol;
    };
    const newColumns = columns.map(handleSchema);
    if (!judgeIsEmpty(items) && isSchemaToColumns) {
      const itemArr = Array.isArray(items) ? items : [items];
      itemArr.forEach((item) => {
        newColumns.push(...schemaToColumns(item, getRecordIndex));
      });
    }

    return newColumns;
  }, [SchemaField, columns, fieldSchema, getRecordIndex, isSchemaToColumns, items]);

  const curScroll = useTableScroll(scroll, curColumns, defaultColumnsWidth);

  useEffect(() => {
    console.log('getRecordIndex');
  }, [getRecordIndex]);


  return (
    <RecordsScope getRecords={() => curDataSource}>
      <ArrayBase disabled={field?.disabled} isForceUpdate={true}  >
        <AntTable<any>
          size='small'
          {...rest}
          dataSource={curDataSource}
          columns={curColumns}
          scroll={curScroll}
          rowKey={rowKey ?? getRecordIndex}
          onChange={onTableChange} />
        {curChildren}
      </ArrayBase>
    </RecordsScope>);
}, { forwardRef: true });


// isDecoratorColumn 判断是否是 列，如果是则添加 children，默认第一层不判断，统一是 列
export const schemaToColumns = (schema: Schema, getRecordIndex: any, isDecoratorColumn = false) => {
  const columns: TableProps<any>['columns'] = [];
  schema.reduceProperties((columns, item) => {
    if (isDecoratorColumn && item['x-decorator'] !== 'Column') {
      return columns;
    }
    const baseProps: typeof columns[number] = {
      dataIndex: item.name,
      title: item.title,
      ...getItemPropsBySchema(item, 'Column'),
    };

    if (!judgeIsEmpty(item['x-component'])) {
      baseProps.render = (v: any, r: any) => {
        console.log('rowKey ?? ');

        const dataIndex = getRecordIndex(r);
        const { children } = getItemPropsBySchema(item, 'Column', dataIndex);
        return (
          <RecordScope getRecord={() => r ?? {}} getIndex={() => dataIndex}>
            {children}
          </RecordScope>
        );
      };
    }
    // 判断是否有子节点 是否是 Column 如果是则添加 children
    if (!judgeIsEmpty(item.properties)) {
      const children = schemaToColumns(item, getRecordIndex, true);
      if (!judgeIsEmpty(children)) {
        // @ts-ignore
        baseProps.children = schemaToColumns(item, getRecordIndex);
      }
    }
    columns.push(baseProps);
    return columns;
  }, columns);

  return columns;
};

const useTableScroll = (scroll: TableProps<any>['scroll'], columns: TableProps<any>['columns'], defaultColumnsWidth = 120) => useMemo(() => {
  if (scroll?.x) {
    return scroll;
  }
  let width = 0;
  columns?.forEach(col => width += (Number(col.width ?? defaultColumnsWidth)));
  return {
    ...scroll,
    x: width,
  };
}, [columns, defaultColumnsWidth, scroll]);


type ColumnType<RecordType> = AntColumnType<RecordType> & { schema?: Schema };
export interface ColumnGroupType<RecordType> extends Omit<ColumnType<RecordType>, 'dataIndex'> {
  children: ColumnsType<RecordType>;
}
export type ColumnsType<RecordType = unknown> = (ColumnGroupType<RecordType> | ColumnType<RecordType>)[];


export const dataIndexToKey = (dataIndex?: DataIndex) => (Array.isArray(dataIndex) ? dataIndex.join('.') : dataIndex) as string | number;

export type DataIndex = string | number | readonly (string | number)[];

// 表格 Col render 两种方式
// 1. 新建 SchemaBox 传入 model 消耗大，但可以在 jsx 中使用，并且不需要在表格外包一层 RedirectListData
// 2. 直接 <RecursionField schema={curSchema} name={getRecordIndex(r)} onlyRenderProperties /> 消耗小，但只能在 schema 中使用 并且需要 表格的数据源在 model 的 value 中

const ColRender = (props: any) => {
  const { getRecordIndex, col, r, v } = props;
  const SchemaField = useSchemaField();

  const EL = useMemo(() => {
    console.log('ColRender');
    const i = getRecordIndex(r);
    const key = `[${i}].${dataIndexToKey(col.dataIndex)}`;

    return (
      <RecordScope getRecord={() => r ?? {}} getIndex={() => i}>
        {/* @ts-ignore */}
        <SchemaField schema={{ type: 'object', properties: { [key]: col.schema } }} />
      </RecordScope>
    );
  }, [SchemaField, col, getRecordIndex, r]);

  return EL;
};
