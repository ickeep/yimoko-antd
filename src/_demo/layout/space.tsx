import { StorePage } from '@yimoko/store';

import { Button, Space, Tabs } from '@/library';

export const SpaceDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema" items={[
      { key: 'JSX', label: 'JSX 调用', children: <Space><Button>1</Button><Button>2</Button></Space> },
      { key: 'schema', label: 'Schema', children: <SpaceSchema /> },
    ]} />
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
      },
    }}
  />
);
