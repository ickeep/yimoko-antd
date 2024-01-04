import { observer } from '@formily/react';
import { StorePage, useStore } from '@yimoko/store';
import { Form as AntForm, Input } from 'antd';
import { useRef } from 'react';

import { Tabs } from '@/library';

export const FormDemo = () => (
  <div>
    <Tabs defaultActiveKey="JSX" items={[
      { key: 'JSX', label: 'JSX 调用', children: <FormJSX /> },
      { key: 'schema', label: 'Schema', children: <FormSchema /> },
    ]} />
  </div>
);

const FormJSX = observer(() => {
  const store = useStore({ defaultValues: { c: '1' } });
  const { values, setValues } = store;
  const { c } = values;
  const ref = useRef(null);
  const gRef = useRef(null);


  return <>
    <AntForm>
      <AntForm.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </AntForm.Item>
    </AntForm>
  </>;
});

const FormSchema = observer(() => {
  const store = useStore({ defaultValues: { v: '1' } });
  console.log('v = ', store.values.v);

  return (
    <StorePage
      store={store}
      components={{ Form: AntForm, Input }}
      schema={{
        type: 'object',
        properties: {
          form: {
            type: 'void',
            'x-component': 'Form',
            'x-component-props': {
              // labelCol: { span: 8 },
              wrapperCol: { span: 8 },
            },
            properties: {
              v: {
                type: 'string',
                'x-decorator': 'Form.Item',
                'x-decorator-props': {
                  name: 'v',
                  label: 'V',
                },
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: 'Username',
                },
              },
            },
          },

        },
      }}
    />
  );
});
