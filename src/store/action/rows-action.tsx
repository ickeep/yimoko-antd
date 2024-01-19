import { useExpressionScope, observer } from '@formily/react';
import { IOperateStoreConfig, IRunFn, ListStore, judgeIsEmpty, useCurStore, useOperateStore } from '@yimoko/store';
import { Button, ButtonProps, Modal, ModalFuncProps } from 'antd';
import React from 'react';
// 批量操作
export interface RowsActionProps<V extends object = any, R extends object = any> extends Omit<ButtonProps, 'loading'> {
  store: IOperateStoreConfig<V, R>
  isRefresh?: boolean
  value?: any
  keys?: { ids?: string, label?: string }
  onSuccess?: IRunFn
  onFail?: IRunFn
  confirm?: ModalFuncProps
}

export const RowsAction = observer((props: RowsActionProps) => {
  const scope = useExpressionScope();
  const pStore = useCurStore() as ListStore;
  const { selectedRowKeys } = pStore;
  const { $config } = scope;
  const { store, keys, isRefresh = true, onSuccess, onFail, onClick, confirm, ...args } = props;
  const idsKey = keys?.ids ?? (`${$config?.idKey ?? 'id'}s`);
  const [modal, contextHolder] = Modal.useModal();
  const operateStore = useOperateStore({
    defaultValues: { [idsKey]: '' },
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

  const { runAPIByValues, loading } = operateStore;

  const run = () => runAPIByValues({ [idsKey]: selectedRowKeys });

  return (
    <>
      <Button
        disabled={selectedRowKeys.length === 0}
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
