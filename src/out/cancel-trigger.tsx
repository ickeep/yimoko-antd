import { observer } from '@formily/react';
import { useBoxContent, Trigger, TriggerProps } from '@yimoko/store';
import { Button, ButtonProps } from 'antd';

export interface CancelTriggerProps extends ButtonProps {
  closeBox?: boolean
  onCancel: TriggerProps['onTrig']
}

export const CancelTrigger = observer((props: CancelTriggerProps) => {
  const { closeBox = true, onCancel, ...args } = props;
  const { onClose } = useBoxContent();

  return (
    <Trigger
      component={Button}
      children="取消"
      {...args}
      onTrig={(e) => {
        onCancel?.(e);
        closeBox && onClose?.();
      }}
    />
  );
});
