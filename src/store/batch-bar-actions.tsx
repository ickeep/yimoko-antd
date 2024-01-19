import { observer } from '@formily/react';
import { Space, SpaceProps } from 'antd';
import React from 'react';

import { RowsAction, RowsActionProps } from './action/rows-action';
import { RowsActionDel } from './action/rows-action-del';
import { RowsActionDisable } from './action/rows-action-disable';
import { RowsActionEnable } from './action/rows-action-enable';

export interface BatchBarActionProps extends Omit<SpaceProps, 'children'> {
  isDel?: boolean
  isEnable?: boolean
  isDisabled?: boolean
  actions?: RowsActionProps[]
}

export const BatchBarAction = observer((props: BatchBarActionProps) => {
  const { isDel = true, actions, isEnable = true, isDisabled = true, style, ...rest } = props;

  return (
    <Space wrap {...rest} style={{ width: '100%', marginBottom: 10, justifyContent: 'end', ...style }}>
      {isEnable && <RowsActionEnable />}
      {isDisabled && <RowsActionDisable />}
      {isDel && <RowsActionDel />}
      {actions?.map((action, index) => <RowsAction key={index} {...action} />)}
    </Space>
  );
});
