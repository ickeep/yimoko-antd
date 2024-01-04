import { StorePage } from '@yimoko/store';

import React from 'react';

import { Col, Row, Tabs } from '@/library';

export const GridDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema" items={[
      { key: 'JSX', label: 'JSX 调用', children: <Row gutter={10}><Col span={6}>1</Col><Col span={6}>2</Col><Col span={6}>3</Col></Row> },
      { key: 'schema', label: 'Schema', children: <GridSchema /> },
    ]} />
  </div>
);

const GridSchema = () => (
  <StorePage
    store={{ defaultValues: { radio: '1' } }}
    components={{ Row }}
    schema={{
      type: 'object',
      properties: {
        space: {
          type: 'void',
          'x-component': 'Row',
          'x-component-props': {
            gutter: 10,
          },
          properties: {
            col1: {
              type: 'void',
              'x-component': 'Col',
              'x-component-props': {
                children: '1',
                span: 6,
              },
            },
            col2: {
              type: 'void',
              'x-component': 'Col',
              'x-component-props': {
                children: '2',
                span: 6,
              },
            },
            col3: {
              type: 'void',
              'x-component': 'Col',
              'x-component-props': {
                children: '3',
                span: 6,
              },
            },
          },
        },
      },
    }}
  />
);
