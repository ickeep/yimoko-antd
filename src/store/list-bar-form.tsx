import { observer } from '@formily/react';
import { IStore, judgeIsEmpty, useCurForm, useCurStore } from '@yimoko/store';
import { Button, ButtonProps, Space } from 'antd';
import React, { useMemo } from 'react';

import { FormItem, FormItemProps, StoreForm, StoreFormProps } from './form';
import { Submit } from './submit';

export const ListBarForm = observer((props: ListBarFormProps) => {
  const { store, isCheckRequired = false, isReset = true, queryProps, fields, resetProps, actionProps, children, ...rest } = props;
  const curStore = useCurStore(store) as IStore;
  const curForm = useCurForm(undefined, curStore);

  const curFields = useMemo(() => {
    if (isCheckRequired) {
      return fields;
    }
    return fields?.map(item => (typeof item === 'string' ? { field: item, required: false } : { ...item, required: false }));
  }, [fields, isCheckRequired]);

  return (
    <StoreForm row={{ gutter: 10 }} col={{ span: 8 }} {...rest} fields={curFields}   >
      {children}
      <FormItem colon={false} {...actionProps} >
        <Space>
          <Submit {...queryProps} disabled={!judgeIsEmpty(curForm?.errors)} >查询</Submit>
          {isReset && <Button {...resetProps} onClick={curStore?.resetValues}>重置</Button>}
        </Space>
      </FormItem>
    </StoreForm >
  );
});

export interface ListBarFormProps extends StoreFormProps {
  store?: IStore
  isCheckRequired?: boolean;
  isReset?: boolean;
  queryProps?: ButtonProps;
  resetProps?: ButtonProps;
  actionProps?: FormItemProps
}
