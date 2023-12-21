import { observer } from '@formily/react';
import { StorePage, useStore } from '@yimoko/store';

import React, { useRef } from 'react';

import { Tabs, Menu } from '@/library';


export const MenuDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema" items={[
      { key: 'JSX', label: 'JSX 调用', children: <MenuJSX /> },
      { key: 'schema', label: 'Schema', children: <MenuSchema /> },
    ]} />
  </div>
);

const MenuJSX = observer(() => {
  const store = useStore({ defaultValues: { c: '1' } });
  console.log('store', store);
  const ref = useRef(null);
  return <>
    <Menu ref={ref} >
      <Menu.Item key="1">1</Menu.Item>
      <Menu.Item key="2">2</Menu.Item>
      <Menu.Divider />
    </Menu>

  </>;
});

const MenuSchema = () => (
  <StorePage
    store={{ defaultValues: { c: true, group: [] } }}
    components={{ Menu }}
    schema={{
      type: 'object',
      properties: {
      },
    }}
  />
);
