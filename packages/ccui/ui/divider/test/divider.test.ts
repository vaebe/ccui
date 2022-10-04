import { shallowMount } from '@vue/test-utils';
import { expect, describe, it } from 'vitest';
import { Divider } from '../index';
import { useNamespace } from '../../shared/hooks/use-namespace';

const ns = useNamespace('divider', true);
const baseClass = ns.b();
const verticalClass = ns.m('vertical');

describe('Divider', () => {
  it('dom', async () => {
    const wrapper = shallowMount(Divider);

    expect(wrapper.find(baseClass).exists()).toBeTruthy();

    wrapper.unmount();
  });

  it('props', async () => {
    const wrapper = shallowMount(Divider, {
      props: {
        direction: 'vertical'
      }
    });

    expect(wrapper.find(verticalClass).exists()).toBeTruthy();

    wrapper.unmount();
  });

  it('slots', async () => {
    const wrapper = shallowMount(Divider, {
      slots: {
        default: '上海'
      }
    });

    expect(wrapper.find(baseClass).text()).toBe('上海');

    wrapper.unmount();
  });
});
