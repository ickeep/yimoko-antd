import { useExpressionScope, observer } from '@formily/react';
import React from 'react';

import { RowsAction, RowsActionProps } from './rows-action';

export const RowsActionEnable = observer((props: Partial<RowsActionProps>) => {
  const scope = useExpressionScope();
  const { $config = {} } = scope ?? {};

  const {
    confirm = { content: '确定要批量启用吗？' },
    store,
    children = '批量启用',
    ...args
  } = props;

  return (
    <RowsAction
      {...args}
      children={children}
      store={{ api: $config?.api?.enable, ...store }}
      confirm={confirm}
    />
  );
});
