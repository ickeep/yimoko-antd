import { useAdditionalNode } from '@yimoko/store';
import { FloatButton as AntFloatButton, FloatButtonProps } from 'antd';

import { FloatButtonElement } from 'antd/lib/float-button/interface';
import React, { forwardRef } from 'react';

import { getAutoIcon } from './icon';

const FloatButtonFC = forwardRef<FloatButtonElement, FloatButtonProps>((props, ref) => {
  const { icon, description, tooltip, ...args } = props;
  const curDescription = useAdditionalNode('description', description);
  // @ts-ignore
  const curTooltip = useAdditionalNode('tooltip', tooltip);

  return <AntFloatButton {...args} ref={ref} icon={getAutoIcon(icon)} description={curDescription} tooltip={curTooltip} />;
});

export const FloatButton = Object.assign(FloatButtonFC, AntFloatButton);

// FloatButton.Group = AntFloatButton.Group;
// FloatButton.BackTop = AntFloatButton.BackTop;
