import { useAdditionalNode } from '@yimoko/store';
import { AutoComplete as AntAutoComplete, AutoCompleteProps } from 'antd';

export const AutoComplete = (props: AutoCompleteProps) => {
  const { notFoundContent, ...rest } = props;
  const curNotFoundContent = useAdditionalNode('notFoundContent', notFoundContent);

  return <AntAutoComplete {...rest} notFoundContent={curNotFoundContent} />;
};
