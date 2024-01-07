import { observer } from '@formily/react';
import { StorePage, useStore } from '@yimoko/store';
import React, { useRef } from 'react';

import { Tabs, Tree } from '@/library';

const treeData: any[] = [
  { title: 'xxx', key: 'xxx', children: [{ title: 'c1', key: 'c1' }, { title: 'c2', key: 'c2' }] },
  { title: 'yyy', key: 'yyy', children: [{ title: 'c3', key: 'c3' }, { title: 'c4', key: 'c4' }] },
];

export const TreeDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema" items={[
      { key: 'JSX', label: 'JSX 调用', children: <TreeJSX /> },
      { key: 'schema', label: 'Schema', children: <TreeSchema /> },
    ]} />
  </div>
);

const TreeJSX = observer(() => {
  const ref = useRef<any>();
  return <Tree ref={ref} isValueHasParent treeData={treeData} onChange={() => console.log(ref)} />;
});

const TreeSchema = observer(() => {
  const store = useStore({ defaultValues: { v: ['c1'] } });
  console.log('v = ', store.values.v);

  return (
    <StorePage
      store={store}
      components={{ Tree }}
      schema={{
        type: 'object',
        properties: {
          v: {
            type: 'string',
            'x-component': 'Tree',
            enum: treeData,
            'x-component-props': {},
          },
        },
      }}
    />
  );
});
