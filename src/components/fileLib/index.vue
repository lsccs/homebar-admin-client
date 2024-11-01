<template>
  <div class="file-container">
    <div class="file-inner">
      <div class="file-content">
        <div class="file-group-content">
          <div class="file-group-scroll">

            <n-tabs
              class="group-list"
              type="card"
              animated
              placement="left"
              v-model:value="activeGroup"
              closable
              @update:value="handleSelectGroup"
              @close="handleDeleteGroup"
            >

              <n-tab-pane :name="0" tab="全部" />

              <n-tab-pane
                v-for="item in groupList"
                :name="item.id"
                :tab="item.name"
              />

            </n-tabs>

          </div>
          <div v-if="!select" class="file-button-action">
            <PopAddContent title="新增分组" @submit="handleAddGroup" />
          </div>
        </div>

        <div class="file-list">
          <div class="file-header">
            <div>
              <input
                v-show="false"
                ref="file"
                multiple
                :accept="`${activeName}/*`"
                type="file"
                @change="onUpload"
              />
              <n-button
                size="small"
                type="primary"
                class="mr-10"
                @click="handleUpload"
              >上传
              </n-button>
              <PopConfirm v-if="!select" title="确认删除所选文件吗?" @confirm="handleDeleteFile">
                <n-button
                  class="mr-10"
                  :disabled="!selectRows.length"
                  size="small"
                >删除
                </n-button>
              </PopConfirm>
              <span class="tip">已选 {{ selectRows.length }} 个</span>
            </div>
            <i class="el-icon-refresh refresh" @click="loadFileList" />
          </div>
          <n-spin class="loading-spin" :show="loading">
            <div class="flex-content-list">
              <div class="flex-content-list-content">
                <div v-show="!fileList.length" class="empty-tip">
                  <span>暂无数据</span>
                </div>
                <FileItem
                  v-for="item in fileList"
                  :select="select"
                  :key="item.id"
                  v-bind="item"
                  :file="item"
                  :fileList="fileList"
                  :active="isActive(item.id)"
                  @select="updateActive(item)"
                />
              </div>

            <div class="list-content-pagination">
              <pagination
                :total="total"
                :page.sync="query.page"
                :limit.sync="query.limit"
                @pagination="loadFileList"
              />
            </div>
          </div>
          </n-spin>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FileItem from './fileItem.vue'
import PopAddContent from '@/components/popAddContent/index.vue'
import PopConfirm from '@/components/popconfirm/index.vue'

import API, { upload } from '@/api/file'

import Pagination from '@/components/pagination/index.vue' // secondary package based on el-pagination

export default {
  components: {
    PopConfirm,
    FileItem,
    PopAddContent,
    Pagination,
  },
  props: {
    select: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      activeName: 'image',
      activeGroup: 0,
      loading: false,

      selectRows: [],
      groupList: [],
      query: {
        page: 1,
        limit: 20,
        filters: {},
      },
      total: 0,
      fileList: [],
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    getSelectRows() {
      return [...this.selectRows]
    },
    setSelectRows(data) {
      this.selectRows = [...data]
    },
    load() {
      this.loadGroupList()
      this.loadFileList()
    },
    loadGroupList() {
      API.fetchGroupList().then((res) => {
        this.groupList = res.data
      })
    },
    loadFileList() {
      this.loading = true
      this.query.filters.group_id = this.activeGroup
        ? this.activeGroup
        : undefined
      // this.query.filters.type = this.activeName
      API.fetchList(this.query)
        .then((res) => {
          setTimeout(() => {
            const { data } = res
            this.fileList = data.list || []
            this.total = data.total || 0
            this.loading = false
          }, 1000)
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleAddGroup(value, done) {
      API.fetchGroupAdd({ name: value })
        .then(() => {
          this.loadGroupList()
        })
        .finally(done)
    },
    handleDeleteGroup(id) {
      API.fetchGroupDelete([id]).finally(this.loadGroupList)
    },
    handleSelectGroup() {
      this.loadFileList()
    },
    handleUpload() {
      this.$refs.file.click()
    },
    onUpload(e) {
      this.loading = true
      const data = new FormData()
      data.append('group_id', this.activeGroup)
      ;[...e.target.files].forEach((file) => {
        data.append('files', file)
      })
      upload(data)
        .then((res) => {
          $message.success(res.message)
        })
        .finally(() => {
          this.loading = false
          this.loadFileList()
        })
      e.target.value = ''
    },

    isActive(id) {
      return !!this.selectRows.find((item) => item.id === id)
    },

    handleDeleteFile() {
      this.loading = true
      API.deleteFiles({ ids: this.selectRows.map(item => item.id) }).then(() => {
        this.selectRows = []
      }).finally(this.loadFileList)
    },

    updateActive(item) {
      const index = this.selectRows.findIndex((c) => c.id === item.id)
      if (index !== -1) {
        return this.selectRows.splice(index, 1)
      }
      if (!this.multiple) {
        return (this.selectRows = [item])
      }
      this.selectRows.push(item)
    },
  },
}
</script>

<style lang="scss" scoped>
.file-container {
  height: 100%;
  display: flex;
  flex-direction: column;

  padding: 20px;

  .file-inner {
    border-radius: 4px;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;

    .file-content {
      display: flex;
      height: 0;
      flex: 1;

      .file-list {
        width: 100%;
        padding-left: 20px;
        display: flex;
        flex-direction: column;

        .loading-spin {
          height: 100%;
          display: flex;
          flex-direction: column;

          :deep(.n-spin-content) {
            height: 100%;
            display: flex;
            flex-direction: column;
          }
        }

        .file-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .refresh {
            font-size: 20px;
            cursor: pointer;
            color: #99a9bf;
          }

          .mr-20 {
            margin-right: 20px;
          }

          .tip {
            font-size: 13px;
            color: #99a9bf;
          }
        }

        .flex-content-list {
          flex: 1;
          height: 0;
          display: flex;
          flex-direction: column;

          margin-top: 13px;
          gap: 20px;

          .flex-content-list-content {
            flex: 1;
            height: 0;
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
            padding-bottom: 13px;
            overflow-y: auto;
            column-gap: 10px;
            align-content: flex-start;

            .empty-tip {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 13px;
              color: #99a9bf;
            }
          }

          .list-content-pagination {
            display: flex;
            justify-content: flex-end;

            ::v-deep .pagination-container {
              padding: 10px 0 !important;
              margin-top: 0 !important;
            }
          }
        }
      }

      .file-group-content {
        height: 100%;
        width: 260px;
        border-right: 1px solid rgba(0, 0, 0, 0.1);

        display: flex;
        flex-direction: column;

        .file-group-scroll {
          height: 0;
          flex: 1;
          overflow-y: auto;
          padding-bottom: 15px;

          .group-list {
            height: 100%;
            width: 100%;

            :deep(.n-tab-pane) {
              display: none;
            }

            :deep(.n-tabs-nav--card-type) {
              width: 100%;
              flex-direction: column;

              .n-tabs-pad {
                border: none;
              }

              .n-tabs-tab[data-name='0'] {
                .n-base-close {
                  display: none !important;
                }
              }

              .n-tabs-tab {
                flex: 1;

                .n-base-close {
                  display: none;
                }

                &:hover .n-base-close {
                  display: block;
                }

                &.n-tabs-tab--active {
                  background-color: var(--n-tab-text-color-active);
                  color: #fff;

                  .n-base-close {
                    color: #fff;
                  }
                }
              }
            }
          }
        }

        .file-button-action {
          display: flex;
          justify-content: center;
        }
      }
    }
  }
}
</style>
