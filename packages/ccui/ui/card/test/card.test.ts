import { shallowMount } from '@vue/test-utils';
import { expect, test, it } from 'vitest';
import { Card } from '../index';

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
    const container = wrapper.find('.okUi-card');
    expect(container.exists()).toBeTruthy();
  });

  it('Card should have header', () => {
    const container = wrapper.find('.okUi-card-header');
    expect(container.exists()).toBeTruthy();
  });
});
