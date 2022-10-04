import { shallowMount } from '@vue/test-utils';
import { expect, describe, it } from 'vitest';
import { Rate } from '../index';
import { useNamespace } from '../../shared/hooks/use-namespace';
import { nextTick } from 'vue';

const ns = useNamespace('rate', true);
const baseClass = ns.b();
const iconClass = ns.e('icon');

describe('rate', () => {
  it('dom', async () => {
    const wrapper = shallowMount(Rate);

    expect(wrapper.find(baseClass).exists()).toBeTruthy();
    wrapper.unmount();
  });

  it('props', async () => {
    const wrapper = shallowMount(Rate, {
      props: {
        count: 10
      }
    });

    expect(wrapper.findAll(iconClass).length).toBe(10);

    wrapper.unmount();
  });

  it('event', async () => {
    const wrapper = shallowMount(Rate, {
      props: {
        count: 10
      }
    });

    expect(wrapper.findAll(iconClass).length).toBe(10);

    const threeIcon = wrapper.findAll(iconClass)[2];
    await threeIcon.trigger('click');
    // change 事件触发,icon 第三个 等于数字3
    expect(wrapper.emitted('change')[0]).toEqual([3]);
    wrapper.unmount();
  });
});
