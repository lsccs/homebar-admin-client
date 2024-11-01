<template>
  <n-popconfirm
    @positive-click="onConfirm"
  >

    <template #trigger>
      <slot></slot>
    </template>
    {{ title }}
  </n-popconfirm>

</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    onConfirm() {
      this.$emit('confirm')
    }
  }
}
</script>
