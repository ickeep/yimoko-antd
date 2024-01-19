import { useCurStore } from '@yimoko/store';
import { ButtonProps, ConfigProvider } from 'antd';
import React, { useContext } from 'react';

import { Button } from '../base/button';

export const Reset = (props: ButtonProps) => {
  const { onClick, onKeyDown, ...rest } = props;
  const curStore = useCurStore();
  const context = useContext(ConfigProvider.ConfigContext);
  const filterReset = context.locale?.Table?.filterReset;

  return (
    <Button
      children={filterReset}
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
