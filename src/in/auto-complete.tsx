import { useAdditionalNode } from '@yimoko/store';
import { AutoComplete as AntAutoComplete, AutoCompleteProps } from 'antd';
import { forwardRef } from 'react';

export const AutoComplete = forwardRef<React.ElementRef<typeof AntAutoComplete>, AutoCompleteProps>((props, ref) => {
  const { notFoundContent, ...rest } = props;
  const curNotFoundContent = useAdditionalNode('notFoundContent', notFoundContent);

  return <AntAutoComplete {...rest} notFoundContent={curNotFoundContent} ref={ref} />;
});
