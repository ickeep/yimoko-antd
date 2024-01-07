import { observer, useExpressionScope } from '@formily/react';
import { PageStoreConfig } from '@yimoko/store';
import { Breadcrumb, BreadcrumbProps, Divider, DividerProps, Space } from 'antd';
import React, { ReactNode } from 'react';

export const PageBarHeader = observer((props: PageBarHeaderProps) => {
  const { breadcrumb, title, divider, children } = props;
  const scope = useExpressionScope();
  const { $config = {} } = scope ?? {};

  const items: BreadcrumbProps['items'] = (breadcrumb ?? $config?.breadcrumb)?.map((item: any) => {
    const { label, href, icon } = item;
    return { title: label, href, icon };
  });

  const curTitle = title ?? $config?.name;

  if (curTitle) {
    items?.push({ title: curTitle, href: '' });
  }

  return (
    <>
      {children
        ? <Space style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }} >
          <Breadcrumb items={items} />
          {children}
        </Space>
        : <Breadcrumb items={items} />
      }
      <Divider {...divider} />
    </>
  );
});

export interface PageBarHeaderProps extends Pick<Partial<PageStoreConfig>, 'breadcrumb'> {
  title?: string
  divider?: DividerProps
  children?: ReactNode
}
