import { observer } from '@formily/react';
import { StorePage, BaseStore } from '@yimoko/store';
import React from 'react';

import { Tabs, StoreDesc } from '@/library';

const baseStore = new BaseStore({
  api: () => Promise.resolve({
    code: 0, data: {
      page: 1, pageSize: 10, total: 100, data: [
        { id: 1, name: 'name1', time: '1704380336' },
        { id: 2, name: 'name2', time: '1704380336' }],
    },
  }),
  defaultValues: { id: 1, name: 'name1', time: '1704380336' },

  fieldsConfig: {
    name: { title: '名称', tooltip: '名称', desc: { width: 100, autoFilter: true } },
    time: { title: '时间', desc: { tooltip: '时间', width: 100, schema: { type: 'string', 'x-component': 'DateDisplay' } } },
  },
  isBindRouter: false,
});

export const StoreDescDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema" items={[
      { key: 'JSX', label: 'JSX 调用', children: <StoreDescJSX /> },
      { key: 'schema', label: 'Schema', children: <StoreDescSchema /> },
    ]} />
  </div>
);

const StoreDescJSX = observer(() => (
  <StoreDesc store={baseStore} column={1} items={['name', 'time']} />
));

const StoreDescSchema = () => (
  <StorePage
    store={baseStore}
    schema={{
      type: 'object',
      properties: {
        desc: {
          type: 'void',
          'x-component': 'StoreDesc',
          'x-component-props': {
            items: ['name', 'time'],
          },
        },
      },
    }}
  />
);
