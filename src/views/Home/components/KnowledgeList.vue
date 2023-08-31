<script setup lang="ts">
import { ref } from 'vue'
import KnowledgeCard from './KnowledgeCard.vue'
import { getUserInfo } from '../../../services/consult'
import type { KnowledgeParams } from '@/services/types/consult'
import type { KnowledgeList, KnowledgeType } from '@/types/consult'

const props = defineProps<{
  type: KnowledgeType
}>()
const infoPramas = ref<KnowledgeParams>({
  type: props.type,
  current: 1,
  pageSize: 10
})
const list = ref<KnowledgeList>([])
const loading = ref(false)
const finished = ref(false)
const onLoad = async () => {
  const res = await getUserInfo(infoPramas.value)
  list.value.push(...res.data.rows)
  if (infoPramas.value.current >= res.data.pageTotal) {
    finished.value = true
  } else {
    infoPramas.value.current++
    loading.value = false
  }
}
</script>

<template>
  <div class="knowledge-list-page">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <Knowledge-card
        v-for="(item, index) in list"
        :key="index"
        :item="item"
      ></Knowledge-card>
    </van-list>
  </div>
</template>
<style lang="scss" scoped>
.knowledge-list-page {
  padding: 0 15px;
}
</style>
