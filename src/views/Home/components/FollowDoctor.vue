<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import DoctorCard from './DoctorCard.vue'
import { getPageDoc } from '../../../services/consult'
import type { PageParams, DoctorList } from '@/types/consult'
import { useWindowSize } from '@vueuse/core'
const pageParams = ref<PageParams>({
  current: 1,
  pageSize: 5
})
const doctorList = ref<DoctorList>()
const getPageDocList = async () => {
  const res = await getPageDoc(pageParams.value)
  doctorList.value = res.data.rows
}
getPageDocList()
const widthValue = ref(0)
const setWidth = () => {
  const { width } = useWindowSize()
  widthValue.value = (150 / 375) * width.value
}
onMounted(() => {
  setWidth()
  window.addEventListener('resize', setWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', setWidth)
})
</script>
<template>
  <div class="follow-foctor-page">
    <div className="follow-foctor-page-header">
      <p>推荐关注</p>
      <p class="look">查看更多<i class="van-icon van-icon-arrow" /></p>
    </div>
    <div class="follow-foctor-page-header-body">
      <van-swipe :width="widthValue" :show-indicators="false" :loop="false">
        <van-swipe-item v-for="(item, index) in doctorList" :key="index">
          <DoctorCard :item="item"></DoctorCard>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.follow-foctor-page {
  background: var(--cp-bg);
  height: 250px;
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 45px;
    padding: 0 15px;
    font-size: 13px;
    .look {
      color: var(--cp-tip);
    }
  }
}
</style>
