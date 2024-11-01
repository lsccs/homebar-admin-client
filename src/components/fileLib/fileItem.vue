<template>
  <div class="file-item">
    <div class="file-content" @click="handleClick">
      <div v-if="type === 'image'" class="image" :class="{ active }">
        <img :src="url" />
        <div class="mask">
          <i :class="`i-fe:check bg-primary text-24`" />
        </div>

      </div>
      <div v-if="type === 'video'" class="video" :class="{ active }">
        <video ref="video" :src="url" />
        <div class="mask">
          <i :class="`i-fe:check`" />
        </div>
      </div>
    </div>
    <div class="file-footer-container">
      <div class="file-footer">
        <div class="file-name">{{ file_name + '.' + suffix }}</div>
        <div class="file-action">

          <PopAddContent
            v-if="!select"
            title="重命名"
            :defaultValue="file_name"
            @submit="handleRename"
            link
          />

          <div @click="handlePreview">查看</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PopAddContent from '@/components/popAddContent/index.vue'
import API from '@/api/file'


export default {
  components: { PopAddContent },
  props: {
    id: {
      type: Number,
      default: 0,
    },
    url: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    file_name: {
      type: String,
      default: '',
    },
    suffix: {
      type: String,
      default: '',
    },
    active: {
      type: Boolean,
      default: false,
    },
    select: {
      type: Boolean,
      default: false,
    },
    file: {
      type: Object,
      default: () => ({}),
    },
    fileList: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {}
  },
  mounted() {
    if (this.$refs.video) {
      this.$refs.video.addEventListener('fullscreenchange', function(event) {
        if (document.fullscreenElement) {
          this.$refs.video.controls = 'controls'
        } else {
          this.$refs.video.removeAttribute('controls')
        }
      });
    }
  },
  methods: {
    handleClick() {
      this.$emit('select')
    },

    handleRename(value, done) {
      API.fileUpdate({ id: this.id, file_name: value })
        .then((res) => {
          $message.success(res.message)
        })
        .finally(() => {
          setTimeout(() => {
            this.file.file_name = value
            done()
          }, 1000)
        })
    },
    handlePreview(e) {
      e.stopPropagation()
      if (this.type === 'image') {
        this.$viewerApi({
          images: this.fileList.map(item => item.path),
        })
        return
      }
      const video = this.$refs.video
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.mozRequestFullScreen) { // Firefox
        video.mozRequestFullScreen();
      } else if (video.webkitRequestFullscreen) { // Chrome, Safari and Opera
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) { // IE/Edge
        video.msRequestFullscreen();
      }
    }
  },
}
</script>
<style lang="scss" scoped>
.file-item {
  cursor: pointer;
  flex: 0;
  margin-bottom: 40px;

  &:hover {
    .file-action {
      display: flex !important;
    }
  }

  .file-footer-container {
    position: relative;
    margin-bottom: 20px;
  }
  .file-footer {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    .file-name {
      margin-top: 8px;
      color: rgb(48, 49, 51);
      font-size: 14px;
      line-height: 20px;
      width: 100%;
      text-align: center;
      white-space: nowrap; /* 不换行 */
      overflow: hidden; /* 隐藏超出部分 */
      text-overflow: ellipsis; /* 显示省略号 */
    }

    .file-action {
      display: none;
      margin-top: 8px;
      font-size: 13px;
      color: rgb(150, 173, 250);
      align-items: center;
      text-align: center;
      line-height: 13px;
      column-gap: 8px;

      .rename {
        margin-right: 8px;
      }
    }
  }

  .file-content {
    width: 120px;
    height: 120px;

    .image,
    .video {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 4px;
      overflow: hidden;

      .mask {
        display: none;

        .icon {
          color: #009bb1;
          font-size: 30px;
        }
      }

      &.active {
        .mask {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.6);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      }

      > img,
      > video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>
