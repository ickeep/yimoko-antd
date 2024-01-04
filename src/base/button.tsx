import { Button as AntButton, ButtonProps } from 'antd';
import React, { forwardRef } from 'react';

import { getAutoIcon } from './icon';

export const Button = forwardRef<HTMLElement, ButtonProps>((props, ref) => {
  const { icon, ...args } = props;
  return <AntButton {...args} ref={ref} icon={getAutoIcon(icon)} />;
});

