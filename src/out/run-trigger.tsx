import { observer } from '@formily/react';
import { BoxStore, IStore, judgeIsEmpty, judgeIsSuccess, useBoxContent, useCurForm, useCurStore, Trigger } from '@yimoko/store';
import { Button, ButtonProps, ConfigProvider } from 'antd';
import React, { useContext } from 'react';


export interface RunTriggerProps extends ButtonProps {
  store?: IStore
  closeBox?: boolean | 'success' | 'fail'
  isBoxContent?: boolean
}

export const RunTrigger = observer((props: RunTriggerProps) => {
  const { store, closeBox, isBoxContent, ...args } = props;
  const boxStore = useBoxContent();
  const { contentStore } = boxStore;
  const useStore = useCurStore(store);
  const curStore = isBoxContent ? contentStore : useStore;
  const curForm = useCurForm(undefined, curStore);

  const context = useContext(ConfigProvider.ConfigContext);
  const okText = context.locale?.Modal?.okText;

  const trig = () => {
    trigStoreRun(curStore, boxStore, closeBox);
  };

  return (
    <Trigger
      component={Button}
      loading={curStore?.loading}
      disabled={!judgeIsEmpty(curForm?.errors)}
      children={okText}
      type='primary'
      {...args}
      onTrig={trig}
    />
  );
});

// eslint-disable-next-line complexity
export const trigStoreRun = async (store?: IStore, boxStore?: BoxStore, closeBox: boolean | 'success' | 'fail' = 'success') => {
  const { close } = boxStore ?? {};

  if (store) {
    const res = await store.runAPI();
    if (closeBox === true) {
      close?.();
    }
    if (judgeIsSuccess(res)) {
      closeBox === 'success' && close?.();
    } else {
      closeBox === 'fail' && close?.();
    }
  }
};
