import { QuestionCircleOutlined } from '@ant-design/icons';
import { observer } from '@formily/react';
import { Tooltip as ATooltip, TooltipProps as ATooltipProps } from 'antd';
import React, { isValidElement, useMemo } from 'react';

import { Icon, IconProps } from '../base/icon';

export type TooltipProps = ATooltipProps & {
  value?: ATooltipProps['children']
  icon?: string | React.ReactNode | IconProps
};

export const Tooltip = observer((props: TooltipProps) => {
  const { icon = <QuestionCircleOutlined />, value, children, ...args } = props;

  const curChildren = useMemo(() => {
    const node = children || value;
    if (node) {
      return node;
    }
    if (typeof icon === 'string') {
      return <Icon name={icon} />;
    }
    if (isValidElement(icon)) {
      return icon;
    }
    if (typeof icon === 'object') {
      return <Icon name={'QuestionCircleOutlined'} {...icon} />;
    }
  }, [children, icon, value]);

  return <ATooltip {...args}>{curChildren}</ATooltip>;
});
