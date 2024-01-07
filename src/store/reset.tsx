import { useCurStore } from '@yimoko/store';
import { ButtonProps } from 'antd';
import React from 'react';

import { Button } from '../base/button';

export const Reset = (props: ButtonProps) => {
  const { onClick, onKeyDown, ...rest } = props;
  const curStore = useCurStore();

  return (
    <Button
      children='重置'
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        curStore?.resetValues();
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.key === 'Enter') {
          curStore?.resetValues();
        }
      }}
    />
  );
};
