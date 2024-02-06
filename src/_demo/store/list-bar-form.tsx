import { observer } from '@formily/react';
import { StorePage, ListStore } from '@yimoko/store';
import React, { useEffect } from 'react';

import { Tabs, ListBarForm } from '@/library';

const listStore = new ListStore({
  api: (data) => {
    console.log('api data', data);
    return Promise.resolve({
      code: 0, data: {
        page: 1, pageSize: 10, total: 100, data: [
          { id: 1, name: 'name1', time: '1704380336' },
          { id: 2, name: 'name2', time: '1704380336' }],
      },
    });
  },
  defaultValues: { bool: true, name: 'name1,name2', start: '', end: '' },
  fieldsConfig: {
    name: { title: '名称', column: { width: 100, autoFilter: true } },
    time: { column: { width: 100, schema: { type: 'string', 'x-component': 'DateDisplay' } } },
    start: { type: 'number' },
    end: { type: 'number' },
    bool: {
      column: {
        width: 70,
        autoFilter: true,
        filters: [{ text: '是', value: true }, { text: '否', value: false }],
        filterMultiple: false,
      },
    },
  },
  isBindRouter: true,
});

export const ListBarFormDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema" items={[
      { key: 'JSX', label: 'JSX 调用', children: <ListBarFormJSX /> },
      { key: 'schema', label: 'Schema', children: <ListBarFormSchema /> },
    ]} />
  </div>
);

const ListBarFormJSX = observer(() => {
  useEffect(() => {
    listStore.runAPI();
  }, []);

  return (
    <ListBarForm />
  );
});

const ListBarFormSchema = () => (
  <StorePage
    store={listStore}
    components={{ ListBarForm }}
    schema={{
      type: 'object',
      properties: {
        table: {
          type: 'void',
          'x-component': 'ListBarForm',
          properties: {
            '[start, end]': {
              type: 'range',
              title: '时间',
              'x-decorator': 'FormItem',
              'x-component': 'DatePicker.RangePicker',
              'x-component-props': {
                dataValueType: 'second',
                showTime: true,
              },
            },
          },
        },
      },
    }}
  />
);
