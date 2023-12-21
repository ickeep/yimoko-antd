import { observer } from '@formily/react';
import { IOptionsAPIProps, useAdditionalNode, useAPIOptions } from '@yimoko/store';
import { Steps as AntSteps, StepProps, StepsProps } from 'antd';
import React, { FC } from 'react';

import { getAutoIcon } from '../base/icon';

type IStepsFC = FC<StepsProps & Omit<IOptionsAPIProps<keyof StepProps>, 'valueType'>>;

const StepsFC: IStepsFC = observer((props) => {
  const { options, api, keys, splitter, items, ...rest } = props;
  const [data] = useAPIOptions(items ?? options, api, keys, splitter);

  return <AntSteps  {...rest} items={data} />;
});


type ISteps = IStepsFC & {
  Step: typeof AntSteps.Step;
};

export const Steps = StepsFC as ISteps;

const Step = (props: StepProps) => {
  const { icon, title, subTitle, description, ...rest } = props;
  const curTitle = useAdditionalNode('title', title);
  const curSubTitle = useAdditionalNode('subTitle', subTitle);
  const curDescription = useAdditionalNode('description', description);

  return <AntSteps.Step {...rest} icon={getAutoIcon(icon)} title={curTitle} subTitle={curSubTitle} description={curDescription} />;
};

Steps.Step = Step;
