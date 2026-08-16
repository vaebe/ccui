<script setup lang="ts">
import type { TreeNodeData } from '@ccui/tree/src/tree-types'
import { ref } from 'vue'
import { Affix } from '@ccui/affix'
import { Anchor } from '@ccui/anchor'
import { Button } from '@ccui/button'
import { Calendar } from '@ccui/calendar'
import { Carousel } from '@ccui/carousel'
import { Collapse, CollapseItem } from '@ccui/collapse'
import { BackTop, FloatButton } from '@ccui/float-button'
import { Image } from '@ccui/image'
import { ImagePreview } from '@ccui/image-preview'
import { Masonry } from '@ccui/masonry'
import { Menu } from '@ccui/menu'
import { Pagination } from '@ccui/pagination'
import { Table } from '@ccui/table'
import { TableColumn } from '@ccui/table-column'
import { TableColumnGroup } from '@ccui/table-column-group'
import { TableSummary } from '@ccui/table-summary'
import { Tree } from '@ccui/tree'

const anchorItems = [
  { href: '#e2e-anchor-a', title: 'Anchor section A' },
  { href: '#e2e-anchor-b', title: 'Anchor section B' },
]

const calendarValue = ref('2026-03-15')
const carouselValue = ref(0)
const collapseValue = ref<string[]>([])
const accordionValue = ref<string | number>('')
const floatButtonClicks = ref(0)

function makeImage(color: string, label: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="100"><rect width="160" height="100" fill="${color}"/><text x="80" y="55" text-anchor="middle" fill="white" font-size="20">${label}</text></svg>`,
  )}`
}

const imageSource = makeImage('#2563eb', 'Image')
const brokenImageSource = 'data:image/png;base64,broken'
const previewItems = [
  { src: makeImage('#dc2626', 'A'), alt: 'Preview A' },
  { src: makeImage('#16a34a', 'B'), alt: 'Preview B' },
  { src: makeImage('#7c3aed', 'C'), alt: 'Preview C' },
]

const menuSelectedKeys = ref<Array<string | number>>([])
const menuOpenKeys = ref<Array<string | number>>([])
const menuItems = [
  { key: 'home', label: 'Menu Home' },
  {
    key: 'group',
    label: 'Menu Group',
    children: [
      { key: 'sub-one', label: 'Sub One' },
      { key: 'sub-disabled', label: 'Sub Disabled', disabled: true },
    ],
  },
  { key: 'about', label: 'Menu About' },
]

const currentPage = ref(1)
const pageSize = ref(10)
const tableRows = [
  { key: 'alice', firstName: 'Alice', lastName: 'Adams', age: 30 },
  { key: 'bob', firstName: 'Bob', lastName: 'Brown', age: 10 },
  { key: 'carol', firstName: 'Carol', lastName: 'Clark', age: 20 },
]

const treeSelectedKeys = ref<Array<string | number>>([])
const treeExpandedKeys = ref<Array<string | number>>([])
const treeData = [
  {
    key: 'root',
    title: 'Tree Root',
    children: [
      { key: 'child-one', title: 'Tree Child One' },
      { key: 'child-two', title: 'Tree Child Two' },
    ],
  },
  { key: 'leaf', title: 'Tree Leaf' },
]

const advancedTreeData = ref<TreeNodeData[]>([
  {
    key: 'advanced-root',
    title: 'Advanced Root',
    children: [
      { key: 'check-one', title: 'Check One' },
      { key: 'check-disabled', title: 'Check Disabled', disabled: true },
      { key: 'filter-leaf', title: 'Filter Match' },
    ],
  },
  { key: 'lazy-root', title: 'Lazy Root', isLeaf: false },
])
const advancedSelectedKeys = ref<Array<string | number>>([])
const advancedCheckedKeys = ref<Array<string | number>>([])
const advancedExpandedKeys = ref<Array<string | number>>(['advanced-root'])
const treeSearch = ref('')
const treeLoadCount = ref(0)

async function loadTreeNode(node: TreeNodeData) {
  treeLoadCount.value++
  node.children = [{ key: 'lazy-child', title: 'Lazy Child', isLeaf: true }]
}

function filterAdvancedTree(node: TreeNodeData) {
  return String(node.title ?? '')
    .toLowerCase()
    .includes(treeSearch.value.toLowerCase())
}

function updateAdvancedTreeExternally() {
  advancedSelectedKeys.value = ['filter-leaf']
  advancedCheckedKeys.value = ['check-one']
  advancedExpandedKeys.value = ['advanced-root']
}
</script>

<template>
  <div class="navigation-data-fixtures" data-testid="navigation-data-fixtures">
    <h1>Navigation and data fixtures</h1>

    <section class="fixture" data-testid="affix-fixture">
      <h2>Affix</h2>
      <div id="e2e-affix-scroll" class="local-scroll">
        <div class="spacer">Scroll to pin the marker</div>
        <Affix target="#e2e-affix-scroll" :offset-top="0">
          <div data-testid="affix-marker">Affix marker</div>
        </Affix>
        <div class="spacer" />
      </div>
    </section>

    <section class="fixture" data-testid="anchor-fixture">
      <h2>Anchor</h2>
      <Anchor :items="anchorItems" scroll-container="#e2e-anchor-scroll" :affix="false" />
      <div id="e2e-anchor-scroll" class="local-scroll anchor-scroll">
        <article id="e2e-anchor-a">Anchor target A</article>
        <article id="e2e-anchor-b">Anchor target B</article>
      </div>
    </section>

    <section class="fixture" data-testid="calendar-fixture">
      <h2>Calendar</h2>
      <Calendar v-model="calendarValue">
        <template #header="{ currentMonth, changeMonth }">
          <div class="calendar-header">
            <output data-testid="calendar-month">{{ currentMonth }}</output>
            <Button data-testid="calendar-next" native-type="button" @click="changeMonth('nextMonth')"
              >Next month</Button
            >
          </div>
        </template>
      </Calendar>
      <output data-testid="calendar-value">{{ calendarValue }}</output>
    </section>

    <section class="fixture" data-testid="carousel-fixture">
      <h2>Carousel</h2>
      <Carousel v-model="carouselValue" :autoplay="false" :arrows="true" :duration="0">
        <div class="carousel-slide">Carousel slide one</div>
        <div class="carousel-slide">Carousel slide two</div>
        <div class="carousel-slide">Carousel slide three</div>
      </Carousel>
      <output data-testid="carousel-value">{{ carouselValue }}</output>
    </section>

    <section class="fixture" data-testid="collapse-fixture">
      <h2>Collapse</h2>
      <div data-testid="regular-collapse">
        <Collapse v-model="collapseValue">
          <CollapseItem name="one" title="Collapse panel one">Collapse content one</CollapseItem>
          <CollapseItem name="two" title="Collapse panel two">Collapse content two</CollapseItem>
          <CollapseItem name="disabled" title="Collapse disabled" disabled>Disabled content</CollapseItem>
        </Collapse>
      </div>
      <Button data-testid="collapse-external" native-type="button" @click="collapseValue = ['two']"
        >Open panel two</Button
      >
      <div data-testid="accordion-collapse">
        <Collapse v-model="accordionValue" accordion>
          <CollapseItem name="one" title="Accordion one">Accordion content one</CollapseItem>
          <CollapseItem name="two" title="Accordion two">Accordion content two</CollapseItem>
        </Collapse>
      </div>
    </section>

    <section class="fixture" data-testid="float-button-fixture">
      <h2>FloatButton and BackTop</h2>
      <FloatButton description="Fixture action" :badge="2" @click="floatButtonClicks++" />
      <output data-testid="float-button-clicks">{{ floatButtonClicks }}</output>
      <div id="e2e-backtop-scroll" class="local-scroll">
        <div class="backtop-content">Scroll down for BackTop</div>
      </div>
      <BackTop target="#e2e-backtop-scroll" :visibility-height="80" :duration="0">
        <span aria-hidden="true">↑</span>
      </BackTop>
    </section>

    <section class="fixture" data-testid="image-fixture">
      <h2>Image and ImagePreview</h2>
      <Image :src="imageSource" alt="Fixture image" :width="160" :height="100" preview />
      <Image :src="brokenImageSource" :fallback="imageSource" alt="Fallback image" :width="160" :height="100" />
      <ImagePreview :items="previewItems" />
    </section>

    <section class="fixture" data-testid="masonry-fixture">
      <h2>Masonry</h2>
      <Masonry :columns="{ xs: 1, sm: 2, lg: 3 }" :gutter="12" sequential>
        <div v-for="item in 7" :key="item" class="masonry-card">Masonry {{ item }}</div>
      </Masonry>
    </section>

    <section class="fixture" data-testid="menu-fixture">
      <h2>Menu</h2>
      <Menu v-model:selected-keys="menuSelectedKeys" v-model:open-keys="menuOpenKeys" :items="menuItems" />
      <output data-testid="menu-selection">{{ menuSelectedKeys.join(',') }}</output>
    </section>

    <section class="fixture" data-testid="pagination-fixture">
      <h2>Pagination</h2>
      <Pagination
        v-model:current="currentPage"
        v-model:page-size="pageSize"
        :total="50"
        show-size-changer
        show-quick-jumper
      />
      <output data-testid="pagination-value">{{ currentPage }}</output>
      <output data-testid="pagination-size">{{ pageSize }}</output>
    </section>

    <section class="fixture" data-testid="declarative-table-fixture">
      <h2>Declarative table components</h2>
      <Table :data-source="tableRows" row-key="key">
        <TableColumnGroup title="Person">
          <TableColumn title="First name" data-index="firstName" column-key="firstName" />
          <TableColumn title="Last name" data-index="lastName" column-key="lastName" />
        </TableColumnGroup>
        <TableColumn title="Age" data-index="age" column-key="age" sorter />
        <TableSummary>
          <tr data-testid="table-summary-row">
            <td colspan="2">Total age</td>
            <td>60</td>
          </tr>
        </TableSummary>
      </Table>
    </section>

    <section class="fixture" data-testid="tree-fixture">
      <h2>Tree</h2>
      <div data-testid="basic-tree">
        <Tree
          v-model:selected-keys="treeSelectedKeys"
          v-model:expanded-keys="treeExpandedKeys"
          :data="treeData"
          block-node
        />
      </div>
      <output data-testid="tree-selection">{{ treeSelectedKeys.join(',') }}</output>
      <div data-testid="advanced-tree">
        <Tree
          v-model:selected-keys="advancedSelectedKeys"
          v-model:checked-keys="advancedCheckedKeys"
          v-model:expanded-keys="advancedExpandedKeys"
          :data="advancedTreeData"
          :load-data="loadTreeNode"
          :search-value="treeSearch"
          :filter-tree-node="filterAdvancedTree"
          checkable
          block-node
        />
      </div>
      <output data-testid="advanced-tree-selection">{{ advancedSelectedKeys.join(',') }}</output>
      <output data-testid="advanced-tree-checked">{{ advancedCheckedKeys.join(',') }}</output>
      <output data-testid="tree-load-count">{{ treeLoadCount }}</output>
      <Button data-testid="tree-filter" native-type="button" @click="treeSearch = 'match'">Filter tree</Button>
      <Button data-testid="tree-external-update" native-type="button" @click="updateAdvancedTreeExternally">
        Update tree externally
      </Button>
    </section>
  </div>
</template>

<style scoped>
.navigation-data-fixtures {
  width: min(1120px, calc(100% - 32px));
  margin: 24px auto 80px;
}

.fixture {
  margin-block: 20px;
  padding: 20px;
  overflow: visible;
  border: 1px solid #dbe3ee;
  border-radius: 12px;
  background: #fff;
}

.fixture h2 {
  margin-block: 0 16px;
}

.local-scroll {
  position: relative;
  height: 160px;
  overflow: auto;
  border: 1px solid #94a3b8;
}

.spacer {
  height: 180px;
  padding: 12px;
}

[data-testid='affix-marker'] {
  padding: 8px 12px;
  background: #dbeafe;
}

.anchor-scroll article {
  height: 220px;
  padding: 16px;
}

.anchor-scroll article:nth-child(2) {
  background: #f1f5f9;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-block-end: 12px;
}

.carousel-slide {
  display: grid;
  height: 100px;
  place-items: center;
  background: #e0e7ff;
}

.backtop-content {
  height: 420px;
  padding: 12px;
}

.masonry-card {
  min-height: 44px;
  padding: 10px;
  border: 1px solid #cbd5e1;
}
</style>
