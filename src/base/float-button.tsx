import { useAdditionalNode } from '@yimoko/store';
import { FloatButton as AntFloatButton, FloatButtonProps } from 'antd';

import { getAutoIcon } from './icon';

export const FloatButton = (props: FloatButtonProps) => {
  const { icon, description, tooltip, ...args } = props;
  const curDescription = useAdditionalNode('description', description);
  // @ts-ignore
  const curTooltip = useAdditionalNode('tooltip', tooltip);

  return <AntFloatButton {...args} icon={getAutoIcon(icon)} description={curDescription} tooltip={curTooltip} />;
};

FloatButton.Group = AntFloatButton.Group;
FloatButton.BackTop = AntFloatButton.BackTop;
