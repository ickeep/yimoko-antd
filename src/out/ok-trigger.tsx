import { observer } from '@formily/react';
import { useBoxContent, Trigger, TriggerProps } from '@yimoko/store';
import { Button, ButtonProps, ConfigProvider } from 'antd';
import React, { useContext } from 'react';

export interface OkTriggerProps extends ButtonProps {
  closeBox?: boolean
  onOk: TriggerProps['onTrig']
}

export const OkTrigger = observer((props: OkTriggerProps) => {
  const { closeBox = true, onOk, ...args } = props;
  const { onClose } = useBoxContent();
  const context = useContext(ConfigProvider.ConfigContext);
  const okText = context.locale?.Modal?.okText;

  return (
    <Trigger
      component={Button}
      children={okText}
      type='primary'
      {...args}
      onTrig={(e) => {
        onOk?.(e);
        closeBox && onClose?.();
      }}
    />
  );
});
