import { ButtonProps } from 'antd';
import React from 'react';

import { Button } from '../base/button';

export const Submit = (props: ButtonProps) => {
  const { onClick, onKeyDown, ...rest } = props;

  return (
    <Button
      children='提交'
      type='primary'
      {...rest}
      htmlType='submit'
    />
  );
};
