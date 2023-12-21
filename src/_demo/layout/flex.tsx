import { StorePage } from '@yimoko/store';
import React from 'react';

import { Button, Flex, Tabs } from '@/library';

export const FlexDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema" items={[
      { key: 'JSX', label: 'JSX 调用', children: <Flex gap={10}><Button>1</Button><Button>2</Button></Flex> },
      { key: 'schema', label: 'Schema', children: <FlexSchema /> },
    ]} />
  </div>
);

const FlexSchema = () => (
  <StorePage
    store={{ defaultValues: { radio: '1' } }}
    components={{ Flex }}
    schema={{
      type: 'object',
      properties: {
        space: {
          type: 'void',
          'x-component': 'Flex',
          'x-component-props': {
            gap: 10,
          },
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
        },
      },
    }}
  />
);
