import { shallowMount } from '@vue/test-utils';
import { expect, describe, it } from 'vitest';
import { CheckBox } from '../index';
import { useNamespace } from '../../shared/hooks/use-namespace';

const ns = useNamespace('check-box', true);
const baseClass = ns.b();

describe('checkBox', () => {
  it('dom', async () => {
    const wrapper = shallowMount(CheckBox);

    expect(wrapper.find(baseClass).exists()).toBeTruthy();

    wrapper.unmount();
  });
});
