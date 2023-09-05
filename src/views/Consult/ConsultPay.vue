<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getConsultOrderPre, getPatientInfo } from '@/services/consult'
import { useConsultStore } from '@/stores/consult'
import type { ConsultOrderPreData } from '@/types/consult'
import type { PatientType } from '@/types/user.d'
import { showConfirmDialog, showToast } from 'vant'
import { createConsultOrder } from '@/services/consult'
import { useRouter } from 'vue-router'
import cpPaySheet from '@/components/cp-pay-sheet.vue'
const store = useConsultStore()
const router = useRouter()
const agree = ref(false)
// 预支付信息
const OrderPreList = ref<ConsultOrderPreData>()
const ConsultOrderPre = async () => {
  const res = await getConsultOrderPre({
    type: store.consult.type,
    illnessType: store.consult.illnessType
  })
  store.setCouponId(res.data.couponId as string)
  OrderPreList.value = res.data
}
ConsultOrderPre()
// 获取患者详情信息
const patientInfo = ref<PatientType>()
const initPatientInfo = async () => {
  const patientRes = await getPatientInfo(store.consult.patientId as string)
  patientInfo.value = patientRes.data
}
initPatientInfo()
const show = ref(false)
const orderId = ref('')
// 支付方式：0:微信支付，1:支付宝支付
// const paymentMethod = ref()
// 立即支付:弹出支付方式
const onPayment = async () => {
  if (!agree.value) return showToast('请勾选我同意')
  const res = await createConsultOrder(store.consult)
  orderId.value = res.data.id
  store.clear()
  show.value = true
}

// 立即支付:支付金额
// const handlePay = async () => {
//   if (paymentMethod.value == undefined) return showToast('请选择支付方式')
//   const res = await getConsultOrderPayUrl({
//     paymentMethod: paymentMethod.value,
//     orderId: orderId.value,
//     payCallback: 'http://localhost:5173/#/room'
//   })
//   window.location.href = res.data.payUrl
// }
const beforeClose = () => {
  return showConfirmDialog({
    title: '关闭支付',
    message: '取消支付将无法获得医生回复，医生接诊名额有限，是否确认关闭？',
    cancelButtonText: '仍要关闭',
    confirmButtonText: '继续支付',
    confirmButtonColor: 'var(--cp-primary)'
  })
    .then(() => {
      return false
    })
    .catch(() => {
      orderId.value = ''
      router.push('/user/consult')
      return true
    })
}
onMounted(() => {
  if (
    !store.consult.type ||
    !store.consult.illnessDesc ||
    !store.consult.illnessTime ||
    !store.consult.patientId ||
    !store.consult.depId
  ) {
    return showConfirmDialog({
      title: '温馨提示',
      message:
        '问诊信息不完整请重新填写，如有未支付的问诊订单可在问诊记录中继续支付',
      closeOnPopstate: false,
      showCancelButton: false
    }).then(() => {
      router.push('/')
    })
  }
  ConsultOrderPre()
  initPatientInfo()
})
</script>
<template>
  <div class="consult-pay-page" v-if="patientInfo">
    <cp-nav-bar title="支付"></cp-nav-bar>
    <div class="inquiry">
      <h3>图文问诊{{ OrderPreList?.payment }}元</h3>
      <div class="inquiry-img">
        <img class="img" src="@/assets/avatar-doctor.svg" />
        <div class="rig">
          <p>极速问诊</p>
          <p>自动分配医生</p>
        </div>
      </div>
    </div>
    <van-cell-group>
      <van-cell title="优惠卷" :value="`-￥${OrderPreList?.couponDeduction}`" />
      <van-cell
        title="单积分抵扣"
        :value="`-￥${OrderPreList?.pointDeduction}`"
      />
      <van-cell
        class="payment"
        title="实付款"
        :value="`￥${OrderPreList?.actualPayment}`"
      />
    </van-cell-group>
    <div class="bg"></div>
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patientInfo?.name} | ${
          patientInfo?.gender ? '男' : '女'
        } | ${patientInfo?.age}
        岁`"
      />
      <van-cell title="病情描述" :label="store.consult.illnessDesc" />
    </van-cell-group>
    <div class="bom">
      <van-submit-bar
        text-align="left"
        button-type="primary"
        :price="(OrderPreList?.actualPayment as number) * 100"
        button-text="立即支付"
        @click="onPayment"
      />
    </div>
    <div class="check">
      <van-checkbox v-model="agree"
        >我已同意 <span class="text">支付协议</span></van-checkbox
      >
    </div>
    <cpPaySheet
      v-model:show="show"
      :onClose="beforeClose"
      :orderId="orderId"
      :actualPayment="OrderPreList?.actualPayment!"
    ></cpPaySheet>
    <!-- <van-action-sheet
      :beforeClose="beforeClose"
      v-model:show="show"
      title="选择支付方式"
      :close-on-popstate="false"
      :closeable="false"
    >
      <div class="content">
        <p class="actual">￥{{ OrderPreList?.actualPayment.toFixed(2) }}</p>
        <van-cell-group>
          <van-cell title="微信支付" @click="paymentMethod = 0">
            <template #icon>
              <cp-icon name="consult-wechat"></cp-icon>
            </template>
            //extra:自定义单元格最右侧的额外内容
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
    </van-action-sheet> -->
  </div>
  <div v-else class="consult-pay-page">
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
  </div>
</template>
<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
  .inquiry {
    padding: 15px;
    h3 {
      font-weight: normal;
      margin-bottom: 10px;
    }
    .inquiry-img {
      display: flex;
      .img {
        width: 38px;
        height: 38px;
        border-radius: 4px;
        overflow: hidden;
      }
      .rig {
        margin-left: 10px;
        > p:first-child {
          font-size: 16px;
          color: var(--cp-text2);
        }
        > p:last-child {
          color: var(--cp-tag);
        }
      }
    }
  }
  .payment {
    ::v-deep() {
      .vam-cell__title {
        font-size: 16px;
      }
      .van-cell__value {
        font-size: 16px;
        color: var(--cp-price);
      }
    }
  }

  .check {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    .text {
      color: var(--cp-primary);
    }
  }
  ::v-deep() {
    .van-submit-bar__button {
      font-weight: normal;
      width: 160px;
    }
  }
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
