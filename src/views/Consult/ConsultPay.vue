<script setup lang="ts">
import { ref } from 'vue'
import { getConsultOrderPre, getPatientInfo } from '@/services/consult'
import { useConsultStore } from '@/stores/consult'
import type { ConsultOrderPreData } from '@/types/consult'
import type { PatientType } from '@/types/user.d'
const store = useConsultStore()
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
  console.log(res.data)
}
ConsultOrderPre()
// 获取患者详情信息
const patientInfo = ref<PatientType>()
const initPatientInfo = async () => {
  console.log(store.consult.patientId)

  const patientRes = await getPatientInfo(store.consult.patientId as string)
  patientInfo.value = patientRes.data
}
initPatientInfo()
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
        :price="OrderPreList?.actualPayment"
        button-text="立即支付"
      />
    </div>
    <div class="check">
      <van-checkbox v-model="agree"
        >我已同意 <span class="text">支付协议</span></van-checkbox
      >
    </div>
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
}
</style>
