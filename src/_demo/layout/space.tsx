import { StorePage } from '@yimoko/store';

import { Button, Divider, Input, Space, Tabs } from '@/library';

export const SpaceDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema" items={[
      {
        key: 'JSX', label: 'JSX 调用', children: <SpaceJSX />,
      },
      { key: 'schema', label: 'Schema', children: <SpaceSchema /> },
    ]} />
  </div>
);
const SpaceJSX = () => (
  <div>
    <Space ><Button>1</Button><Button>2</Button></Space>
    <Divider />
    <Space.Compact block>
      <Input style={{ width: '20%' }} defaultValue="0571" />
      <Input style={{ width: '30%' }} defaultValue="26888888" />
    </Space.Compact>
  </div>
);

const SpaceSchema = () => (
  <StorePage
    store={{ defaultValues: { radio: '1' } }}
    components={{ Space }}
    schema={{
      type: 'object',
      properties: {
        space: {
          type: 'void',
          'x-component': 'Space',
          'x-component-props': {},
          properties: {
            btn: {
              type: 'void',
              'x-component': 'Button',
              'x-component-props': {
                children: '1',
              },
            },
            btn2: {
              type: 'void',
              'x-component': 'Button',
              'x-component-props': {
                children: '2',
              },
            },
          },
          additionalProperties: {
            type: 'void',
            properties: {
              split: {
                type: 'void',
                'x-component': 'Divider',
                'x-component-props': {
                  type: 'vertical',
                },
              },
            },
          },
        },
        divider: {
          type: 'void',
          'x-component': 'Divider',
        },
        compact: {
          type: 'void',
          'x-component': 'Space.Compact',
          'x-component-props': {
            block: true,
          },
          properties: {
            input1: {
              type: 'void',
              'x-component': 'Input',
              'x-component-props': {
                style: { width: '20%' },
                defaultValue: '0571',
              },
            },
            input2: {
              type: 'void',
              'x-component': 'Input',
              'x-component-props': {
                style: { width: '30%' },
                defaultValue: '26888888',
              },
            },
          },
        },
      },
    }}
  />
);
