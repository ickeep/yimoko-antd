import { observer } from '@formily/react';
import { useBoxContent, Trigger, TriggerProps } from '@yimoko/store';
import { Button, ButtonProps, ConfigProvider } from 'antd';
import React, { useContext } from 'react';

export interface CancelTriggerProps extends ButtonProps {
  closeBox?: boolean
  onCancel: TriggerProps['onTrig']
}

export const CancelTrigger = observer((props: CancelTriggerProps) => {
  const { closeBox = true, onCancel, ...args } = props;
  const { onClose } = useBoxContent();
  const context = useContext(ConfigProvider.ConfigContext);
  const cancelText = context.locale?.Modal?.cancelText;

  return (
    <Trigger
      component={Button}
      children={cancelText}
      {...args}
      onTrig={(e) => {
        onCancel?.(e);
        closeBox && onClose?.();
      }}
    />
  );
});
