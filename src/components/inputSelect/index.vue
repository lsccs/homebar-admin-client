<template>
  <div class="input-select">
    <n-input v-if="type === 'input'" :value="value[0]" @update:value="onInputChange" />
    <n-input-number v-if="type === 'number'" :precision="precision" :min="min" :max="max" :value="value[0]" @update:value="onInputChange" />
    <div class="select-sufix">
      <n-select :value="value[1]" :options="options" @update:value="onSelectChange" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  value: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Array,
    default: () => [],
  },
  type: {
    type: String,
    default: 'input',
  },
  precision: {
    type: Number,
    default: 4,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: null,
  },
})
const emit = defineEmits(['update:value'])

watch(() => props.options, init)
onMounted(init)

function init() {
  if (!props.value[1] && props.options?.length) {
    onChange(props.options[0].value, 1)
  }
}

function onChange(val, index) {
  console.log(props.value, 'props.value')
  const value = [...(props.value || [])]
  value[index] = val
  emit('update:value', value)
}

function onInputChange(val) {
  onChange(val, 0)
}

function onSelectChange(val) {
  onChange(val, 1)
}
</script>

<style lang="scss" scoped>
.input-select {
  width: 100%;
  display: flex;
  align-items: center;

  .select-sufix {
    min-width: 80px;
  }
}
</style>
