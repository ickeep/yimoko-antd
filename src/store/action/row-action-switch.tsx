import { useExpressionScope, observer } from '@formily/react';
import { useCurStore } from '@yimoko/store';
import { Button } from 'antd';
import { get } from 'lodash-es';
import React, { useMemo } from 'react';

import { RowAction, RowActionProps } from './row-action';

// eslint-disable-next-line complexity
export const RowActionSwitch = observer((props: Partial<RowActionProps>) => {
  const { store, children, ...args } = props;
  const scope = useExpressionScope();
  const { $config = {}, $record = {} } = scope;
  const { keys } = props;
  const idKey = keys?.id ?? $config?.idKey ?? 'id';
  const labelKey = keys?.label ?? $config?.labelKey ?? 'name';
  const useRecord = props.record || $record;
  const isEnable = useRecord?.switch;

  const actionProps = useMemo(() => {
    const text = isEnable ? '禁用' : '启用';
    const bProps: Omit<RowActionProps, 'store'> = {
      size: 'small',
      type: 'primary',
      ghost: true,
      children: children ?? text,
      confirm: { content: `确定要${text} ${get(useRecord, labelKey) ?? ''} 吗？` },
    };
    if (isEnable) {
      bProps.danger = true;
    }

    return { ...bProps, ...args };
  }, [args, children, isEnable, labelKey, useRecord]);

  const { loading } = useCurStore() ?? {};

  // RowAction 强制重新渲染 否则 RowAction store 不更新
  if (loading) return <Button {...actionProps} />;

  if (isEnable) {
    return (
      <RowAction
        {...actionProps}
        store={{ defaultValues: { [idKey]: '' }, api: $config?.api?.disableOne, ...store }}
      />
    );
  }

  return (
    <RowAction
      {...actionProps}
      store={{ defaultValues: { [idKey]: '' }, api: $config?.api?.enableOne, ...store }}
    />
  );
});
