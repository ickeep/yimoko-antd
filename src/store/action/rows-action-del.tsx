import { useExpressionScope, observer } from '@formily/react';

import React from 'react';

import { RowsAction, RowsActionProps } from './rows-action';

export const RowsActionDel = observer((props: Partial<RowsActionProps>) => {
  const scope = useExpressionScope();
  const { $config = {} } = scope ?? {};

  const {
    confirm = { content: '确定要批量删除吗？' },
    store,
    children = '批量删除',
    ...args
  } = props;

  return (
    <RowsAction
      danger
      {...args}
      children={children}
      store={{ api: $config?.api?.del, ...store }}
      confirm={confirm}
    />
  );
});
