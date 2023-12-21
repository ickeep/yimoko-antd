import { observer } from '@formily/react';
import { StorePage, useStore } from '@yimoko/store';
import { Checkbox as AntCheckbox } from 'antd';
import React, { useRef } from 'react';

import { Tabs, Checkbox } from '@/library';

const { Group } = AntCheckbox;

export const CheckboxDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema" items={[
      { key: 'JSX', label: 'JSX 调用', children: <CheckboxJSX /> },
      { key: 'schema', label: 'Schema', children: <CheckboxSchema /> },
    ]} />
  </div>
);

const CheckboxJSX = observer(() => {
  const store = useStore({ defaultValues: { c: '1' } });
  const { values, setValues } = store;
  const { c } = values;
  const ref = useRef(null);
  const gRef = useRef(null);

  return <>
    <Checkbox ref={ref} onClick={() => console.log(ref)}>复选框</Checkbox>
    <Checkbox value={c} values={{ true: '1', false: '0' }} onChange={v => setValues({ c: v })} >受控</Checkbox>
    <AntCheckbox.Group ref={gRef} />
    <Group ref={gRef} />
    <Checkbox.Group ref={gRef} options={[{ label: '选项1', value: '1' }, { label: '选项2', value: '2' }]}
      onChange={() => console.log(gRef)} />
  </>;
});

const CheckboxSchema = () => (
  <StorePage
    store={{ defaultValues: { c: true, group: [] } }}
    components={{ Checkbox }}
    schema={{
      type: 'object',
      properties: {
        // 非受控
        a: {
          type: 'void',
          'x-component': 'Checkbox',
          'x-component-props': {
            children: '复选框',
          },
        },
        c: {
          'x-component': 'Checkbox',
          'x-component-props': {
            children: '受控',
          },
        },
        // 群组
        group: {
          type: 'array',
          'x-component': 'Checkbox.Group',
          'x-component-props': {
            options: [
              { label: '选项1', value: '1' },
              { label: '选项2', value: '2' },
            ],
          },
        },
      },
    }}
  />
);
