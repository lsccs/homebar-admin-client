<template>
     <div class="editor">
        <div v-show="loading">
            <n-skeleton text :repeat="2" />
            <n-skeleton text style="width: 60%" />
        </div>

        <div v-show="!loading">
            <Editor
                api-key="mx14ocam78ov0xq48hwbs4xg5zogsxv3r8s2zepvvm4gxzq0"
                :init="init"
            />
        </div>
        <FileSelector v-show="false" ref="selectRef" @update:file="addFile" />
     </div>
</template>

<script setup>
import Editor from '@tinymce/tinymce-vue'
import FileSelector from '@/components/fileSelector/index.vue'
import { ref, watch } from 'vue';

const emit = defineEmits(['update:value'])
const props = defineProps({
    value: {
        type: String,
        default: ''
    }
})

let editorRef = null;
const loading = ref(true)
const selectRef = ref()

const init = {
    toolbar_mode: 'sliding',
    language: 'zh_CN',
    placeholder: '请在此填写内容',
    plugins: [
    // Core editing features
    'preview',
    'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'searchreplace', 'table', 'visualblocks', 'wordcount',
    ],
    toolbar: 'preview undo redo custom | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
    ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
    setup,
    // 初始化成功
    init_instance_callback: (editor) => {
        loading.value = false
        editorRef = editor
        setValue(props.value)
    }
}

watch(() => props.value, () => {
    setValue(props.value)
})

function setValue(value) {
    editorRef?.setContent(value || '')
}

function onChange() {
    emit('update:value', editorRef.getContent({format: 'raw'}))
}

function setup(editor) {
    editor.ui.registry.addIcon('media', '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M2 6H0v5h.01L0 20c0 1.1.9 2 2 2h18v-2H2V6zm5 9h14l-3.5-4.5l-2.5 3.01L11.5 9zM22 4h-8l-2-2H6c-1.1 0-1.99.9-1.99 2L4 16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 12H6V4h5.17l1.41 1.41l.59.59H22v10z" fill="currentColor"></path></svg>')
    editor.ui.registry.addButton('custom', {
        tooltip: '上传附件', // 悬浮的时候的提示
        icon: 'media',
        onAction: showImageSelector,
    })
    editor.on('Change', (evt) => {
        onChange();
    });
  }

   function insertContent(value) {
        editorRef.execCommand('mceInsertContent', false, value)
   }

  function addFile(files) {
      files.forEach((file) => {
        let value;
        value = `<a href="${file.url}" target="_blank">${file.file_name}.${file.suffix}</a>`
        if (file.type === 'image') {
          value = `<img style="width: 100%;height: 100%" src="${file.url}">`
        }
        if (file.type === 'video') {
          value = `<p>
              <span class="mce-preview-object mce-object-video" contenteditable="false"
               data-mce-object="video" data-mce-p-allowfullscreen="allowfullscreen"
                data-mce-p-frameborder="no" data-mce-p-scrolling="no"
                 data-mce-p-src="${file.url}" >
                  <video src="${file.url}"
                   style="width:auto;max-width:100%;height:auto"
                   controls="controls"></video>
              </span>
            </p>`
        }
        insertContent(value)
      })
      onChange();
    }

  function showImageSelector() {
    selectRef.value.open()
    }
</script>

<style scoped lang="scss">
.editor {
    width: 100%;
    textarea {
        opacity: 0;
    }
}
</style>
