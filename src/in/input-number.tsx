import { useAdditionalNode } from '@yimoko/store';
import { InputNumber as AntInputNumber } from 'antd';
import React, { forwardRef } from 'react';

// eslint-disable-next-line max-len
export const InputNumber: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.ComponentProps<typeof AntInputNumber>>> = forwardRef<HTMLInputElement, React.ComponentProps<typeof AntInputNumber>>((props, ref) => {
  const { prefix, suffix, addonBefore, addonAfter, ...rest } = props;

  const curPrefix = useAdditionalNode('prefix', prefix);
  const curSuffix = useAdditionalNode('suffix', suffix);
  const curAddonBefore = useAdditionalNode('addonBefore', addonBefore);
  const curAddonAfter = useAdditionalNode('addonAfter', addonAfter);

  return (
    <AntInputNumber
      {...rest}
      ref={ref}
      prefix={curPrefix}
      suffix={curSuffix}
      addonBefore={curAddonBefore}
      addonAfter={curAddonAfter}
    />);
});
