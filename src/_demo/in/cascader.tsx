import { observer } from '@formily/react';
import { StorePage, useStore } from '@yimoko/store';
import { Cascader as AntCascader } from 'antd';
import { useRef } from 'react';

import { Tabs, Cascader } from '@/library';


export const CascaderDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema" items={[
      { key: 'JSX', label: 'JSX 调用', children: <CascaderJSX /> },
      { key: 'schema', label: 'Schema', children: <CascaderSchema /> },
    ]} />
  </div>
);

const CascaderJSX = observer(() => {
  const store = useStore({ defaultValues: { c: '1' } });
  console.log(store);

  const ref = useRef(null);

  return <>
    <Cascader ref={ref} onClick={() => console.log(ref)} />
    <AntCascader ref={ref} onClick={() => console.log(ref)} />
  </>;
});

const CascaderSchema = () => (
  <StorePage
    store={{ defaultValues: { c: true, group: [] } }}
    components={{ Cascader }}
    schema={{
      type: 'object',

    }}
  />
);
