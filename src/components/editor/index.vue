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
     </div>
</template>

<script setup>
import Editor from '@tinymce/tinymce-vue'
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

const init = {
    toolbar_mode: 'sliding',
    language: 'zh_CN',
    placeholder: '请在此填写内容',
    plugins: [
    // Core editing features
    'preview',
    'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
    // Your account includes a free trial of TinyMCE premium features
    // Try the most popular premium features until Dec 14, 2024:
    'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss',
    ],
    toolbar: 'preview undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
    ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
    setup,
    // 初始化成功
    init_instance_callback: (editor) => {
        loading.value = false
        editorRef = editor
        editor.setContent(props.value || '')
    }
}

watch(() => props.value, () => {
    editorRef?.setContent(props.value || '')
})

function setup(editor) {
    editor.on('Change', (evt) => {
        emit('update:value', evt.target.getContent({format: 'raw'}))
    });
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