import { useAdditionalNode } from '@yimoko/store';
import { Space as AntSpace, SpaceProps } from 'antd';

export const Space = (props: SpaceProps) => {
  const { split, ...rest } = props;
  const curSplit = useAdditionalNode('split', split);

  return (
    <AntSpace {...rest} split={curSplit} />
  );
};

Space.Compact = AntSpace.Compact;
