<script setup lang="ts">
import { defineComponent, h, reactive, ref } from 'vue'
import { AutoComplete } from '@ccui/auto-complete'
import { Button } from '@ccui/button'
import { Cascader } from '@ccui/cascader'
import { CheckBox } from '@ccui/check-box'
import { CheckableTag, CheckableTagGroup } from '@ccui/checkable-tag'
import { ColorPicker } from '@ccui/color-picker'
import { DatePicker } from '@ccui/date-picker'
import { Form, FormItem, FormList, FormProvider } from '@ccui/form'
import { Input } from '@ccui/input'
import { InputNumber } from '@ccui/input-number'
import { InputOtp } from '@ccui/input-otp'
import { InputSearch } from '@ccui/input-search'
import { Mentions } from '@ccui/mentions'
import { Radio, RadioGroup } from '@ccui/radio'
import { RangePicker } from '@ccui/range-picker'
import { Rate } from '@ccui/rate'
import { Segmented } from '@ccui/segmented'
import { Select } from '@ccui/select'
import { Slider } from '@ccui/slider'
import { Switch } from '@ccui/switch'
import { Textarea } from '@ccui/textarea'
import { TimePicker } from '@ccui/time-picker'
import { TimeRangePicker } from '@ccui/time-range-picker'
import { Transfer } from '@ccui/transfer'
import { TreeSelect } from '@ccui/tree-select'

const autoCompleteValue = ref('')
const cascaderValue = ref<Array<string | number> | null>(['asia', 'china', 'shanghai'])
const disabledCascaderValue = ref<Array<string | number> | null>(null)
const disabledCascaderChanges = ref(0)
const checkboxValue = ref(false)
const disabledCheckboxValue = ref(false)
const disabledCheckboxChanges = ref(0)
const tagChecked = ref(false)
const tagGroupValue = ref<Array<string | number>>(['vue'])
const colorValue = ref('#ff0000')
const dateValue = ref<string | null>('2026-07-21')
const rangeValue = ref<[string, string] | null>(['2026-07-20', '2026-07-22'])
const numberValue = ref(2)
const otpValue = ref('')
const searchValue = ref('')
const searchResult = ref('not-searched')
const textareaValue = ref('')
const mentionsValue = ref('')
const radioValue = ref('alpha')
const standaloneRadio = ref<string | number>('')
const rateValue = ref(1)
const segmentedValue = ref('daily')
const selectValue = ref<string | number | null>(null)
const searchableSelectValue = ref<string | number | null>(null)
const multipleSelectValue = ref<Array<string | number>>([])
const sliderValue = ref(20)
const switchValue = ref(false)
const timeValue = ref<string | null>('09:30:00')
const timeRangeValue = ref<[string, string] | null>(['09:00:00', '18:00:00'])
const transferTargetKeys = ref<string[]>([])
const transferSelectedKeys = ref<string[]>([])
const disabledTransferTargetKeys = ref<string[]>([])
const disabledTransferSelectedKeys = ref<string[]>([])
const disabledTransferChanges = ref(0)
const disabledTransferSelectChanges = ref(0)
const treeValue = ref<string | null>('leaf-a')
const providerModel = reactive({ name: 'Ready' })
const providerResult = ref('not-submitted')
const providerChange = ref('not-changed')

function onSearch(value: string) {
  searchResult.value = value
}

function prepareTransferLeft() {
  transferTargetKeys.value = ['banana']
  transferSelectedKeys.value = ['banana']
}

const cascaderOptions = [
  {
    value: 'asia',
    label: 'Asia',
    children: [
      {
        value: 'china',
        label: 'China',
        children: [{ value: 'shanghai', label: 'Shanghai' }],
      },
    ],
  },
]

const transferData = [
  { key: 'apple', title: 'Apple' },
  { key: 'banana', title: 'Banana' },
  { key: 'cherry', title: 'Cherry', disabled: true },
]

const treeData = [
  {
    value: 'parent',
    label: 'Parent',
    children: [
      { value: 'leaf-a', label: 'Leaf A' },
      { value: 'leaf-b', label: 'Leaf B' },
      { value: 'leaf-disabled', label: 'Leaf Disabled', disabled: true },
    ],
  },
]

const FormListHarness = defineComponent({
  name: 'E2EFormListHarness',
  setup() {
    const model = reactive<{ items: Array<{ value: string }> }>({ items: [{ value: 'first' }] })
    return () =>
      h(Form, { model }, () =>
        h(
          FormList,
          { name: 'items' },
          {
            default: (
              fields: Array<{ key: number; name: number }>,
              operation: { add: Function; remove: Function; move: Function },
            ) =>
              h('div', [
                ...fields.map((field) =>
                  h('div', { key: field.key, 'data-testid': 'form-list-row' }, [
                    h(Input, {
                      modelValue: model.items[field.name]?.value ?? '',
                      'onUpdate:modelValue': (value: string) => {
                        const item = model.items[field.name]
                        if (item) item.value = value
                      },
                    }),
                    h(
                      'button',
                      {
                        type: 'button',
                        'aria-label': `Remove row ${field.name + 1}`,
                        onClick: () => operation.remove(field.name),
                      },
                      'Remove',
                    ),
                  ]),
                ),
                h(
                  'button',
                  { type: 'button', 'data-testid': 'form-list-add', onClick: () => operation.add({ value: 'new' }) },
                  'Add row',
                ),
                h(
                  'button',
                  {
                    type: 'button',
                    'data-testid': 'form-list-insert',
                    onClick: () => operation.add({ value: 'inserted' }, 0),
                  },
                  'Insert first',
                ),
                h(
                  'button',
                  {
                    type: 'button',
                    'data-testid': 'form-list-move',
                    disabled: fields.length < 2,
                    onClick: () => operation.move(0, fields.length - 1),
                  },
                  'Move first to end',
                ),
                h('output', { 'data-testid': 'form-list-value' }, JSON.stringify(model.items)),
              ]),
          },
        ),
      )
  },
})

function onProviderFinish(name: string, info: { values: Record<string, unknown> }) {
  providerResult.value = `${name}:${JSON.stringify(info.values)}`
}

function onProviderChange(name: string, info: { changedFields: Array<{ name: string; value: unknown }> }) {
  providerChange.value = `${name}:${JSON.stringify(info.changedFields)}`
}
</script>

<template>
  <div class="input-fixtures" data-testid="input-fixtures">
    <section data-testid="auto-complete-fixture">
      <h2>AutoComplete</h2>
      <AutoComplete v-model="autoCompleteValue" :options="['Apple', 'Banana', 'Cherry']" placeholder="Find fruit" />
      <AutoComplete :options="['Disabled']" placeholder="Disabled fruit" disabled />
      <Button data-testid="auto-complete-external" native-type="button" @click="autoCompleteValue = 'Cherry'">
        Set Cherry
      </Button>
      <output data-testid="auto-complete-value">{{ autoCompleteValue }}</output>
    </section>

    <section data-testid="cascader-fixture">
      <h2>Cascader</h2>
      <Cascader v-model="cascaderValue" :options="cascaderOptions" clearable />
      <Cascader
        v-model="disabledCascaderValue"
        :options="cascaderOptions"
        placeholder="Disabled cascader"
        disabled
        @change="disabledCascaderChanges++"
      />
      <Button
        data-testid="cascader-external"
        native-type="button"
        @click="cascaderValue = ['asia', 'china', 'shanghai']"
      >
        Reset cascader
      </Button>
      <output data-testid="cascader-value">{{ JSON.stringify(cascaderValue) }}</output>
      <output data-testid="disabled-cascader-value">{{ JSON.stringify(disabledCascaderValue) }}</output>
      <output data-testid="disabled-cascader-changes">{{ disabledCascaderChanges }}</output>
    </section>

    <section data-testid="checkbox-fixture">
      <h2>CheckBox</h2>
      <CheckBox v-model="checkboxValue" label="Accept terms" />
      <CheckBox
        v-model="disabledCheckboxValue"
        label="Disabled checkbox"
        disabled
        @change="disabledCheckboxChanges++"
      />
      <Button data-testid="checkbox-external" native-type="button" @click="checkboxValue = true"
        >Check externally</Button
      >
      <output data-testid="checkbox-value">{{ checkboxValue }}</output>
      <output data-testid="disabled-checkbox-value">{{ disabledCheckboxValue }}</output>
      <output data-testid="disabled-checkbox-changes">{{ disabledCheckboxChanges }}</output>
    </section>

    <section data-testid="checkable-tag-fixture">
      <h2>CheckableTag</h2>
      <CheckableTag v-model:checked="tagChecked">Standalone tag</CheckableTag>
      <CheckableTag disabled>Disabled tag</CheckableTag>
      <CheckableTagGroup
        v-model="tagGroupValue"
        :options="[
          { label: 'Vue', value: 'vue' },
          { label: 'React', value: 'react' },
          { label: 'Angular', value: 'angular', disabled: true },
        ]"
      />
      <output data-testid="tag-value">{{ tagChecked }}</output>
      <output data-testid="tag-group-value">{{ JSON.stringify(tagGroupValue) }}</output>
    </section>

    <section data-testid="color-picker-fixture">
      <h2>ColorPicker</h2>
      <ColorPicker v-model="colorValue" show-text allow-clear />
      <ColorPicker model-value="#000000" disabled />
      <Button data-testid="color-external" native-type="button" @click="colorValue = '#0000ff'">Set blue</Button>
      <output data-testid="color-value">{{ colorValue || 'empty' }}</output>
    </section>

    <section data-testid="date-fixture">
      <h2>Date pickers</h2>
      <DatePicker v-model="dateValue" format="YYYY-MM-DD" clearable />
      <RangePicker v-model="rangeValue" format="YYYY-MM-DD" clearable />
      <DatePicker placeholder="Disabled date" disabled />
      <RangePicker :placeholder="['Disabled start', 'Disabled end']" disabled />
      <Button data-testid="date-external" native-type="button" @click="dateValue = '2026-08-01'">Set date</Button>
      <Button data-testid="range-external" native-type="button" @click="rangeValue = ['2026-08-01', '2026-08-05']">
        Set range
      </Button>
      <output data-testid="date-value">{{ dateValue || 'empty' }}</output>
      <output data-testid="range-value">{{ JSON.stringify(rangeValue) }}</output>
    </section>

    <section data-testid="form-list-fixture">
      <h2>FormList</h2>
      <FormListHarness />
    </section>

    <section data-testid="form-provider-fixture">
      <h2>FormProvider</h2>
      <FormProvider @form-finish="onProviderFinish" @form-change="onProviderChange">
        <Form
          name="profile"
          :model="providerModel"
          :rules="{ name: { required: true, message: 'Provider name required' } }"
        >
          <FormItem name="name" label="Provider name" html-for="provider-name">
            <Input id="provider-name" v-model="providerModel.name" />
          </FormItem>
          <Button native-type="submit">Submit provider form</Button>
        </Form>
      </FormProvider>
      <Button data-testid="provider-clear" native-type="button" @click="providerModel.name = ''"
        >Clear provider name</Button
      >
      <output data-testid="provider-value">{{ providerResult }}</output>
      <output data-testid="provider-change">{{ providerChange }}</output>
    </section>

    <section data-testid="number-otp-search-fixture">
      <h2>Number, OTP and Search</h2>
      <InputNumber v-model="numberValue" :min="0" :max="5" aria-label="Quantity" />
      <InputOtp v-model="otpValue" :length="4" />
      <InputSearch v-model="searchValue" enter-button="Search" clearable @search="onSearch" />
      <InputNumber :model-value="1" disabled aria-label="Disabled quantity" />
      <InputNumber :model-value="1" readonly aria-label="Readonly quantity" />
      <InputOtp model-value="" :length="4" disabled />
      <InputSearch placeholder="Disabled search" disabled />
      <Button data-testid="number-external" native-type="button" @click="numberValue = 5">Set maximum</Button>
      <Button data-testid="otp-external" native-type="button" @click="otpValue = '9876'">Set OTP</Button>
      <output data-testid="number-value">{{ numberValue }}</output>
      <output data-testid="otp-value">{{ otpValue }}</output>
      <output data-testid="search-value">{{ searchResult }}</output>
    </section>

    <section data-testid="textarea-mentions-fixture">
      <h2>Textarea and Mentions</h2>
      <Textarea v-model="textareaValue" placeholder="Write notes" :rows="2" :max-length="12" allow-clear show-count />
      <Mentions v-model="mentionsValue" :options="['alice', 'bob']" placeholder="Mention a person" />
      <Textarea placeholder="Readonly notes" model-value="fixed" readonly />
      <Mentions placeholder="Disabled mentions" :options="['nobody']" disabled />
      <Button data-testid="textarea-external" native-type="button" @click="textareaValue = 'external'"
        >Set notes</Button
      >
      <Button data-testid="mentions-external" native-type="button" @click="mentionsValue = '@bob '">Set mention</Button>
      <output data-testid="textarea-value">{{ textareaValue }}</output>
      <output data-testid="mentions-value">{{ mentionsValue }}</output>
    </section>

    <section data-testid="choice-fixture">
      <h2>Choice controls</h2>
      <Radio v-model="standaloneRadio" label="Standalone radio" />
      <RadioGroup v-model="radioValue">
        <Radio label="alpha">Alpha</Radio>
        <Radio label="beta">Beta</Radio>
        <Radio label="gamma" disabled>Gamma</Radio>
      </RadioGroup>
      <Rate v-model="rateValue" />
      <Rate :model-value="4" read-only />
      <Segmented
        v-model="segmentedValue"
        :options="['daily', 'weekly', { label: 'monthly', value: 'monthly', disabled: true }]"
      />
      <Select
        v-model="selectValue"
        :options="[
          { label: 'Small', value: 'small' },
          { label: 'Large', value: 'large' },
          { label: 'Medium disabled', value: 'medium', disabled: true },
        ]"
        placeholder="Choose size"
        clearable
      />
      <div data-testid="searchable-select">
        <Select
          v-model="searchableSelectValue"
          :options="[
            { label: 'Alpha choice', value: 'alpha' },
            { label: 'Beta choice', value: 'beta' },
            { label: 'Gamma choice', value: 'gamma' },
          ]"
          placeholder="Search choices"
          show-search
        />
      </div>
      <div data-testid="multiple-select">
        <Select
          v-model="multipleSelectValue"
          :options="[
            { label: 'Alpha choice', value: 'alpha' },
            { label: 'Beta choice', value: 'beta' },
            { label: 'Gamma choice', value: 'gamma' },
          ]"
          placeholder="Choose many"
          multiple
        />
      </div>
      <Slider v-model="sliderValue" :min="0" :max="100" :step="10" aria-label="Volume" />
      <Switch v-model="switchValue" />
      <Select :options="[{ label: 'Never', value: 'never' }]" placeholder="Disabled select" disabled />
      <Slider :model-value="50" disabled aria-label="Disabled slider" />
      <Switch disabled />
      <Button data-testid="rate-external" native-type="button" @click="rateValue = 5">Set five stars</Button>
      <Button data-testid="segmented-external" native-type="button" @click="segmentedValue = 'weekly'"
        >Set weekly</Button
      >
      <Button data-testid="select-external" native-type="button" @click="selectValue = 'small'">Set small</Button>
      <Button data-testid="slider-min" native-type="button" @click="sliderValue = 0">Set slider minimum</Button>
      <Button data-testid="slider-max" native-type="button" @click="sliderValue = 100">Set slider maximum</Button>
      <Button data-testid="switch-external" native-type="button" @click="switchValue = true">Switch on</Button>
      <output data-testid="standalone-radio-value">{{ standaloneRadio }}</output>
      <output data-testid="radio-value">{{ radioValue }}</output>
      <output data-testid="rate-value">{{ rateValue }}</output>
      <output data-testid="segmented-value">{{ segmentedValue }}</output>
      <output data-testid="select-value">{{ selectValue }}</output>
      <output data-testid="searchable-select-value">{{ searchableSelectValue }}</output>
      <output data-testid="multiple-select-value">{{ JSON.stringify(multipleSelectValue) }}</output>
      <output data-testid="slider-value">{{ sliderValue }}</output>
      <output data-testid="switch-value">{{ switchValue }}</output>
    </section>

    <section data-testid="time-fixture">
      <h2>Time pickers</h2>
      <TimePicker v-model="timeValue" clearable />
      <TimeRangePicker v-model="timeRangeValue" clearable />
      <TimePicker placeholder="Disabled time" disabled />
      <TimeRangePicker placeholder="Disabled time range" disabled />
      <Button data-testid="time-external" native-type="button" @click="timeValue = '10:45:30'">Set time</Button>
      <Button data-testid="time-range-external" native-type="button" @click="timeRangeValue = ['08:00:00', '12:00:00']">
        Set time range
      </Button>
      <output data-testid="time-value">{{ timeValue || 'empty' }}</output>
      <output data-testid="time-range-value">{{ JSON.stringify(timeRangeValue) }}</output>
    </section>

    <section data-testid="transfer-fixture">
      <h2>Transfer</h2>
      <Transfer
        v-model:target-keys="transferTargetKeys"
        v-model:selected-keys="transferSelectedKeys"
        :data-source="transferData"
        :titles="['Available', 'Chosen']"
        show-search
      />
      <div data-testid="disabled-transfer">
        <Transfer
          v-model:target-keys="disabledTransferTargetKeys"
          v-model:selected-keys="disabledTransferSelectedKeys"
          :data-source="[{ key: 'locked', title: 'Locked item' }]"
          :titles="['Disabled available', 'Disabled chosen']"
          disabled
          @change="disabledTransferChanges++"
          @select-change="disabledTransferSelectChanges++"
        />
      </div>
      <Button data-testid="transfer-external" native-type="button" @click="transferTargetKeys = ['banana']">
        Choose Banana
      </Button>
      <Button data-testid="transfer-prepare-left" native-type="button" @click="prepareTransferLeft">
        Select chosen Banana
      </Button>
      <output data-testid="transfer-value">{{ JSON.stringify(transferTargetKeys) }}</output>
      <output data-testid="transfer-selected-value">{{ JSON.stringify(transferSelectedKeys) }}</output>
      <output data-testid="disabled-transfer-value">{{ JSON.stringify(disabledTransferTargetKeys) }}</output>
      <output data-testid="disabled-transfer-selected-value">{{ JSON.stringify(disabledTransferSelectedKeys) }}</output>
      <output data-testid="disabled-transfer-changes">{{ disabledTransferChanges }}</output>
      <output data-testid="disabled-transfer-select-changes">{{ disabledTransferSelectChanges }}</output>
    </section>

    <section data-testid="tree-select-fixture">
      <h2>TreeSelect</h2>
      <TreeSelect v-model="treeValue" :tree-data="treeData" tree-default-expand-all clearable />
      <TreeSelect :tree-data="treeData" placeholder="Disabled tree" disabled />
      <Button data-testid="tree-external" native-type="button" @click="treeValue = 'leaf-b'">Set Leaf B</Button>
      <output data-testid="tree-value">{{ treeValue || 'empty' }}</output>
    </section>
  </div>
</template>

<style scoped>
.input-fixtures {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  margin-top: 24px;
}

.input-fixtures section {
  min-width: 0;
  padding: 16px;
  border: 1px solid #dbe3ee;
  border-radius: 10px;
  background: #fff;
}

.input-fixtures h2 {
  margin: 0 0 12px;
  font-size: 16px;
}

.input-fixtures output {
  display: block;
  min-height: 20px;
  margin-top: 8px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

[data-testid='transfer-fixture'] {
  grid-column: 1 / -1;
  overflow-x: auto;
}
</style>
