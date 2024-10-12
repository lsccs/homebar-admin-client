import rawApi from "@/views/raw_material/api.js";
import { getDictOptions } from "@/store/helper.js";
const unitOptions = getDictOptions('unit')

export default [
  {
    title: '原料',
    key: 'raw_material_id',
    componentProps: (row, item) => ({
      component: 'Select',
      props: {
        loadApi: rawApi.read,
        multiple: false,
        'onUpdate:value'(value) {
          row[item.key] = value
        }
      }
    })
  },
  {
    title: '数量',
    key: 'number',
    componentProps: (row, item) => ({
      component: 'InputNumber',
      props: {
        min: 0,
        'onUpdate:value'(value) {
          row[item.key] = value
        }
      }
    })
  },
  {
    title: '单位',
    key: 'unit',
    componentProps: (row, item) => ({
      component: 'Select',
      props: {
        options: unitOptions,
        'onUpdate:value'(value) {
          row[item.key] = value
          console.log(value, 'ddd')
        }
      }
    })
  }
]
