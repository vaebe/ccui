import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import { DirectoryTree } from '../index'

const fsData = [
  {
    key: 'src',
    title: 'src',
    children: [
      { key: 'src/index.ts', title: 'index.ts', isLeaf: true },
      {
        key: 'src/views',
        title: 'views',
        children: [{ key: 'src/views/home.vue', title: 'home.vue', isLeaf: true }],
      },
    ],
  },
  { key: 'README.md', title: 'README.md', isLeaf: true },
]

describe('directory-tree', () => {
  it('默认全展开（defaultExpandAll=true）', async () => {
    const wrapper = mount(DirectoryTree, { props: { data: fsData } })
    await nextTick()
    // 所有节点（含深层 home.vue）都渲染到 DOM。
    const titles = wrapper.findAll('.ccui-tree__title').map((n) => n.text())
    expect(titles).toContain('src')
    expect(titles).toContain('index.ts')
    expect(titles).toContain('views')
    expect(titles).toContain('home.vue')
    expect(titles).toContain('README.md')
  })

  it('defaultExpandAll=false 时只渲染根层节点', async () => {
    const wrapper = mount(DirectoryTree, { props: { data: fsData, defaultExpandAll: false } })
    await nextTick()
    const titles = wrapper.findAll('.ccui-tree__title').map((n) => n.text())
    expect(titles).toContain('src')
    expect(titles).toContain('README.md')
    expect(titles).not.toContain('index.ts')
    expect(titles).not.toContain('views')
  })

  it('blockNode=true（默认）：节点行带 --block modifier', async () => {
    const wrapper = mount(DirectoryTree, { props: { data: fsData } })
    await nextTick()
    expect(wrapper.find('.ccui-tree__node--block').exists()).toBe(true)
  })

  it('expandAction="click"：点击 folder 节点正文同时切换展开', async () => {
    const wrapper = mount(DirectoryTree, { props: { data: fsData, defaultExpandAll: false } })
    await nextTick()
    // 初始 src 折叠
    expect(wrapper.findAll('.ccui-tree__title').map((n) => n.text())).not.toContain('index.ts')
    // 点击 src 节点的 content（即 .ccui-tree__content）
    const srcNode = wrapper.findAll('.ccui-tree__node').find((n) => n.find('.ccui-tree__title').text() === 'src')!
    await srcNode.find('.ccui-tree__content').trigger('click')
    await nextTick()
    // 现在 src 已展开，子节点出现
    expect(wrapper.findAll('.ccui-tree__title').map((n) => n.text())).toContain('index.ts')
    // 再点一次折叠
    await srcNode.find('.ccui-tree__content').trigger('click')
    await nextTick()
    expect(wrapper.findAll('.ccui-tree__title').map((n) => n.text())).not.toContain('index.ts')
  })

  it('expandAction=false：点击 folder 节点正文不切换展开（只选中）', async () => {
    const wrapper = mount(DirectoryTree, { props: { data: fsData, defaultExpandAll: false, expandAction: false } })
    await nextTick()
    const srcNode = wrapper.findAll('.ccui-tree__node').find((n) => n.find('.ccui-tree__title').text() === 'src')!
    await srcNode.find('.ccui-tree__content').trigger('click')
    await nextTick()
    // 子节点仍未出现
    expect(wrapper.findAll('.ccui-tree__title').map((n) => n.text())).not.toContain('index.ts')
  })

  it('内置 icon：folder 渲染 SVG，file 渲染 SVG（showIcon=true 默认）', async () => {
    const wrapper = mount(DirectoryTree, { props: { data: fsData } })
    await nextTick()
    const icons = wrapper.findAll('.ccui-tree__icon svg')
    // 至少有一个 svg；具体数量等于节点数，因为每个节点都有 icon
    expect(icons.length).toBeGreaterThan(0)
  })

  it('showIcon=false：不渲染任何内置 SVG 图标', async () => {
    const wrapper = mount(DirectoryTree, { props: { data: fsData, showIcon: false } })
    await nextTick()
    const icons = wrapper.findAll('.ccui-tree__icon svg')
    expect(icons.length).toBe(0)
  })

  it('node.raw.icon 优先于内置图标', async () => {
    const data = [
      { key: 'a', title: 'a', icon: { type: 'span', props: { class: 'my-custom-icon' }, children: 'A' } as any },
    ]
    // 直接给 raw.icon 一个简单字符串（VNodeChild 接受 string）
    const dataStr = [{ key: 'a', title: 'a', icon: '★' }]
    const wrapper = mount(DirectoryTree, { props: { data: dataStr as any } })
    await nextTick()
    expect(wrapper.find('.ccui-tree__icon').text()).toBe('★')
    expect(wrapper.find('.ccui-tree__icon svg').exists()).toBe(false)
  })

  it('multiple=true 默认：可选多个节点', async () => {
    const wrapper = mount(DirectoryTree, { props: { data: fsData } })
    await nextTick()
    const allNodes = wrapper.findAll('.ccui-tree__node')
    // 点击 README.md（leaf）
    const readme = allNodes.find((n) => n.find('.ccui-tree__title').text() === 'README.md')!
    await readme.find('.ccui-tree__content').trigger('click')
    // 点击 index.ts（leaf）
    const indexTs = wrapper.findAll('.ccui-tree__node').find((n) => n.find('.ccui-tree__title').text() === 'index.ts')!
    await indexTs.find('.ccui-tree__content').trigger('click', { ctrlKey: true })
    await nextTick()
    const selected = wrapper.findAll('.ccui-tree__node--selected')
    expect(selected.length).toBe(2)
  })

  it('@select 事件转发', async () => {
    const wrapper = mount(DirectoryTree, { props: { data: fsData, defaultExpandAll: false } })
    await nextTick()
    const readme = wrapper.findAll('.ccui-tree__node').find((n) => n.find('.ccui-tree__title').text() === 'README.md')!
    await readme.find('.ccui-tree__content').trigger('click')
    await nextTick()
    expect(wrapper.emitted('select')?.length).toBe(1)
    expect((wrapper.emitted('select')![0] as any[])[0]).toContain('README.md')
  })

  it('@expand 事件在 click 折叠/展开 folder 时触发', async () => {
    const wrapper = mount(DirectoryTree, { props: { data: fsData, defaultExpandAll: false } })
    await nextTick()
    const srcNode = wrapper.findAll('.ccui-tree__node').find((n) => n.find('.ccui-tree__title').text() === 'src')!
    await srcNode.find('.ccui-tree__content').trigger('click')
    await nextTick()
    expect(wrapper.emitted('expand')?.length).toBe(1)
    const payload = wrapper.emitted('expand')![0]
    expect(payload[0] as any[]).toContain('src')
    expect((payload[1] as any).expanded).toBe(true)
  })

  it('v-model:expandedKeys 受控模式：仅父级传值生效', async () => {
    const wrapper = mount(DirectoryTree, { props: { data: fsData, expandedKeys: [] } })
    await nextTick()
    // 受控空数组 → 无任何子节点显示
    expect(wrapper.findAll('.ccui-tree__title').map((n) => n.text())).not.toContain('index.ts')
    // 父级更新
    await wrapper.setProps({ expandedKeys: ['src'] })
    await nextTick()
    expect(wrapper.findAll('.ccui-tree__title').map((n) => n.text())).toContain('index.ts')
  })

  it('用户自定义 icon slot 覆盖内置', async () => {
    const wrapper = mount(DirectoryTree, {
      props: { data: fsData },
      slots: {
        icon: '<i class="custom-icon">X</i>',
      },
    })
    await nextTick()
    expect(wrapper.findAll('.custom-icon').length).toBeGreaterThan(0)
  })
})
