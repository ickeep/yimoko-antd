import { useAdditionalNode } from '@yimoko/store';
import { AutoComplete as AntAutoComplete, AutoCompleteProps } from 'antd';
import { forwardRef } from 'react';

import { getAllowClear } from '../base/icon';

export const AutoComplete = forwardRef<React.ElementRef<typeof AntAutoComplete>, AutoCompleteProps>((props, ref) => {
  const { notFoundContent, allowClear, ...rest } = props;
  const curNotFoundContent = useAdditionalNode('notFoundContent', notFoundContent);

  return <AntAutoComplete {...rest} allowClear={getAllowClear(allowClear as any)} notFoundContent={curNotFoundContent} ref={ref} />;
});
