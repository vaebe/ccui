import { shallowMount } from '@vue/test-utils';
import { expect, describe, it } from 'vitest';
import { Tabs } from '../index';
import { useNamespace } from '../../shared/hooks/use-namespace';

// todo tabs-tab 测试用例待补充
const ns = useNamespace('tabs', true);
const baseClass = ns.b();

describe('Tabs', () => {
  it('dom', async () => {
    const wrapper = shallowMount(Tabs);

    expect(wrapper.find(baseClass).exists()).toBeTruthy();
    wrapper.unmount();
  });
});
