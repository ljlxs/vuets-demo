<script setup lang="ts">
import ConsultItem from './ConsultItem.vue'
import { getConsultOrderList } from '@/services/consult'
import type { ConsultOrderItem, ConsultOrderListParams } from '@/types/consult'
import { ref } from 'vue'
const props = defineProps<{
  type: number
}>()
const OrderListParams = ref<ConsultOrderListParams>({
  current: 1,
  pageSize: 10,
  type: props.type
})
const OrderList = ref<ConsultOrderItem[]>([])
const loading = ref(false)
const finished = ref(false)
const onLoad = async () => {
  const OrderRes = await getConsultOrderList(OrderListParams.value)
  OrderList.value.push(...OrderRes.data.rows)
  if (OrderRes.data.pageTotal > OrderListParams.value.current) {
    OrderListParams.value.current++
  } else {
    finished.value = true
  }
  loading.value = false
}
const dele = (id: string | number) => {
  OrderList.value = OrderList.value.filter((item) => item.id != id)
}
</script>
<template>
  <div class="consult-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <ConsultItem
        @on-delte="dele"
        v-for="(item, index) in OrderList"
        :key="index"
        :item="item"
      ></ConsultItem>
    </van-list>
  </div>
</template>
<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>
