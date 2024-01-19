import { observer } from '@formily/react';
import { StorePage, useStore } from '@yimoko/store';
import React from 'react';

import { Tabs, HtmlEditor } from '@/library';

export const HtmlEditorDemo = () => (
  <div>
    <Tabs defaultActiveKey="JSX" items={[
      { key: 'JSX', label: 'JSX 调用', children: <HtmlEditorJSX /> },
      { key: 'schema', label: 'Schema', children: <HtmlEditorSchema /> },
    ]} />
  </div>
);

const HtmlEditorJSX = observer(() => {
  const store = useStore({ defaultValues: { v: '' } });
  const ref = React.useRef<any>();

  return <>
    <HtmlEditor
      ref={ref}
      value={store.values.v}
      onChange={(v) => {
        store.setValues({ v });
        console.log('ref', ref.current);
      }}
    />
  </>;
});

const HtmlEditorSchema = () => (
  <StorePage
    store={{ defaultValues: { c: true, group: [], v: '' } }}
    components={{ HtmlEditor }}
    schema={{
      type: 'object',
      properties: {
        v: {
          type: 'object',
          'x-component': 'HtmlEditor',
        },
      },
    }}
  />
);
