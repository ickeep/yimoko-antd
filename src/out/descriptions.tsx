import { IOptionsAPIProps, useAPIOptions, useAdditionalNode } from '@yimoko/store';
import { Descriptions as AntDescriptions, DescriptionsProps } from 'antd';
import { DescriptionsItemProps } from 'antd/lib/descriptions/Item';
import React from 'react';

export const Descriptions = (props: DescriptionsProps & Omit<IOptionsAPIProps<keyof DescriptionsItemProps>, 'valueType'>) => {
  const { extra, title, items, options, api, keys, splitter, ...args } = props;
  const curExtra = useAdditionalNode('extra', extra);
  const curTitle = useAdditionalNode('title', title);
  const [data] = useAPIOptions(items ?? options, api, keys, splitter) as unknown as [DescriptionsItemProps[]];

  return <AntDescriptions {...args} extra={curExtra} title={curTitle} items={data} />;
};

const Item = (props: DescriptionsItemProps) => {
  const { label, ...rest } = props;
  const curLabel = useAdditionalNode('label', label);
  return <AntDescriptions.Item {...rest} label={curLabel} />;
};

Descriptions.Item = Item;
