import { observer } from '@formily/react';
import { StorePage, useStore } from '@yimoko/store';

import React from 'react';

import { Tabs, Breadcrumb } from '@/library';


export const BreadcrumbDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema" items={[
      { key: 'JSX', label: 'JSX 调用', children: <BreadcrumbJSX /> },
      { key: 'schema', label: 'Schema', children: <BreadcrumbSchema /> },
    ]} />
  </div>
);

const BreadcrumbJSX = observer(() => {
  const store = useStore({ defaultValues: { c: '1' } });
  console.log('store', store);
  return <>
    <Breadcrumb />

  </>;
});

const BreadcrumbSchema = () => (
  <StorePage
    store={{ defaultValues: { c: true, group: [] } }}
    components={{ Breadcrumb }}
    schema={{
      type: 'object',
      properties: {
      },
    }}
  />
);
