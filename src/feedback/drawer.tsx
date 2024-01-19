import { observer } from '@formily/react';
import { BoxContentProvider, BoxContentRender, IStore, useBoxContent, useBoxStore, Trigger, TriggerProps } from '@yimoko/store';
import { ButtonProps, Drawer as ADrawer, DrawerProps as ADrawerProps, Row, RowProps, Space, ConfigProvider } from 'antd';
import React, { ReactElement, FC, Component, useMemo, ReactNode, useContext } from 'react';

import { Button } from '../base/button';
import { CancelTrigger } from '../out/cancel-trigger';
import { OkTrigger } from '../out/ok-trigger';
import { RunTrigger } from '../out/run-trigger';

interface IContentProps {
  isBoxContent?: boolean
  onClose: () => void | Promise<void>,
  [key: string]: any
}

export interface DrawerProps extends Omit<ADrawerProps, 'children' | 'footer'> {
  trigger?: TriggerProps
  content?: ReactElement<IContentProps> | FC<IContentProps> | Component<IContentProps>
  children?: ReactElement<IContentProps>
  onOpen?: () => void | Promise<void>,
  onClose?: () => void | Promise<void>,
  isBindStore?: boolean
  isBindContent?: boolean
  store?: IStore
  footer?: ReactNode | true
  okButtonProps?: ButtonProps
  cancelButtonProps?: ButtonProps
  footerRowProps?: RowProps
}

export const Drawer = observer((props: DrawerProps) => {
  const { trigger, onOpen, onClose, open, ...args } = props;
  const { title } = args;

  const boxStore = useBoxStore({ isOpen: open, onClose, onOpen });
  const { isOpen, openUp, close } = boxStore;

  return (
    <BoxContentProvider value={boxStore}>
      <Trigger component={Button} children={title} {...trigger} onTrig={openUp} />
      {isOpen !== undefined && (
        <DrawerRender {...args} open={isOpen} onClose={close} />
      )}
    </BoxContentProvider>
  );
});

const DrawerRender = observer((props: Omit<DrawerProps, 'trigger' | 'onOpen'>) => {
  const { content, children, isBindStore, store, footer, okButtonProps, cancelButtonProps, footerRowProps, isBindContent, ...args } = props;
  const boxStore = useBoxContent();
  const { close } = boxStore;

  const context = useContext(ConfigProvider.ConfigContext);
  const justOkText = context.locale?.Modal?.justOkText;

  const isBind = useMemo(() => isBindStore ?? !!store, [isBindStore, store]);

  const curFooter = useMemo(() => {
    if (footer === true) {
      return (
        <Row justify="end" {...footerRowProps}>
          {isBind
            ? <Space>
              <CancelTrigger {...cancelButtonProps} onCancel={close} />
              <RunTrigger {...okButtonProps} store={store} isBoxContent />
            </Space>
            : <OkTrigger children={justOkText} {...okButtonProps} onOk={close} />}
        </Row>
      );
    }
    return footer;
  }, [cancelButtonProps, close, footer, footerRowProps, isBind, justOkText, okButtonProps, store]);

  return (
    <ADrawer {...args} footer={curFooter} onClose={close}>
      <BoxContentRender isBind={isBindContent} content={content}>{children}</BoxContentRender>
    </ADrawer>
  );
});
