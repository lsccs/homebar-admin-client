import { getDictOptions } from '@/store/helper.js'

function setOptions(el, binding, comp) {
  if (!comp.ctx.props.options?.length) {
    comp.ctx.props.options = getDictOptions(binding.value)
  }
}

export const options = {
  created: setOptions,
  updated: setOptions,
}
