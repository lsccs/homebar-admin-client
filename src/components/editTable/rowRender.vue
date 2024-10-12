<template>
  <component v-if="!readonly" :is="compMap[componentProps.component]" :value="value" v-bind="componentProps.props"></component>
  <span v-else-if="isFunction(renderValue)">{{ renderValue(value, model) }}</span>
  <span v-else>{{ value }}</span>
</template>


<script setup>
import { NInput, NInputNumber } from 'naive-ui'
import Select from '../select/index.vue'
import {isFunction} from "lodash-es";

const emit = defineEmits(['update:value'])
const props = defineProps({
  model: {
    type: Object,
    default: () => ({}),
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  value: {
    type: [Number, Array, String, Function]
  },
  renderValue: {
    type: Function
  },
  componentProps: {
    type: Object,
    default: () => ({
      component: 'Input',
      props: {}
    })
  }
})
const compMap = {
  Input: NInput,
  Select,
  InputNumber: NInputNumber
}


</script>
