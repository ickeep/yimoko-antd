import { useExpressionScope, observer } from '@formily/react';
import { useCurStore } from '@yimoko/store';
import { Spin } from 'antd';
import { get } from 'lodash-es';
import React from 'react';

import { RowAction, RowActionProps } from './row-action';

// eslint-disable-next-line complexity
export const RowActionSwitch = observer((props: Partial<RowActionProps>) => {
  const { store, ...args } = props;
  const scope = useExpressionScope();
  const { $config = {}, $record = {} } = scope;
  const { keys } = props;
  const idKey = keys?.id ?? $config?.idKey ?? 'id';
  const labelKey = keys?.label ?? $config?.labelKey ?? 'name';
  const useRecord = props.record || $record;
  const isEnable = useRecord?.switch;

  const { loading } = useCurStore() ?? {};

  // RowAction 强制重新渲染 否则 RowAction store 不更新
  if (loading) return <Spin size='small' />;

  if (isEnable) {
    return (
      <RowAction
        type="primary"
        ghost
        danger
        children="禁用"
        confirm={{ content: `确定要禁用 ${get(useRecord, labelKey) ?? ''} 吗？` }}
        {...args}
        store={{ defaultValues: { [idKey]: '' }, api: $config?.api?.disableOne, ...store }}
      />
    );
  }

  return (
    <RowAction
      type="primary"
      ghost
      children="启用"
      confirm={{ content: `确定要启用 ${get(useRecord, labelKey) ?? ''} 吗？` }}
      {...args}
      store={{ defaultValues: { [idKey]: '' }, api: $config?.api?.enableOne, ...store }}
    />
  );
});
