import { observer } from '@formily/react';
import { useBoxContent, Trigger, TriggerProps } from '@yimoko/store';
import { Button, ButtonProps } from 'antd';

export interface OkTriggerProps extends ButtonProps {
  closeBox?: boolean
  onOk: TriggerProps['onTrig']
}

export const OkTrigger = observer((props: OkTriggerProps) => {
  const { closeBox = true, onOk, ...args } = props;
  const { onClose } = useBoxContent();

  return (
    <Trigger
      component={Button}
      children="确定"
      type='primary'
      {...args}
      onTrig={(e) => {
        onOk?.(e);
        closeBox && onClose?.();
      }}
    />
  );
});
