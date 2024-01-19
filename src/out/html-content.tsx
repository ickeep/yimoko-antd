import React from 'react';

export const HTMLContent = (props: { value: string } & React.HTMLAttributes<HTMLDivElement>) => {
  const { value, ...rest } = props;
  return <div {...rest} dangerouslySetInnerHTML={{ __html: value }} />;
};
