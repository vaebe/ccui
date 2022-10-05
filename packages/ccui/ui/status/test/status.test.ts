import { shallowMount } from '@vue/test-utils';
import { expect, describe, it } from 'vitest';
import { Status } from '../index';
import { useNamespace } from '../../shared/hooks/use-namespace';

const ns = useNamespace('status', true);
const baseClass = ns.b();
const typeSuccessClass = ns.m('success');

describe('rate', () => {
  it('dom', async () => {
    const wrapper = shallowMount(Status);

    expect(wrapper.find(baseClass).exists()).toBeTruthy();
    wrapper.unmount();
  });

  it('props', async () => {
    const wrapper = shallowMount(Status, {
      props: {
        type: 'success'
      }
    });

    expect(wrapper.find(typeSuccessClass).exists()).toBeTruthy();

    wrapper.unmount();
  });
});
