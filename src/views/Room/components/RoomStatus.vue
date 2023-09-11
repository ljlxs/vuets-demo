<script setup lang="ts">
import { OrderType } from '@/enum'
defineProps<{
  status: OrderType
  countdown: number
}>()
</script>
<template>
  <div class="bom">
    <van-notice-bar
      :scrollable="false"
      background=""
      text=" 已通知医生尽快接诊，24小时内医生未回复将自动退款 "
      v-if="status === OrderType.ConsultWait"
    />
    <div
      class="cslout van-hairline--top"
      v-if="status === OrderType.ConsultChat"
    >
      <p>咨询中</p>
      <p>剩余时间:<van-count-down :time="countdown * 1000" /></p>
    </div>
    <div
      class="end"
      v-if="
        status === OrderType.ConsultComplete ||
        status === OrderType.ConsultCancel
      "
    >
      <van-icon name="passed" /> 已结束
    </div>
  </div>
</template>
<style lang="scss" scoped>
.bom {
  .cslout {
    display: flex;
    justify-content: space-between;
    padding: 15px;
    background: #fff;
    > p:first-child {
      color: var(--cp-primary);
    }
    > p:last-child {
      width: 130px;
      .van-count-down {
        display: inline;
      }
    }
  }
  .end {
    display: flex;
    align-items: center;
    height: 44px;
    padding: 0 15px;
    font-weight: 500;
    .van-icon {
      font-size: 14px;
      margin-right: 4px;
      position: relative;
      top: 1px;
    }
  }
}
.van-notice-bar {
  background: #eaf8f6;
  color: var(--cp-primary);
}
</style>
