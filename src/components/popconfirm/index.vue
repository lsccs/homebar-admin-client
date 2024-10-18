<template>
  <el-popover
    trigger="click"
    @positive-click="onConfirm"
  >

    <template #trigger>
      {{ title }}
    </template>
    <slot></slot>
  </el-popover>

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
