import { observer } from '@formily/react';
import { StorePage, ListStore } from '@yimoko/store';
import React, { useEffect } from 'react';

import { Tabs, StoreTable } from '@/library';

const listStore = new ListStore({
  api: () => Promise.resolve({
    code: 0, data: {
      page: 1, pageSize: 10, total: 100, data: [
        { id: 1, name: 'name1', time: '1704380336' },
        { id: 2, name: 'name2', time: '1704380336' }],
    },
  }),
  defaultValues: { bool: true, name: 'name1,name2' },
  fieldsConfig: {
    name: { title: '名称', column: { width: 100, autoFilter: true } },
    time: { column: { width: 100, schema: { type: 'string', 'x-component': 'DateDisplay' } } },
    bool: {
      column: {
        width: 70,
        autoFilter: true,
        filters: [{ text: '是', value: true }, { text: '否', value: false }],
        filterMultiple: false,
      },
    },
  },
  isBindRouter: false,
});

export const StoreTableDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema" items={[
      { key: 'JSX', label: 'JSX 调用', children: <StoreTableJSX /> },
      { key: 'schema', label: 'Schema', children: <StoreTableSchema /> },
    ]} />
  </div>
);

const StoreTableJSX = observer(() => {
  useEffect(() => {
    listStore.runAPI();
  }, []);

  return (
    <StoreTable isBindValues={true} store={listStore} columns={['name', 'time']} />
  );
});

const StoreTableSchema = () => (
  <StorePage
    store={listStore}
    components={{ StoreTable }}
    schema={{
      type: 'object',
      properties: {
        table: {
          type: 'void',
          'x-component': 'StoreTable',
          'x-component-props': {
            columns: ['name', 'time', 'bool'],
          },
        },
      },
    }}
  />
);
