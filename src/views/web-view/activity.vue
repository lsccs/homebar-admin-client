<template>
  <div class="activity-web-view">
    <div class="activity-info-html" v-if="info" v-html="info.content"></div>
    <div class="empty">
      <n-empty description="活动不见了" />
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from "vue-router";

const { query } = useRoute()

const activityUrl = '/m/web/activity/detail'

const isVisit = ref(true)
const info = ref(null);
if (!query.code || !query.id) {
  isVisit.value = false
}

onMounted(() => {
  if (isVisit.value) {
    const serverUrl = import.meta.env.VITE_AXIOS_BASE_URL;
    fetch(serverUrl + activityUrl + `?id=${query.id}`, {
      headers: {
        satoken: query.code
      },
      method: 'GET'
    }).then(res => res.json()).then(res => {
      info.value = res.data
    })
  }
})


</script>

<style lang="scss" scoped>
.activity-web-view {
  height: 100%;
  overflow-y: auto;


  .empty {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

}
</style>
