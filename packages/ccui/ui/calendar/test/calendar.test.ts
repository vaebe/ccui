import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Calendar } from '../index';
import { useNamespace } from '../../shared/hooks/use-namespace';

const ns = useNamespace('calendar', true);
const baseClass = ns.b();
const dayClass = ns.em('day-box', 'day');
const currentDateClass = '.current-date';

describe('button', () => {
  it('dom', () => {
    const wrapper = shallowMount(Calendar, {
      props: { modelValue: new Date() }
    });

    // 元素是否存在
    expect(wrapper.find(baseClass).exists()).toBeTruthy();

    // 日期生成是否正确
    expect(wrapper.findAll(dayClass).length).toBe(42);

    wrapper.unmount();
  });

  it('props', async () => {
    const wrapper = shallowMount(Calendar, {
      props: { modelValue: new Date() }
    });

    await wrapper.setProps({ modelValue: '2022-10-10' });

    expect(wrapper.find(currentDateClass).text()).toBe('10');

    wrapper.unmount();
  });

  it('slots', async () => {
    const wrapper = shallowMount(Calendar, {
      props: { modelValue: new Date() },
      slots: {
        dateCell: `<template #dateCell="{isSelected, date, day}">
            {{isSelected ? '当前选中日期' : day}}
          </template>`
      }
    });

    // slot 元素正确加载
    expect(wrapper.find(currentDateClass).exists()).toBeTruthy();

    // slot 内容正确渲染
    expect(wrapper.find(currentDateClass).text()).toBe('当前选中日期');

    wrapper.unmount();
  });

  it('event', async () => {
    const wrapper = shallowMount(Calendar, {
      props: { modelValue: new Date() }
    });

    // 断言 change 事件是否正确触发
    // 获取第一个日期
    const firstDate = wrapper.find(dayClass).text();

    // 以第一个 day 元素触发 click 事件更新选中数据
    await wrapper.find(dayClass).trigger('click');

    // 验证是否触发emit事件
    expect(wrapper.emitted('change')).toBeTruthy();

    // 获取当前选中数据进行比对
    expect(wrapper.find(currentDateClass).text()).toBe(firstDate);

    wrapper.unmount();
  });
});
