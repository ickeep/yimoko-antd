import { observer } from '@formily/react';
import { StorePage, useStore } from '@yimoko/store';
import React from 'react';

import { Tabs, JSONEditor } from '@/library';

export const JSONEditorDemo = () => (
  <div>
    <Tabs defaultActiveKey="JSX" items={[
      { key: 'JSX', label: 'JSX 调用', children: <JSONEditorJSX /> },
      { key: 'schema', label: 'Schema', children: <JSONEditorSchema /> },
    ]} />
  </div>
);

const JSONEditorJSX = observer(() => {
  const store = useStore({ defaultValues: { c: '1', obj: JSON.stringify({ a: 'a' }) } });
  console.log(store.values.obj);
  const ref = React.useRef<any>();

  return <>
    <JSONEditor ref={ref} value={store.values.obj}
      onChange={v => store.setValues({ obj: v })}
    // onChange={() => console.log(ref.current?.editor?.getText())}
    />
  </>;
});

const JSONEditorSchema = () => (
  <StorePage
    store={{ defaultValues: { c: true, group: [], obj: { a: 'a' }, readOnly: { a: 'a' } } }}
    components={{ JSONEditor }}
    schema={{
      type: 'object',
      properties: {
        obj: {
          type: 'object',
          'x-component': 'JSONEditor',
        },
        readOnly: {
          type: 'object',
          'x-component': 'JSONEditor',
          'x-component-props': {
            readOnly: true,
          },
        },
      },
    }}
  />
);
