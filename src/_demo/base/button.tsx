import { Button, Cascader } from '@/library';

export const ButtonDemo = () => (

  <>
    <Button>按钮</Button>
    <Cascader<{ label: string, value: string }> options={[{ label: 'xxxx', value: 'xxx' }]} multiple />
    <Cascader.Panel options={[{ label: 'xxxx', value: 'xxx' }]} />
  </>);

