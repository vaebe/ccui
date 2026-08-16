<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@ccui/button'
import { ConfigProvider } from '@ccui/config-provider'
import { Drawer } from '@ccui/drawer'
import { Dropdown } from '@ccui/dropdown'
import { message } from '@ccui/message'
import { Modal } from '@ccui/modal'
import { notification } from '@ccui/notification'
import { Popconfirm } from '@ccui/popconfirm'
import { Popover } from '@ccui/popover'
import { Tooltip } from '@ccui/tooltip'
import { Upload } from '@ccui/upload'
import type { CustomRequestOptions, UploadFile } from '@ccui/upload/src/upload-types'

const dropdownSelection = ref('none')
const persistentDropdownSelection = ref('none')
const confirmation = ref('pending')
const focusConfirmation = ref('pending')
const manualPopover = ref(false)
const manualTooltip = ref(false)

const modalVisible = ref(false)
const strictModalVisible = ref(false)
const destroyModalVisible = ref(false)
const parentModalVisible = ref(false)
const childModalVisible = ref(false)
const modalResult = ref('pending')

const drawerVisible = ref(false)
const strictDrawerVisible = ref(false)
const destroyDrawerVisible = ref(false)
const parentDrawerVisible = ref(false)
const childDrawerVisible = ref(false)
const drawerResult = ref('pending')

const messageCloseResult = ref('pending')
const notificationCloseResult = ref('pending')
let savedMessage: { close: () => void } | undefined
let savedNotification: { close: () => void } | undefined

const successfulUploadFiles = ref<UploadFile[]>([])
const failedUploadFiles = ref<UploadFile[]>([])
const progressingUploadFiles = ref<UploadFile[]>([])
const guardedUploadFiles = ref<UploadFile[]>([])
const limitedUploadFiles = ref<UploadFile[]>([])
const acceptedUploadFiles = ref<UploadFile[]>([])
const successfulRequest = ref('pending')
const guardedUploadReject = ref('none')
const limitedUploadReject = ref('none')

const dropdownItems = [
  { key: 'edit', label: 'Edit record' },
  { key: 'delete', label: 'Delete record', danger: true },
  { key: 'disabled', label: 'Disabled record', disabled: true },
]

function showMessage(type: 'info' | 'success' | 'warning' | 'error' | 'loading') {
  message[type](`E2E ${type} message`, 0)
}

function showMessagePlacements() {
  message.open({ content: 'Message top left', placement: 'topLeft', duration: 0 })
  message.open({ content: 'Message bottom right', placement: 'bottomRight', duration: 0 })
}

function showMessageMaxCount() {
  message.config({ maxCount: 2 })
  message.info('Message oldest', 0)
  message.info('Message middle', 0)
  message.info('Message newest', 0)
}

function showClosableMessage() {
  message.open({
    content: 'Closable message',
    duration: 0,
    showClose: true,
    onClose: () => (messageCloseResult.value = 'closed'),
  })
}

function showStatusMessage() {
  message.open({ content: 'Polite message', duration: 0, role: 'status' })
}

function showSavedMessage() {
  savedMessage = message.info('Saved handle message', 0)
}

function showNotification(type: 'info' | 'success' | 'warning' | 'error') {
  notification[type]({
    title: `E2E ${type} notification`,
    description: `${type} notification body`,
    duration: 0,
  })
}

function showNotificationPlacements() {
  notification.info({ title: 'Notification top left', placement: 'topLeft', duration: 0 })
  notification.info({ title: 'Notification bottom', placement: 'bottom', duration: 0 })
}

function showNotificationMaxCount() {
  notification.config({ maxCount: 2 })
  notification.info({ title: 'Notification oldest', duration: 0 })
  notification.info({ title: 'Notification middle', duration: 0 })
  notification.info({ title: 'Notification newest', duration: 0 })
}

function showClosableNotification() {
  notification.info({
    title: 'Closable notification',
    duration: 0,
    onClose: () => (notificationCloseResult.value = 'closed'),
  })
}

function showStatusNotification() {
  notification.open({ title: 'Polite notification', duration: 0, role: 'status' })
}

function showSavedNotification() {
  savedNotification = notification.info({ title: 'Saved handle notification', duration: 0 })
}

function requestHandle() {
  return { abort: () => undefined }
}

function successfulUploadRequest(options: CustomRequestOptions) {
  successfulRequest.value = `${options.file.name}:${options.file.type}`
  queueMicrotask(() => options.onSuccess({ requestId: 'fixture-success' }))
  return requestHandle()
}

function failedUploadRequest(options: CustomRequestOptions) {
  queueMicrotask(() => options.onError(new Error('fixture upload failed')))
  return requestHandle()
}

function progressingUploadRequest(options: CustomRequestOptions) {
  queueMicrotask(() => options.onProgress(42))
  return requestHandle()
}

function allowUpload(file: File) {
  return !file.name.endsWith('.blocked')
}

function recordGuardedUploadReject(file: File, reason: string) {
  guardedUploadReject.value = `${file.name}:${reason}`
}

function recordLimitedUploadReject(file: File, reason: string) {
  limitedUploadReject.value = `${file.name}:${reason}`
}

function uploadState(file?: UploadFile) {
  let response = ''
  if (typeof file?.response === 'string') response = file.response
  if (file?.response && typeof file.response === 'object' && 'requestId' in file.response) {
    response = String(file.response.requestId)
  }
  return `${file?.name ?? 'none'}:${file?.status ?? 'none'}:${file?.percent ?? 0}:${response}`
}
</script>

<template>
  <section class="fixture overlay-components-fixture" data-testid="overlay-components-fixture">
    <h2>Overlay and provider components</h2>

    <ConfigProvider direction="rtl" :theme="{ algorithm: 'compact', token: { colorPrimary: '#123456' } }">
      <Button data-testid="configured-button">Configured button</Button>
    </ConfigProvider>

    <div class="fixture-group" data-testid="modal-fixtures">
      <Button data-ccui-modal-trigger data-testid="open-basic-modal" native-type="button" @click="modalVisible = true">
        Open basic modal
      </Button>
      <Button data-testid="open-strict-modal" native-type="button" @click="strictModalVisible = true">
        Open strict modal
      </Button>
      <Button data-testid="open-destroy-modal" native-type="button" @click="destroyModalVisible = true">
        Open destroy modal
      </Button>
      <Button data-testid="open-parent-modal" native-type="button" @click="parentModalVisible = true">
        Open parent modal
      </Button>
      <output data-testid="modal-visible">{{ modalVisible }}</output>
      <output data-testid="modal-result">{{ modalResult }}</output>

      <Modal
        v-model:visible="modalVisible"
        title="Basic modal"
        ok-text="Save modal"
        cancel-text="Cancel modal"
        @ok="modalResult = 'ok'"
        @cancel="modalResult = 'cancel'"
      >
        <Button native-type="button">Modal first action</Button>
        <Button native-type="button">Modal last action</Button>
      </Modal>
      <Modal
        v-model:visible="strictModalVisible"
        title="Strict modal"
        :closable="false"
        :mask-closable="false"
        :close-on-esc="false"
        :footer="null"
      >
        <Button native-type="button" @click="strictModalVisible = false">Close strict modal inside</Button>
      </Modal>
      <Modal v-model:visible="destroyModalVisible" title="Destroy modal" destroy-on-close :footer="null">
        <label>Destroy modal input <input data-testid="destroy-modal-input" /></label>
        <Button native-type="button" @click="destroyModalVisible = false">Close destroy modal</Button>
      </Modal>
      <Modal v-model:visible="parentModalVisible" title="Parent modal" :footer="null">
        <Button native-type="button" @click="childModalVisible = true">Open child modal</Button>
        <Button native-type="button" @click="parentModalVisible = false">Close parent modal</Button>
        <Modal v-model:visible="childModalVisible" title="Child modal" :footer="null">
          <Button native-type="button">Child modal action</Button>
        </Modal>
      </Modal>
    </div>

    <div class="fixture-group" data-testid="drawer-fixtures">
      <Button data-testid="open-basic-drawer" native-type="button" @click="drawerVisible = true"
        >Open basic drawer</Button
      >
      <Button data-testid="open-strict-drawer" native-type="button" @click="strictDrawerVisible = true">
        Open strict drawer
      </Button>
      <Button data-testid="open-destroy-drawer" native-type="button" @click="destroyDrawerVisible = true">
        Open destroy drawer
      </Button>
      <Button data-testid="open-parent-drawer" native-type="button" @click="parentDrawerVisible = true">
        Open parent drawer
      </Button>
      <output data-testid="drawer-visible">{{ drawerVisible }}</output>
      <output data-testid="drawer-result">{{ drawerResult }}</output>

      <Drawer v-model:visible="drawerVisible" title="Basic drawer" placement="left" footer="Drawer footer">
        <Button native-type="button" @click="drawerResult = 'action'">Drawer action</Button>
      </Drawer>
      <Drawer
        v-model:visible="strictDrawerVisible"
        title="Strict drawer"
        :closable="false"
        :mask-closable="false"
        :close-on-esc="false"
        :footer="null"
      >
        <Button native-type="button" @click="strictDrawerVisible = false">Close strict drawer inside</Button>
      </Drawer>
      <Drawer v-model:visible="destroyDrawerVisible" title="Destroy drawer" destroy-on-close>
        <label>Destroy drawer input <input data-testid="destroy-drawer-input" /></label>
        <Button native-type="button" @click="destroyDrawerVisible = false">Close destroy drawer</Button>
      </Drawer>
      <Drawer v-model:visible="parentDrawerVisible" title="Parent drawer" :push="{ distance: 120 }">
        <Button native-type="button" @click="childDrawerVisible = true">Open child drawer</Button>
        <Drawer v-model:visible="childDrawerVisible" title="Child drawer">
          <Button native-type="button">Child drawer action</Button>
        </Drawer>
      </Drawer>
    </div>

    <div class="fixture-group" data-testid="small-overlay-fixtures">
      <Dropdown trigger="click" :items="dropdownItems" @select="dropdownSelection = String($event.key)">
        <Button native-type="button">Open dropdown</Button>
      </Dropdown>
      <Dropdown trigger="hover" :items="dropdownItems">
        <Button native-type="button">Hover dropdown</Button>
      </Dropdown>
      <Dropdown trigger="click" :items="dropdownItems" disabled>
        <Button native-type="button">Disabled dropdown</Button>
      </Dropdown>
      <Dropdown
        trigger="click"
        :items="dropdownItems"
        :hide-on-click="false"
        @select="persistentDropdownSelection = String($event.key)"
      >
        <Button native-type="button">Persistent dropdown</Button>
      </Dropdown>
      <output data-testid="dropdown-selection">{{ dropdownSelection }}</output>
      <output data-testid="persistent-dropdown-selection">{{ persistentDropdownSelection }}</output>

      <Popover title="Popover title" content="Popover body" trigger="click" effect="dark">
        <Button native-type="button">Open popover</Button>
      </Popover>
      <Popover title="Focus popover" content="Focus popover body" trigger="focus">
        <Button native-type="button">Focus popover trigger</Button>
      </Popover>
      <Popover title="Disabled popover" content="Disabled popover body" trigger="click" disabled>
        <Button native-type="button">Disabled popover trigger</Button>
      </Popover>
      <Popover v-model:visible="manualPopover" title="Manual popover" content="Manual popover body" trigger="manual">
        <Button native-type="button">Manual popover trigger</Button>
      </Popover>
      <Button native-type="button" @click="manualPopover = !manualPopover">Toggle manual popover</Button>

      <Tooltip content="Helpful tooltip" trigger="hover">
        <Button native-type="button">Hover for tooltip</Button>
      </Tooltip>
      <Tooltip content="Focus tooltip" trigger="focus">
        <Button native-type="button">Focus tooltip trigger</Button>
      </Tooltip>
      <Tooltip content="Click tooltip" trigger="click">
        <Button native-type="button">Click tooltip trigger</Button>
      </Tooltip>
      <Tooltip content="Disabled tooltip" trigger="hover" disabled>
        <Button native-type="button">Disabled tooltip trigger</Button>
      </Tooltip>
      <Tooltip v-model:visible="manualTooltip" content="Manual tooltip" trigger="manual">
        <Button native-type="button">Manual tooltip trigger</Button>
      </Tooltip>
      <Button native-type="button" @click="manualTooltip = !manualTooltip">Toggle manual tooltip</Button>

      <Popconfirm
        title="Delete this item?"
        description="This cannot be undone"
        confirm-text="Delete"
        cancel-text="Keep"
        @confirm="confirmation = 'confirmed'"
        @cancel="confirmation = 'cancelled'"
      >
        <Button native-type="button">Open confirmation</Button>
      </Popconfirm>
      <Popconfirm title="Disabled confirmation" disabled>
        <Button native-type="button">Disabled confirmation trigger</Button>
      </Popconfirm>
      <Popconfirm
        title="Focus confirmation"
        trigger="focus"
        confirm-text="Accept focus confirmation"
        cancel-text="Reject focus confirmation"
        @confirm="focusConfirmation = 'confirmed'"
        @cancel="focusConfirmation = 'cancelled'"
      >
        <Button native-type="button">Focus confirmation trigger</Button>
      </Popconfirm>
      <output data-testid="confirmation-result">{{ confirmation }}</output>
      <output data-testid="focus-confirmation-result">{{ focusConfirmation }}</output>
    </div>

    <div class="fixture-group" data-testid="message-fixtures">
      <Button
        v-for="type in ['info', 'success', 'warning', 'error', 'loading']"
        :key="type"
        native-type="button"
        @click="showMessage(type as any)"
      >
        Show {{ type }} message
      </Button>
      <Button native-type="button" @click="showMessagePlacements">Show message placements</Button>
      <Button native-type="button" @click="showMessageMaxCount">Show message max count</Button>
      <Button native-type="button" @click="showClosableMessage">Show closable message</Button>
      <Button native-type="button" @click="showStatusMessage">Show status message</Button>
      <Button native-type="button" @click="showSavedMessage">Show saved message</Button>
      <Button native-type="button" @click="savedMessage?.close()">Close saved message</Button>
      <Button native-type="button" @click="message.destroy()">Destroy messages</Button>
      <output data-testid="message-close-result">{{ messageCloseResult }}</output>
    </div>

    <div class="fixture-group" data-testid="notification-fixtures">
      <Button
        v-for="type in ['info', 'success', 'warning', 'error']"
        :key="type"
        native-type="button"
        @click="showNotification(type as any)"
      >
        Show {{ type }} notification
      </Button>
      <Button native-type="button" @click="showNotificationPlacements">Show notification placements</Button>
      <Button native-type="button" @click="showNotificationMaxCount">Show notification max count</Button>
      <Button native-type="button" @click="showClosableNotification">Show closable notification</Button>
      <Button native-type="button" @click="showStatusNotification">Show status notification</Button>
      <Button native-type="button" @click="showSavedNotification">Show saved notification</Button>
      <Button native-type="button" @click="savedNotification?.close()">Close saved notification</Button>
      <Button native-type="button" @click="notification.destroy()">Destroy notifications</Button>
      <output data-testid="notification-close-result">{{ notificationCloseResult }}</output>
    </div>

    <div class="fixture-group" data-testid="advanced-upload-fixtures">
      <div data-testid="successful-upload-fixture">
        <Upload
          accept=".txt,text/plain"
          :custom-request="successfulUploadRequest"
          @update:file-list="successfulUploadFiles = $event"
        />
        <output data-testid="successful-upload-state">{{ uploadState(successfulUploadFiles[0]) }}</output>
        <output data-testid="successful-request">{{ successfulRequest }}</output>
      </div>

      <div data-testid="failed-upload-fixture">
        <Upload :custom-request="failedUploadRequest" @update:file-list="failedUploadFiles = $event" />
        <output data-testid="failed-upload-state">{{ uploadState(failedUploadFiles[0]) }}</output>
      </div>

      <div data-testid="progressing-upload-fixture">
        <Upload :custom-request="progressingUploadRequest" @update:file-list="progressingUploadFiles = $event" />
        <output data-testid="progressing-upload-state">{{ uploadState(progressingUploadFiles[0]) }}</output>
      </div>

      <div data-testid="guarded-upload-fixture">
        <Upload
          v-model:file-list="guardedUploadFiles"
          multiple
          :before-upload="allowUpload"
          @reject="recordGuardedUploadReject"
        />
        <output data-testid="guarded-upload-count">{{ guardedUploadFiles.length }}</output>
        <output data-testid="guarded-upload-reject">{{ guardedUploadReject }}</output>
      </div>

      <div data-testid="limited-upload-fixture">
        <Upload v-model:file-list="limitedUploadFiles" multiple :max-count="2" @reject="recordLimitedUploadReject" />
        <output data-testid="limited-upload-count">{{ limitedUploadFiles.length }}</output>
        <output data-testid="limited-upload-reject">{{ limitedUploadReject }}</output>
      </div>

      <div data-testid="accepted-upload-fixture">
        <Upload v-model:file-list="acceptedUploadFiles" accept="image/png,.txt" multiple />
        <output data-testid="accepted-upload-types">
          {{ acceptedUploadFiles.map((file) => file.type).join(',') }}
        </output>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fixture-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-block: 16px;
  padding-block: 12px;
  border-block-start: 1px solid #e2e8f0;
}
</style>
