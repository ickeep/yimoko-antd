import { useExpressionScope, observer } from '@formily/react';

import React from 'react';

import { RowsAction, RowsActionProps } from './rows-action';

export const RowsActionDisable = observer((props: Partial<RowsActionProps>) => {
  const scope = useExpressionScope();
  const { $config = {} } = scope ?? {};

  const {
    confirm = { content: '确定要批量停用吗？' },
    store,
    children = '批量停用',
    ...args
  } = props;

  return (
    <RowsAction
      danger
      {...args}
      children={children}
      store={{ api: $config?.api?.disable, ...store }}
      confirm={confirm}
    />
  );
});
