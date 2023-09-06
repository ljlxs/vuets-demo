<script lang="ts" setup>
import { getConsultOrderPayUrl } from '@/services/consult'
import { showToast } from 'vant'
import { ref } from 'vue'

const props = defineProps<{
  show: boolean
  orderId: string
  actualPayment: number
  onClose?: () => void
  payCallback: string
}>()
const emit = defineEmits<{
  (e: 'update:show', val: boolean): void
}>()
// 支付方式：0:微信支付，1:支付宝支付
const paymentMethod = ref<0 | 1>()
// 立即支付:支付金额
const handlePay = async () => {
  if (paymentMethod.value == undefined) return showToast('请选择支付方式')
  const res = await getConsultOrderPayUrl({
    paymentMethod: paymentMethod.value,
    orderId: props.orderId,
    payCallback: 'http://localhost:5173/#/' + props.payCallback
  })
  window.location.href = res.data.payUrl
}
</script>
<template>
  <div class="pay-page">
    <van-action-sheet
      :beforeClose="onClose"
      :show="show"
      @update:show="emit('update:show', $event)"
      title="选择支付方式"
      :close-on-popstate="false"
      :closeable="false"
    >
      <div class="content">
        <p class="actual">￥{{ actualPayment.toFixed(2) }}</p>
        <van-cell-group>
          <van-cell title="微信支付" @click="paymentMethod = 0">
            <template #icon>
              <cp-icon name="consult-wechat"></cp-icon>
            </template>
            <!-- extra:自定义单元格最右侧的额外内容 -->
            <template #extra>
              <van-checkbox :checked="paymentMethod === 0"></van-checkbox>
            </template>
          </van-cell>
          <van-cell title="支付宝支付" @click="paymentMethod = 1">
            <template #icon>
              <cp-icon name="consult-alipay"></cp-icon>
            </template>
            <template #extra>
              <van-checkbox :checked="paymentMethod === 1"></van-checkbox>
            </template>
          </van-cell>
        </van-cell-group>
        <div class="bomm">
          <van-button type="primary" round @click="handlePay"
            >立即支付</van-button
          >
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<style scoped lang="scss">
.pay-page {
  .content {
    .actual {
      text-align: center;
      margin: 15px 0;
      font-weight: 600;
      font-size: 16px;
    }
    .van-cell {
      align-items: center;
      .cp-icon {
        align-items: center;
        margin-right: 10px;
        font-size: 18px;
      }
    }
    .bomm {
      width: 100%;
      padding: 0 15px;
      margin: 15px 0;
      box-sizing: border-box;
      .van-button {
        font-size: 16px;
        width: 100%;
      }
      .disabled {
        opacity: 1;
        background: #fafafa;
        color: #d9dbde;
        border: #fafafa;
      }
    }
  }
}
</style>
