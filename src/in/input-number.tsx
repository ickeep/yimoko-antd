import { useAdditionalNode } from '@yimoko/store';
import { InputNumber as AntInputNumber, InputNumberProps } from 'antd';
import React, { forwardRef } from 'react';

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>((props, ref) => {
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
