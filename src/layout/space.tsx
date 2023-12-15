import { useAdditionalNode } from '@yimoko/store';
import { Space as AntSpace, SpaceProps } from 'antd';
import { forwardRef } from 'react';

const SpaceFC = forwardRef<HTMLDivElement, SpaceProps>((props, ref) => {
  const { split, ...rest } = props;
  const curSplit = useAdditionalNode('split', split);

  return (
    <AntSpace {...rest} split={curSplit} ref={ref} />
  );
});

export const Space = Object.assign(SpaceFC, AntSpace);

