import { shallowMount } from '@vue/test-utils';
import { expect, describe, it } from 'vitest';
import { Avatar } from '../index';
import { useNamespace } from '../../shared/hooks/use-namespace';

const ns = useNamespace('avatar', true);
const styleClass = ns.e('style');

describe('avatar', () => {
  it('chinese name pick last two character', async () => {
    const wrapper = shallowMount(Avatar, {
      props: {
        name: '组件头像'
      }
    });
    expect(wrapper.find(styleClass).text()).toBe('头像');

    wrapper.unmount();
  });

  it('should only show one character when width less than 30', () => {
    const wrapper = shallowMount(Avatar, {
      props: {
        name: '组件头像',
        width: 25
      }
    });
    expect(wrapper.find(styleClass).text()).toBe('组');

    wrapper.unmount();
  });

  it('one word name pick first two character', () => {
    const name = 'MyAvatar';
    const wrapper = shallowMount(Avatar, {
      props: {
        name
      }
    });
    expect(wrapper.find(styleClass).text()).toBe('MY');

    wrapper.unmount();
  });

  it('display origin name when name length less than 2', () => {
    const wrapper = shallowMount(Avatar, {
      props: {
        name: 'A'
      }
    });

    expect(wrapper.find(styleClass).text()).toBe('A');

    wrapper.unmount();
  });
});
