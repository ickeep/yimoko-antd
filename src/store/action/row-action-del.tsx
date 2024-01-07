import { useExpressionScope, observer } from '@formily/react';
import { get } from 'lodash-es';
import React from 'react';

import { RowAction, RowActionProps } from './row-action';

export const RowActionDel = observer((props: Partial<RowActionProps>) => {
  const scope = useExpressionScope();
  const { $config = {}, $record = {} } = scope ?? {};
  const { keys } = props;
  const labelKey = keys?.label ?? $config?.labelKey ?? 'name';
  const useRecord = props.record || $record;
  const {
    confirm = { content: `确定要删除 ${get(useRecord, labelKey) ?? ''}  吗？` },
    store,
    children = '删除',
    ...args
  } = props;

  return (
    <RowAction
      size='small'
      danger
      {...args}
      children={children}
      store={{ api: $config?.api?.delOne, ...store }}
      confirm={confirm}
    />
  );
});
