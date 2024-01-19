import { observer } from '@formily/react';
import { useCurStore } from '@yimoko/store';
import { ButtonProps } from 'antd';
import React from 'react';

import { Button } from '../base/button';

export const Submit = observer((props: ButtonProps) => {
  const { onClick, onKeyDown, ...rest } = props;
  const store = useCurStore();

  return (
    <Button
      children='提交'
      type='primary'
      loading={store?.loading}
      {...rest}
      htmlType='submit'
    />
  );
});
