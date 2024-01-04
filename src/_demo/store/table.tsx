import { observer } from '@formily/react';
import { JSONStringify, useListStore, StorePage, ListStore } from '@yimoko/store';
import React, { useEffect } from 'react';

import { Tabs, StoreTable } from '@/library';

const ColTest = (props: any) => {
  console.log('Col', props);
  return <div>Col</div>;
};

const listStore = new ListStore({
  api: () => Promise.resolve({
    code: 0, data: {
      page: 1, pageSize: 10, total: 100, data: [
        { id: 1, name: 'name1', time: '' },
        { id: 2, name: 'name2', time: '' }],
    },
  }),
  defaultValues: {},
  fieldsConfig: {
    name: { title: '名称', column: { width: 100, autoFilter: true } },
    time: { column: { width: 100, schema: { type: 'string', 'x-component': 'ColTest', 'x-component-props': { children: 'xxx' } } } },
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
    components={{ StoreTable, ColTest }}
    schema={{
      type: 'object',
      properties: {
        table: {
          type: 'void',
          'x-component': 'StoreTable',
          'x-component-props': {
            columns: ['name', 'time'],
          },
        },
      },
    }}
  />
);
