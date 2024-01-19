import { observer, useExpressionScope } from '@formily/react';
import React, { useMemo } from 'react';

import { Link, LinkProps } from '../../out/link';

export const EditLink = observer((props: LinkProps) => {
  const { to, children = '编辑', ...rest } = props;
  const { getEditPath, $record } = useExpressionScope();
  const curTo = useMemo(() => to ?? getEditPath?.($record), [to, getEditPath, $record]);
  return <Link to={curTo}  {...rest} children={children} />;
});
