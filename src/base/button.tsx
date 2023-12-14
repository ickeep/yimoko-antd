import { Button as AntButton, ButtonProps } from 'antd';

import { getAutoIcon } from './icon';

export const Button = (props: ButtonProps) => {
  const { icon, ...args } = props;
  return <AntButton {...args} icon={getAutoIcon(icon)} />;
};

