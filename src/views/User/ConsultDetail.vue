<script setup lang="ts">
import { getOrderDetail } from '@/services/consult'
import type { ConsultOrderItem } from '@/types/consult'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getIllnessTimeText, getConsultFlagText } from '@/utils/filter'
import ConsultMore from './components/ConsultMore.vue'
import { OrderType } from '@/enum'
import useShowPrescription, { useDeleteOrder } from '@/composable'
import { useClipboard } from '@vueuse/core'
import { showConfirmDialog, showToast } from 'vant'
const route = useRoute()
const router = useRouter()
const OrderDetailList = ref<ConsultOrderItem>()
let orderId = route.params.id as string
const OrderDetail = async () => {
  const res = await getOrderDetail(orderId)
  OrderDetailList.value = res.data
}
OrderDetail()
const { showPrescription } = useShowPrescription()
//删除
const { dele } = useDeleteOrder(() => {
  router.push('/user/consult')
})
// 复制
const { copy, isSupported } = useClipboard()
const onCopy = async () => {
  if (!isSupported) return showToast('未授权，不允许')
  await copy(OrderDetailList.value?.orderNo || '')
  showToast('已复制')
}
const show = ref(false)
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
      orderId = ''
      // router.push('/user/consult')
      return true
    })
}
</script>

<template>
  <div class="detail-page" v-if="OrderDetailList">
    <cp-nav-bar title="问诊详情"></cp-nav-bar>
    <div class="header">
      <div class="header-top">
        <div class="top-left">
          <h3>图文问诊39元</h3>
          <span>服务医生信息</span>
        </div>
        <div class="top-righr">{{ OrderDetailList.statusValue }}</div>
      </div>
      <div class="top-bom">
        <img class="avatar" src="@/assets/avatar-doctor.svg" />
        <div class="doc">
          <p>极速问诊</p>
          <p>医生</p>
        </div>
        <cp-icon name="user-arrow" />
      </div>
    </div>
    <div class="box">
      <van-cell
        title="患者信息"
        :value="`${OrderDetailList?.patientInfo.name} | ${OrderDetailList?.patientInfo.genderValue} | ${OrderDetailList?.patientInfo.age}岁`"
      />
      <van-cell
        title="患病时长"
        :value="getIllnessTimeText(OrderDetailList?.illnessTime as number)"
      />
      <van-cell
        title="就诊情况"
        :value="getConsultFlagText(OrderDetailList?.consultFlag as number)"
      />
      <van-cell title="病情描述" :label="OrderDetailList?.illnessDesc" />
    </div>
    <div style="height: 15px; width: 100%; background: #f6f7f9"></div>
    <div class="detail-order">
      <h3>订单信息</h3>
      <van-cell title="订单编号" value="内容">
        <template #value>
          <span class="copy" @click="onCopy">复制</span>
          {{ OrderDetailList.orderNo }}
        </template>
      </van-cell>
      <van-cell title="创建时间" :value="OrderDetailList.createTime" />
      <van-cell title="应付款" :value="`￥${OrderDetailList.payment}`" />
      <van-cell
        title="优惠卷"
        :value="`-￥${OrderDetailList.couponDeduction}`"
      />
      <van-cell
        title="积分抵扣"
        :value="`-￥${OrderDetailList.pointDeduction}`"
      />
      <van-cell
        title="实付款"
        :value="`￥${OrderDetailList.actualPayment}`"
        class="price"
      />
    </div>
    <!-- <Consult-more
        @on-delete="dele(item)"
        @on-preview="showPrescription(item.prescriptionId!)"
      ></Consult-more> -->
    <div
      class="fxed-bom van-hairline--top"
      v-if="OrderDetailList.status == OrderType.ConsultPay"
    >
      <div class="price">
        <span>需付款</span>
        <span>￥{{ OrderDetailList.actualPayment }}</span>
      </div>
      <van-button class="gray" plain size="small" round>取消问诊</van-button>
      <van-button type="primary" plain size="small" round @click="show = true"
        >去支付</van-button
      >
    </div>
    <!-- 待接诊 -->
    <div
      class="fxed-bom van-hairline--top"
      v-if="OrderDetailList.status == OrderType.ConsultWait"
    >
      <van-button class="gray" plain size="small" round>取消问诊</van-button>
      <van-button type="primary" plain size="small" round>继续沟通</van-button>
    </div>
    <!-- 问诊中？ -->
    <div
      class="fxed-bom van-hairline--top"
      v-if="OrderDetailList.status == OrderType.ConsultChat"
    >
      <van-button
        v-if="OrderDetailList.prescriptionId"
        class="gray"
        plain
        size="small"
        round
        >查看处方</van-button
      >
      <van-button type="primary" plain size="small" round>继续沟通</van-button>
    </div>
    <!-- 问诊完成？ -->
    <div
      class="fxed-bom van-hairline--top"
      v-if="OrderDetailList.status == OrderType.ConsultComplete"
    >
      <Consult-more
        :disabled="!OrderDetailList.prescriptionId"
        @on-delete="dele(OrderDetailList)"
        @on-preview="showPrescription(OrderDetailList.prescriptionId!)"
      ></Consult-more>
      <van-button
        class="gray"
        plain
        size="small"
        round
        :to="`/room?orderId=${OrderDetailList.id}`"
      >
        问诊记录
      </van-button>
      <van-button
        v-if="!OrderDetailList.evaluateFlag"
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
    <div
      class="fxed-bom"
      v-if="OrderDetailList.status == OrderType.ConsultCancel"
    >
      <van-button type="default" round @click="dele(OrderDetailList)"
        >删除订单</van-button
      >
      <van-button
        type="primary"
        round
        :to="`/room?orderId=${OrderDetailList.id}`"
        >继续沟通</van-button
      >
    </div>
  </div>
  <div v-else class="consult-pay-page">
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
  </div>
  <cpPaySheet
    payCallback="user/consult"
    v-model:show="show"
    :onClose="beforeClose"
    :orderId="orderId"
    :actualPayment="OrderDetailList?.actualPayment!"
  ></cpPaySheet>
</template>

<style lang="scss" scoped>
.detail-page {
  padding-top: 46px;
  .header {
    padding: 15px;
    position: relative;
    ::before {
      z-index: -1;
      width: 100%;
      height: 135px;
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      background: linear-gradient(
        180deg,
        rgba(44, 181, 165, 0),
        rgba(44, 181, 165, 0.2)
      );
      border-bottom-left-radius: 150px 20px;
      border-bottom-right-radius: 150px 20px;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      .top-left {
        padding-bottom: 10px;
        h3 {
          font-weight: 600;
        }
        span {
          color: var(--cp-tag);
          font-weight: 500;
          font-size: 14px;
          display: block;
          margin-top: 5px;
        }
      }
      .top-righr {
        color: var(--cp-primary);
        font-size: 16px;
      }
    }
    .top-bom {
      display: flex;
      padding: 20px 15px;
      border-radius: 8px;
      background: #fff;
      align-items: center;
      box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
      .avatar {
        width: 38px;
        height: 38px;
      }
      .doc {
        margin-left: 15px;
        flex: 1;
        > p:first-child {
          font-size: 16px;
        }
        > p:last-child {
          font-size: 13px;
          color: var(--cp-text3);
        }
      }
      .cp-icon {
        font-size: 20px;
      }
    }
  }
  .detail-order {
    margin-bottom: 76px;
    > h3 {
      font-weight: normal;
      padding: 10px 18px;
    }
    .copy {
      padding: 2px 10px;
      border: 1px solid var(--cp-primary);
      background-color: var(--cp-plain);
      color: var(--cp-primary);
      font-size: 12px;
      border-radius: 12px;
      margin-right: 10px;
    }
    :deep(.van-cell__title) {
      width: 70px;
      flex: none;
    }
    .price :deep(.van-cell__value) {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
  .fxed-bom {
    height: 65px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    padding: 10px 15px;
    justify-content: flex-end;
    background: #fff;
    .van-button {
      margin-left: 10px;
      padding-left: 17px;
      padding-right: 17px;
    }
    :deep(.van-button--default) {
      background-color: var(--cp-bg);
      color: var(--cp-text3);
    }
    .price {
      flex: 1;

      > span:last-child {
        font-size: 18px;
        color: var(--cp-price);
        padding-left: 5px;
      }
    }
  }
}
</style>
