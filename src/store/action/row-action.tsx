import { useExpressionScope, observer } from '@formily/react';
import { IOperateStoreConfig, IRunFn, judgeIsEmpty, useCurStore, useOperateStore } from '@yimoko/store';
import { Button, ButtonProps, Modal, ModalFuncProps } from 'antd';
import { pick } from 'lodash-es';
import React from 'react';

export const RowAction = observer((props: RowActionProps) => {
  const scope = useExpressionScope();
  const pStore = useCurStore();
  const { $config, $record, $index } = scope;
  const { store, values, keys, isRefresh = true, record, index = $index, onSuccess, onFail, onClick, confirm, ...args } = props;
  const idKey = keys?.id ?? $config?.idKey ?? 'id';

  const value = props.value ?? $record?.[idKey];
  const [modal, contextHolder] = Modal.useModal();

  const { runAPIByValues, defaultValues, loading } = useOperateStore({
    defaultValues: { [idKey]: '' },
    ...store,
    runAfter: {
      runOnSuccess: (...args) => {
        onSuccess?.(...args);
        store.runAfter?.runOnSuccess?.(...args);
        isRefresh && pStore?.runAPI?.();
      },
      runOnFail: (...args) => {
        onFail?.(...args);
        store.runAfter?.runOnFail?.(...args);
      },
    },
  });

  const run = () => {
    // 根据默认值，从value、index、record、$record中取值
    const rowValues = pick({ value, index, ...scope?.$record, ...record }, Object.keys(defaultValues));
    return runAPIByValues({ ...rowValues, ...values });
  };

  return (
    <>
      <Button
        size='small'
        {...args}
        loading={loading}
        onClick={(e) => {
          onClick?.(e);
          if (!judgeIsEmpty(confirm)) {
            modal.confirm({
              title: '确认',
              ...confirm,
              onOk: (...args) => {
                confirm?.onOk?.(...args);
                return run();
              },
            });
          } else {
            run();
          }
        }}
      />
      {!judgeIsEmpty(contextHolder) && contextHolder}
    </>);
});

export interface RowActionProps<V extends object = any, R extends object = any> extends Omit<ButtonProps, 'loading'> {
  store: IOperateStoreConfig<V, R>
  isRefresh?: boolean
  value?: any
  keys?: { id?: string, label?: string }
  // 执行固定参数
  values?: V
  record?: Record<any, any>
  index?: number
  onSuccess?: IRunFn
  onFail?: IRunFn
  confirm?: ModalFuncProps
}
