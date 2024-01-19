import { observer } from '@formily/react';
import { Affix, AffixProps, ButtonProps, Space, SpaceProps } from 'antd';
import React from 'react';

import { Back } from './back';
import { Submit } from './submit';

export interface PageBarActionsProps {
  affix?: false | AffixProps;
  back?: false | ButtonProps;
  submit?: false | ButtonProps;
  children?: React.ReactNode;
  space?: SpaceProps;
}

export const PageBarActions = observer((props: PageBarActionsProps) => {
  const { affix, back = {}, submit = {}, children, space } = props;
  const EL = (
    <Space {...space} style={{ padding: '10px 0', background: '#fff', display: 'flex', borderTop: '1px solid #f0f0f0', ...space?.style }}>
      {back && <Back {...back} />}
      {submit && <Submit {...submit} />}
      {children}
    </Space>
  );
  if (affix === false) {
    return EL;
  }
  return <Affix offsetBottom={0} {...affix}>{EL}</Affix>;
});
