import { shallowMount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../index';
import { ButtonType, ButtonSizeType } from '../src/button-types';
import { useNamespace } from '../../shared/hooks/use-namespace';

const ns = useNamespace('button', true);
const baseClass = ns.b();
const getTypeClass = (type: ButtonType) => {
  return ns.m(type);
};

const getSizeClass = (type: ButtonSizeType) => {
  return ns.m(type);
};

const roundClass = ns.m('round');
const circleClass = ns.m('circle');

describe('button', () => {
  it('dom', () => {
    const wrapper = shallowMount(Button, {
      slots: {
        default: '确定'
      }
    });

    // 元素是否存在
    expect(wrapper.find(baseClass).exists()).toBeTruthy();

    // 默认插槽的文本是否正确
    expect(wrapper.find(baseClass).text()).toBe('确定');

    wrapper.unmount();
  });

  it('type', async () => {
    const wrapper = shallowMount(Button, { props: { type: 'primary' } });
    expect(wrapper.find(getTypeClass('primary')).exists()).toBeTruthy();

    await wrapper.setProps({ type: 'success' });
    expect(wrapper.find(getTypeClass('success')).exists()).toBeTruthy();

    await wrapper.setProps({ type: 'warning' });
    expect(wrapper.find(getTypeClass('warning')).exists()).toBeTruthy();

    await wrapper.setProps({ type: 'danger' });
    expect(wrapper.find(getTypeClass('danger')).exists()).toBeTruthy();

    await wrapper.setProps({ type: 'info' });
    expect(wrapper.find(getTypeClass('info')).exists()).toBeTruthy();
  });

  it('size', async () => {
    const wrapper = shallowMount(Button, { props: { size: 'small' } });
    expect(wrapper.find(getSizeClass('small')).exists()).toBeTruthy();

    await wrapper.setProps({ size: 'large' });
    expect(wrapper.find(getSizeClass('large')).exists()).toBeTruthy();
  });

  it('round', async () => {
    const wrapper = shallowMount(Button, { props: { round: true } });
    expect(wrapper.find(roundClass).exists()).toBeTruthy();
  });

  it('circle', async () => {
    const wrapper = shallowMount(Button, { props: { circle: true } });
    expect(wrapper.find(circleClass).exists()).toBeTruthy();
  });

  it('disabled', async () => {
    const handleClick = vi.fn();
    const wrapper = shallowMount(Button, { props: { disabled: true } });

    await wrapper.trigger('click');
    expect(handleClick).not.toBeCalled();
  });
});
