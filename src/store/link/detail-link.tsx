import { useExpressionScope, observer } from '@formily/react';
import React, { useMemo } from 'react';

import { Link, LinkProps } from '../../out/link';

export const DetailLink = observer((props: LinkProps) => {
  const { to, children = '详情', ...rest } = props;

  const { getDetailPath, $record } = useExpressionScope();
  const curTo = useMemo(() => to ?? getDetailPath?.($record), [to, getDetailPath, $record]);
  return <Link to={curTo}  {...rest} children={children} />;
});
