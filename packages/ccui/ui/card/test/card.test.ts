import { shallowMount } from '@vue/test-utils';
import { expect, test, it } from 'vitest';
import { Card } from '../index';
import { useNamespace } from '../../shared/hooks/use-namespace';

const ns = useNamespace('card');

test('mount component', () => {
  const wrapper = shallowMount(Card, {
    props: {
      shadow: 'hover'
    }
  });

  it('Card demo has created successfully', async () => {
    expect(wrapper).toBeTruthy();
  });

  it('Card should have content', () => {
    const container = wrapper.find(ns.b());
    expect(container.exists()).toBeTruthy();
  });

  it('Card should have header', () => {
    const container = wrapper.find(ns.m('header'));
    expect(container.exists()).toBeTruthy();
  });
});
