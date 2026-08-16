<script setup lang="ts">
import type { FormInstance, FormRules } from '@ccui/form'
import type { TableColumn, TableSelectionKey, TableSortOrder, TableSorter } from '@ccui/table'
import type { CustomRequestOptions, UploadFile } from '@ccui/upload/src/upload-types'
import { computed, nextTick, reactive, ref } from 'vue'
import { Button } from '@ccui/button'
import { Drawer } from '@ccui/drawer'
import { Form, FormItem } from '@ccui/form'
import { Input } from '@ccui/input'
import { Modal } from '@ccui/modal'
import { Panel, Splitter } from '@ccui/splitter'
import { Table } from '@ccui/table'
import { Tab, Tabs } from '@ccui/tabs'
import { Upload } from '@ccui/upload'
import DisplayFixtures from './fixtures/DisplayFixtures.vue'
import InputFixtures from './fixtures/InputFixtures.vue'
import NavigationDataFixtures from './fixtures/NavigationDataFixtures.vue'
import OverlayFixtures from './fixtures/OverlayFixtures.vue'

const requestedFixture = new URLSearchParams(window.location.search).get('fixture')
const showFixture = (fixture: string) => !requestedFixture || requestedFixture === fixture

const formModel = reactive({ email: '' })
const workflowFormRef = ref<FormInstance>()
const workflowFormModel = reactive({ name: 'Initial name' })
const workflowSubmitResult = ref('pending')
const workflowFailureCount = ref(0)
const asyncFormModel = reactive({ code: '' })
const asyncValidationEvent = ref('none')
const triggerFormModel = reactive({ value: '' })
const triggerValidationEvent = ref('none')

const asyncFormRules: FormRules = {
  code: {
    trigger: 'blur',
    validator: async (_rule, value) => {
      await Promise.resolve()
      return value === 'approved' || 'Code rejected asynchronously'
    },
  },
}

const triggerFormRules: FormRules = {
  value: [
    { pattern: /^\d+$/, trigger: 'change', message: 'Change requires digits' },
    { required: true, trigger: 'blur', message: 'Blur requires a value' },
  ],
}

function recordWorkflowSubmit(valid: boolean) {
  workflowSubmitResult.value = valid ? `success:${workflowFormModel.name}` : 'failed'
}

function recordValidation(target: typeof asyncValidationEvent, field: string, valid: boolean, message: string) {
  target.value = `${field}:${valid}:${message || 'none'}`
}

function recordAsyncValidation(field: string, valid: boolean, message: string) {
  recordValidation(asyncValidationEvent, field, valid, message)
}

function recordTriggerValidation(field: string, valid: boolean, message: string) {
  recordValidation(triggerValidationEvent, field, valid, message)
}

const modalVisible = ref(false)
const drawerVisible = ref(false)

async function openOverlays() {
  modalVisible.value = true
  await nextTick()
  drawerVisible.value = true
}

const columns: TableColumn[] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age', sorter: true },
]
const rows = [
  { id: 1, name: 'Alice', age: 30, detail: 'Alice profile' },
  { id: 2, name: 'Bob', age: 10, detail: 'Bob profile' },
  { id: 3, name: 'Carol', age: 20, detail: 'Carol profile' },
]

const selectedRowKeys = ref<TableSelectionKey[]>([])
const selectedRowEvent = ref('none')
const expandedRowKeys = ref<TableSelectionKey[]>([])
const expandedRowEvent = ref('none')
const specialTableRows = ref<typeof rows>([])
const specialTableLoading = ref(true)
const controlledSortOrder = ref<TableSortOrder>('descend')
const controlledSortEvent = ref('none')

const controlledColumns = computed<TableColumn[]>(() => [
  { title: 'Pinned name', dataIndex: 'name', key: 'name', width: 180, fixed: 'left' },
  {
    title: 'Controlled age',
    dataIndex: 'age',
    key: 'age',
    width: 160,
    fixed: 'right',
    sorter: true,
    sortOrder: controlledSortOrder.value,
  },
])

function updateSelectedRows(keys: TableSelectionKey[], selectedRows: typeof rows) {
  selectedRowKeys.value = keys
  selectedRowEvent.value = `${keys.join(',')}:${selectedRows.map((row) => row.name).join(',')}`
}

function updateExpandedRows(keys: TableSelectionKey[]) {
  expandedRowKeys.value = keys
}

function recordExpandedRow(expanded: boolean, record: (typeof rows)[number]) {
  expandedRowEvent.value = `${expanded}:${record.name}`
}

function renderExpandedRow(record: (typeof rows)[number]) {
  return record.detail
}

function updateControlledSorter(sorter: TableSorter) {
  controlledSortOrder.value = sorter.order
  controlledSortEvent.value = `${sorter.columnKey}:${sorter.order}`
}

const activeTab = ref('one')
const uploadAbortCount = ref(0)
const controlledUploadFiles = ref<UploadFile[]>([])

function uploadRequest(_options: CustomRequestOptions) {
  return {
    abort: () => {
      uploadAbortCount.value++
    },
  }
}

function controlledUploadRequest(options: CustomRequestOptions) {
  options.onProgress(40)
  options.onSuccess({ requestId: 'controlled-success' })
  return { abort: () => undefined }
}

function controlledUploadState(file?: UploadFile) {
  const response =
    file?.response && typeof file.response === 'object' && 'requestId' in file.response
      ? String(file.response.requestId)
      : 'none'
  return `${file?.name ?? 'none'}:${file?.status ?? 'none'}:${file?.percent ?? 0}:${response}`
}
</script>

<template>
  <div class="fixture-app">
    <h1>CCUI browser fixtures</h1>
    <div class="fixture-grid">
      <DisplayFixtures v-if="showFixture('display')" />
      <InputFixtures v-if="showFixture('inputs')" />
      <NavigationDataFixtures v-if="showFixture('navigation-data')" />
      <OverlayFixtures v-if="showFixture('overlays')" />

      <section v-if="showFixture('core')" class="fixture" data-testid="form-fixture">
        <h2>Input and Form</h2>
        <Form :model="formModel" :rules="{ email: { required: true, message: 'Email is required' } }">
          <FormItem label="Email" name="email" html-for="email-input">
            <Input id="email-input" v-model="formModel.email" name="email" autocomplete="email" />
          </FormItem>
        </Form>

        <div data-testid="workflow-form-fixture">
          <Form
            ref="workflowFormRef"
            :model="workflowFormModel"
            :rules="{ name: { required: true, message: 'Name is required' } }"
            @submit="recordWorkflowSubmit"
            @validate-failed="workflowFailureCount++"
          >
            <FormItem label="Workflow name" name="name" html-for="workflow-name-input">
              <Input id="workflow-name-input" v-model="workflowFormModel.name" />
            </FormItem>
            <Button native-type="submit">Submit workflow form</Button>
            <Button native-type="button" @click="workflowFormRef?.resetFields()">Reset workflow form</Button>
            <Button native-type="button" @click="workflowFormRef?.clearValidate()">Clear workflow validation</Button>
          </Form>
          <output data-testid="workflow-submit-result">{{ workflowSubmitResult }}</output>
          <output data-testid="workflow-failure-count">{{ workflowFailureCount }}</output>
          <output data-testid="workflow-model-name">{{ workflowFormModel.name }}</output>
        </div>

        <div data-testid="async-form-fixture">
          <Form :model="asyncFormModel" :rules="asyncFormRules" @validate="recordAsyncValidation">
            <FormItem label="Approval code" name="code" html-for="approval-code-input">
              <Input id="approval-code-input" v-model="asyncFormModel.code" />
            </FormItem>
          </Form>
          <output data-testid="async-validation-event">{{ asyncValidationEvent }}</output>
        </div>

        <div data-testid="trigger-form-fixture">
          <Form :model="triggerFormModel" :rules="triggerFormRules" @validate="recordTriggerValidation">
            <FormItem label="Triggered value" name="value" html-for="trigger-value-input">
              <Input id="trigger-value-input" v-model="triggerFormModel.value" />
            </FormItem>
          </Form>
          <output data-testid="trigger-validation-event">{{ triggerValidationEvent }}</output>
        </div>
      </section>

      <section v-if="showFixture('core')" class="fixture" data-testid="overlay-fixture">
        <h2>Modal and Drawer</h2>
        <Button data-testid="open-overlays" native-type="button" @click="openOverlays">Open overlays</Button>
        <Modal v-model:visible="modalVisible" title="E2E modal">
          <Button native-type="button">Modal action</Button>
        </Modal>
        <Drawer v-model:visible="drawerVisible" title="E2E drawer">
          <Button data-testid="close-underlying-modal" native-type="button" @click="modalVisible = false">
            Close underlying modal
          </Button>
          <Button native-type="button">Drawer last action</Button>
        </Drawer>
      </section>

      <section v-if="showFixture('core')" class="fixture" data-testid="table-section">
        <h2>Table</h2>
        <div data-testid="table-fixture">
          <Table :columns="columns" :data-source="rows" row-key="id" />
        </div>

        <div data-testid="selection-table-fixture">
          <Table
            :columns="columns"
            :data-source="rows"
            row-key="id"
            :row-selection="{ selectedRowKeys, onChange: updateSelectedRows }"
          />
          <output data-testid="selected-row-event">{{ selectedRowEvent }}</output>
        </div>

        <div data-testid="expandable-table-fixture">
          <Table
            :columns="columns"
            :data-source="rows"
            row-key="id"
            :expandable="{
              expandedRowKeys,
              expandedRowRender: renderExpandedRow,
              onChange: updateExpandedRows,
              onExpand: recordExpandedRow,
            }"
          />
          <output data-testid="expanded-row-event">{{ expandedRowEvent }}</output>
        </div>

        <div data-testid="state-table-fixture">
          <Button native-type="button" @click="specialTableLoading = false">Stop table loading</Button>
          <Button native-type="button" @click="specialTableRows = rows">Load table rows</Button>
          <Table :columns="columns" :data-source="specialTableRows" :loading="specialTableLoading" row-key="id">
            <template #empty>No matching records</template>
          </Table>
        </div>

        <div data-testid="controlled-table-fixture">
          <Table
            :columns="controlledColumns"
            :data-source="rows"
            row-key="id"
            :scroll="{ x: 640, y: 120 }"
            @update:sorter="updateControlledSorter"
          />
          <output data-testid="controlled-sort-event">{{ controlledSortEvent }}</output>
        </div>
      </section>

      <section v-if="showFixture('core')" class="fixture" data-testid="tabs-fixture">
        <h2>Tabs</h2>
        <Tabs v-model="activeTab">
          <Tab name="one" label="One"><p data-testid="tab-one-panel">First panel</p></Tab>
          <Tab name="two" label="Two" disabled><p>Disabled panel</p></Tab>
          <Tab name="three" label="Three"><p data-testid="tab-three-panel">Third panel</p></Tab>
        </Tabs>
        <Button data-testid="activate-third-tab" native-type="button" @click="activeTab = 'three'"
          >Activate third</Button
        >
      </section>

      <section v-if="showFixture('core')" class="fixture" data-testid="upload-fixture">
        <h2>Upload</h2>
        <div data-testid="basic-upload-fixture">
          <Upload :custom-request="uploadRequest" />
          <p class="fixture-output" data-testid="upload-abort-count">{{ uploadAbortCount }}</p>
        </div>
        <div data-testid="controlled-upload-fixture">
          <Upload v-model:file-list="controlledUploadFiles" :custom-request="controlledUploadRequest" />
          <output data-testid="controlled-upload-state">{{ controlledUploadState(controlledUploadFiles[0]) }}</output>
        </div>
      </section>

      <section v-if="showFixture('core')" class="fixture" data-testid="splitter-fixture">
        <h2>Splitter</h2>
        <Splitter class="splitter-fixture">
          <Panel :default-size="200" :min="100" :max="300">
            <div class="splitter-pane">Left</div>
          </Panel>
          <Panel :default-size="300" :min="100">
            <div class="splitter-pane">Right</div>
          </Panel>
        </Splitter>
      </section>
    </div>
  </div>
</template>
