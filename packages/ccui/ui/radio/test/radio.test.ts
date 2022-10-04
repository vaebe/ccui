import { shallowMount } from '@vue/test-utils';
import { expect, describe, it } from 'vitest';
import { Radio } from '../index';
import { useNamespace } from '../../shared/hooks/use-namespace';

const ns = useNamespace('radio', true);
const baseClass = ns.b();

describe('radio', () => {
  it('dom', async () => {
    const wrapper = shallowMount(Radio);

    expect(wrapper.find(baseClass).exists()).toBeTruthy();

    wrapper.unmount();
  });
});
