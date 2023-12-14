import { observer } from '@formily/react';
import { IOptionsAPIProps, useAPIOptions, useAdditionalNode } from '@yimoko/store';
import { Breadcrumb as AntBreadcrumb, BreadcrumbProps } from 'antd';
import { ItemType } from 'antd/lib/breadcrumb/Breadcrumb';
import { FC } from 'react';

type IBreadcrumbFC = FC<BreadcrumbProps & Omit<IOptionsAPIProps<keyof ItemType>, 'valueType'>>;

const BreadcrumbFC: IBreadcrumbFC = observer((props) => {
  const { options, api, keys, splitter, items, separator, ...rest } = props;
  const curSeparator = useAdditionalNode('separator', separator);
  const [data] = useAPIOptions(items ?? options, api, keys, splitter);

  return <AntBreadcrumb  {...rest} items={data} separator={curSeparator} />;
});

type IBreadcrumb = IBreadcrumbFC & {
  Item: typeof AntBreadcrumb.Item;
  Separator: typeof AntBreadcrumb.Separator;
};

export const Breadcrumb = BreadcrumbFC as IBreadcrumb;

Breadcrumb.Item = AntBreadcrumb.Item;
Breadcrumb.Separator = AntBreadcrumb.Separator;
