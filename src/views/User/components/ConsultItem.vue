<script setup lang="ts">
import type { ConsultOrderItem } from '@/types/consult'
import { OrderType } from '@/enum'
import { ref, computed } from 'vue'
import { deleteOrder, cancelOrder } from '@/services/consult'
import { showToast } from 'vant'
import useShowPrescription, { useDeleteOrder } from '@/composable/index'
import ConsultMore from './ConsultMore.vue'
const props = defineProps<{
  item: ConsultOrderItem
}>()
const emits = defineEmits<{
  (e: 'on-delte', id: number | string): void
}>()
// const showPopover = ref(false)
// const actions = computed(() => [
//   { text: '查看处方', disabled: !props.item.prescriptionId },
//   { text: '删除订单' }
// ])
// const onSelect = (item: { text: string; disabled?: boolean }, i: number) => {
//   console.log('item=>', item)
//   console.log('i', i)
//   if (i === 0) {
//     showPrescription(props.item.prescriptionId as string)
//   }
//   if (i === 1) {
//     if (props.item) {
//       dele(props.item)
//     }
//   }
// }
//删除
// const dele = async (val: ConsultOrderItem) => {
//   try {
//     await deleteOrder(val.id)
//     emits('on-delte', val.id)
//     showToast('删除成功')
//   } catch {
//     showToast('删除失败')
//   }
// }
const { dele } = useDeleteOrder((id) => {
  emits('on-delte', id)
})
// 取消
const cancel = async (val: ConsultOrderItem) => {
  try {
    await cancelOrder(val.id)
    val.status = OrderType.ConsultCancel
    val.statusValue = '已取消'
    showToast('取消成功')
  } catch {
    showToast('取消失败')
  }
}
const { showPrescription } = useShowPrescription()
</script>
<template>
  <div class="sonsult-item">
    <div class="header van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p>{{ item.docInfo?.name || '极速问诊（自动分配医生）' }}</p>
      <span>{{ item.statusValue }}</span>
    </div>
    <div class="box" @click="$router.push(`/user/consult/${item.id}`)">
      <div class="row">
        <div class="row-title">病情描述</div>
        <div class="row-pic">{{ item.illnessDesc }}</div>
      </div>
      <div class="row">
        <div class="row-title">价格</div>
        <div class="row-pic">{{ item.payment }}</div>
      </div>
      <div class="row">
        <div class="row-title">创建时间</div>
        <div class="row-pic pic">{{ item.createTime }}</div>
      </div>
    </div>
    <!-- 待支付 -->
    <div class="bom-btn" v-if="item.status == OrderType.ConsultPay">
      <van-button class="gray" plain size="small" round @click="cancel(item)"
        >取消问诊</van-button
      >
      <van-button
        type="primary"
        plain
        size="small"
        round
        @click="$router.push(`/user/consult/${item.id}`)"
        >去支付</van-button
      >
    </div>
    <!-- 待接诊 -->
    <div class="bom-btn" v-if="item.status == OrderType.ConsultWait">
      <van-button class="gray" plain size="small" round>取消问诊</van-button>
      <van-button
        type="primary"
        plain
        size="small"
        round
        @click="$router.push(`/room/${item.id}`)"
        >继续沟通</van-button
      >
    </div>
    <!-- 问诊中？ -->
    <div class="bom-btn" v-if="item.status == OrderType.ConsultChat">
      <van-button
        v-if="item.prescriptionId"
        class="gray"
        plain
        size="small"
        round
        @click="showPrescription(item.prescriptionId)"
        >查看处方</van-button
      >
      <van-button type="primary" plain size="small" round>继续沟通</van-button>
    </div>
    <!-- 问诊完成？ -->
    <div class="bom-btn" v-if="item.status == OrderType.ConsultComplete">
      <Consult-more
        @on-delete="dele(item)"
        @on-preview="showPrescription(item.prescriptionId!)"
      ></Consult-more>
      <van-button
        class="gray"
        plain
        size="small"
        round
        :to="`/room?orderId=${item.id}`"
      >
        问诊记录
      </van-button>
      <van-button
        v-if="!item.evaluateFlag"
        type="primary"
        plain
        size="small"
        round
      >
        去评价
      </van-button>
      <van-button v-else class="gray" plain size="small" round>
        查看评价
      </van-button>
    </div>
    <!-- 取消问诊 -->
    <div class="bom-btn" v-if="item.status == OrderType.ConsultCancel">
      <van-button class="gray" plain size="small" round @click="dele(item)"
        >删除订单</van-button
      >
      <van-button type="primary" plain size="small" round
        >咨询其他医生</van-button
      >
    </div>
  </div>
</template>
<style lang="scss" scoped>
.sonsult-item {
  background: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 3px;
  .header {
    display: flex;
    padding-bottom: 15px;
    margin-bottom: 15px;
    .img {
      width: 20px;
      height: 20px;
    }

    > p {
      flex: 1;
      margin-left: 10px;
    }
  }
  .box {
    .row {
      display: flex;
      margin-bottom: 7px;

      .row-title {
        width: 62px;
        font-size: 13px;
        color: var(--cp-tip);
      }
      .row-pic {
        width: 250px;
        &.pic {
          color: var(--cp-tip);
        }
      }
    }
  }
  .bom-btn {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
    .gray {
      background: #f6f7f9;
      color: #9b9695;
      margin-right: 10px;
    }
  }
}
</style>
