import { observer } from '@formily/react';
import { judgeIsEmpty } from '@yimoko/store';
import { Typography } from 'antd';
import { LinkProps as ALinkProps } from 'antd/lib/typography/Link';
import React, { forwardRef, useMemo } from 'react';
import { LinkProps as RLinkProps, useHref, useLinkClickHandler } from 'react-router-dom';

const { Link: ALink } = Typography;

export type LinkProps = Pick<RLinkProps, 'to' | 'reloadDocument' | 'replace' | 'state'> & ALinkProps & React.RefAttributes<HTMLElement> & { value?: RLinkProps['children'] };

export const Link = observer((props: LinkProps) => {
  const { href, to, value, target, children, ...args } = props;

  const curTo = useMemo(() => {
    const val = to ?? href;
    if (typeof val === 'string') {
      return val;
    }
    if (judgeIsEmpty(val)) {
      return '';
    }
    const { pathname = '', search = '', hash = '' } = val;
    return pathname + search + hash;
  }, [to, href]);

  const isExternal = useMemo(() => curTo && /^[\w]+:\/\//.test(curTo), [curTo]);

  const curTarget = useMemo(() => {
    if (target) {
      return target;
    }
    return isExternal ? '_blank' : undefined;
  }, [isExternal, target]);

  if (!isExternal) {
    return (<LinkAdapter {...args} target={curTarget} to={curTo} children={children ?? value} />);
  }

  return <ALink rel="noopener noreferrer" {...args} href={curTo} target={curTarget} />;
});

export const LinkAdapter = forwardRef<any, LinkProps>((props, ref) => {
  const { onClick, replace = false, state, target, to, type, ...args } = props;
  const href = useHref(to);
  const handleClick = useLinkClickHandler(to, { replace, state, target });
  return (
    <ALink
      {...args}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        // @ts-ignore TODO test
        !event.defaultPrevented && handleClick(event);
      }}
      ref={ref}
      target={target}
    />
  );
});
