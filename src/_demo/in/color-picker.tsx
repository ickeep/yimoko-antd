import { observer } from '@formily/react';
import { StorePage, useStore } from '@yimoko/store';
import { ColorPicker as AntColorPicker } from 'antd';

import React from 'react';

import { Tabs, ColorPicker } from '@/library';


export const ColorPickerDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema" items={[
      { key: 'JSX', label: 'JSX 调用', children: <ColorPickerJSX /> },
      { key: 'schema', label: 'Schema', children: <ColorPickerSchema /> },
    ]} />
  </div>
);

const ColorPickerJSX = observer(() => {
  const store = useStore({ defaultValues: { c: '#C62A2A' } });
  const { setValues, values: { c } } = store;
  console.log('c', c);

  return <>
    <ColorPicker value={c} onChange={(str, color) => {
      console.log(color);
      setValues({ c: str });
    }} />
    <AntColorPicker />
  </>;
});

const ColorPickerSchema = () => (
  <StorePage
    store={{ defaultValues: { c: true, group: [] } }}
    components={{ ColorPicker }}
    schema={{
      type: 'object',

    }}
  />
);
