import { useAdditionalNode } from '@yimoko/store';
import { Input as AntInput, InputProps, InputRef } from 'antd';
import { PasswordProps, SearchProps, TextAreaProps } from 'antd/lib/input';
import { forwardRef } from 'react';

const InputFC = forwardRef<InputRef, Omit<InputProps, 'onChange'> & { onChange: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void }>((props, ref) => {
  const {
    onChange,
    prefix, suffix, addonBefore, addonAfter,
    ...rest } = props;

  const curPrefix = useAdditionalNode('prefix', prefix);
  const curSuffix = useAdditionalNode('suffix', suffix);
  const curAddonBefore = useAdditionalNode('addonBefore', addonBefore);
  const curAddonAfter = useAdditionalNode('addonAfter', addonAfter);

  return (
    <AntInput
      {...rest}
      ref={ref}
      prefix={curPrefix}
      suffix={curSuffix}
      addonBefore={curAddonBefore}
      addonAfter={curAddonAfter}
      onChange={e => onChange?.(e.target.value, e)}
    />);
});

const TextArea = forwardRef<InputRef, Omit<TextAreaProps, 'onChange'> & { onChange: (value: string, e: React.ChangeEvent<HTMLTextAreaElement>) => void }>((props, ref) => {
  const { onChange, ...rest } = props;

  return (
    <AntInput.TextArea
      {...rest}
      ref={ref}
      onChange={e => onChange?.(e.target.value, e)}
    />);
});

const Password = forwardRef<InputRef, Omit<PasswordProps, 'onChange'> & { onChange: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void }>((props, ref) => {
  const {
    onChange,
    prefix, suffix, addonBefore, addonAfter,
    ...rest } = props;

  const curPrefix = useAdditionalNode('prefix', prefix);
  const curSuffix = useAdditionalNode('suffix', suffix);
  const curAddonBefore = useAdditionalNode('addonBefore', addonBefore);
  const curAddonAfter = useAdditionalNode('addonAfter', addonAfter);

  return (
    <AntInput.Password
      {...rest}
      ref={ref}
      prefix={curPrefix}
      suffix={curSuffix}
      addonBefore={curAddonBefore}
      addonAfter={curAddonAfter}
      onChange={e => onChange?.(e.target.value, e)}
    />);
});

const Search = forwardRef<InputRef, Omit<SearchProps, 'onChange'> & { onChange: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void }>((props, ref) => {
  const {
    onChange,
    prefix, suffix, addonBefore, addonAfter, enterButton,
    ...rest } = props;

  const curPrefix = useAdditionalNode('prefix', prefix);
  const curSuffix = useAdditionalNode('suffix', suffix);
  const curAddonBefore = useAdditionalNode('addonBefore', addonBefore);
  const curAddonAfter = useAdditionalNode('addonAfter', addonAfter);
  const curEnterButton = useAdditionalNode('enterButton', enterButton);

  return (
    <AntInput.Search
      {...rest}
      ref={ref}
      prefix={curPrefix}
      suffix={curSuffix}
      addonBefore={curAddonBefore}
      addonAfter={curAddonAfter}
      enterButton={curEnterButton}
      onChange={e => onChange?.(e.target.value, e)}
    />);
});

export const Input = Object.assign(InputFC, {
  TextArea,
  Password,
  Search,
  Group: AntInput.Group,
});
