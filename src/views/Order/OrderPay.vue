<script setup lang="ts">
import {
  getAdderss,
  getMedicineInfo,
  createMedicalOrder
} from '@/services/order'
import type { MedicineResponseType, addressResponseType } from '@/types/order'
import { showConfirmDialog, showToast } from 'vant'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import OrderMedical from './components/OrderMedical.vue'
const route = useRoute()
const prescriptionId = route.query.id
const agree = ref(false)
//支付方式弹框
const show = ref(false)
// 收货地址
const AdderssList = ref<addressResponseType>()
const Adderss = async () => {
  const res = await getAdderss()
  AdderssList.value = res.data[0]
}
Adderss()
// 药品信息
const MedicineInfoList = ref<MedicineResponseType>()
const MedicineInfo = async () => {
  const res = await getMedicineInfo({
    prescriptionId: prescriptionId as string
  })
  MedicineInfoList.value = res.data
}
MedicineInfo()
const medicalOrderId = ref<string>()
const submit = async () => {
  if (!agree.value) return showToast('请勾选我同意')
  if (!AdderssList.value?.id) return showToast('请选择收货地址')
  if (!MedicineInfoList.value) return showToast('未找到处方')
  const res = await createMedicalOrder({
    id: prescriptionId as string,
    addressId: AdderssList.value.id
  })
  show.value = true
  medicalOrderId.value = res.data.id
}
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
      return true
    })
}
</script>

<template>
  <div v-if="AdderssList" class="pay-page">
    <cp-nav-bar title="药品订单详情"></cp-nav-bar>
    <div class="header">
      <div class="top">
        <van-icon name="location" /><span
          >{{ AdderssList?.city }}{{ AdderssList?.county }}</span
        >
        <p class="dip">{{ AdderssList?.addressDetail }}</p>
        <p>
          {{ AdderssList?.receiver }}
          {{
            AdderssList?.mobile?.replace(/^(\d{3})\d+(\d{4})$/, '\$1****\$2')
          }}
        </p>
      </div>
    </div>
    <div class="bg"></div>
    <div class="box">
      <!-- <div class="top">
        <p>优医药房</p>
        <span>优医质保 假一赔十</span>
      </div> -->
      <OrderMedical :MedicineInfoList="MedicineInfoList!" />
      <!-- <div class="item van-hairline--top">
        <div
          class="item-top"
          v-for="(item, index) in MedicineInfoList?.medicines"
          :key="index"
        >
          <div class="item-bo">
            <img :src="item.avatar" />
            <div class="item-box">
              <h3>
                {{ item.name }}
                <p>X{{ item.quantity }}</p>
              </h3>
              <div class="item-box-cont">
                <van-tag type="primary" v-if="item.prescriptionFlag === 1"
                  >处方药</van-tag
                >
                <span class="sp">{{ item.specs }}</span>
              </div>
              <p class="price">￥{{ item.amount }}</p>
            </div>
          </div>
          <div class="item-bom van-ellipsis">
            用法用量: {{ item.usageDosag }}
          </div>
        </div>
      </div> -->
    </div>
    <van-cell-group>
      <van-cell title="药品金额" :value="`￥${MedicineInfoList?.payment}`" />
      <van-cell title="运费" :value="`￥${MedicineInfoList?.expressFee}`" />
      <van-cell
        title="优惠卷"
        :value="`-￥${MedicineInfoList?.couponDeduction}`"
      />
      <van-cell
        title="实付款"
        :value="`￥${MedicineInfoList?.actualPayment}`"
      />
    </van-cell-group>
    <div class="redd">
      由于药品的特殊性，如非错发、漏发药品的情况，药品一经发出
      不得退换，请核对药品信息无误后下单。
    </div>
    <div class="check">
      <van-checkbox v-model="agree"
        >我已同意 <span class="text">支付协议</span></van-checkbox
      >
    </div>
    <div class="flexd">
      <van-submit-bar
        :price="3050"
        button-text="提交订单"
        text-align="left"
        button-type="primary"
        @submit="submit"
      />
    </div>
  </div>
  <div v-else class="consult-pay-page">
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
  </div>
  <cpPaySheet
    payCallback="order/pay/result"
    v-model:show="show"
    :onClose="beforeClose"
    :orderId="medicalOrderId!"
    :actualPayment="MedicineInfoList?.actualPayment!"
  ></cpPaySheet>
</template>

<style lang="scss" scoped>
.pay-page {
  padding-top: 46px;
  :deep(.van-nav-bar__content) {
    background-color: var(--cp-primary);
    .van-icon {
      color: #fff;
    }
    .van-nav-bar__title {
      color: #fff;
    }
  }
  .header {
    padding: 20px 15px;
    .top {
      .van-icon {
        font-size: 14px;
        color: var(--cp-orange);
        margin-bottom: 5px;
      }
      span {
        color: var(--cp-tag);
        margin-bottom: 5px;
      }
      .dip {
        font-size: 17px;
        margin-bottom: 5px;
      }
    }
  }
  .bg {
    width: 100%;
    height: 15px;
    background: var(--cp-bg);
  }
  .box {
    padding: 0 15px;
    // .top {
    //   display: flex;
    //   padding: 15px 0;
    //   align-items: flex-end;
    //   > p {
    //     margin-right: 15px;
    //     font-size: 17px;
    //   }
    //   > span {
    //     font-size: 14px;
    //     color: var(--cp-tag);
    //   }
    // }
    // .item {
    //   .item-top {
    //     padding-top: 15px;
    //     .item-bo {
    //       display: flex;
    //       flex: 1;
    //       margin-left: 15px;
    //       .item-box {
    //         > h3 {
    //           margin-bottom: 5px;
    //           font-weight: normal;
    //           display: flex;
    //           justify-content: space-between;
    //           align-items: center;
    //         }
    //         .item-box-cont {
    //           margin-bottom: 10px;
    //           display: flex;
    //           > .sp {
    //             margin-left: 10px;
    //             font-size: 14px;
    //             color: var(--cp-tag);
    //           }
    //         }
    //       }
    //       .van-tag--primary {
    //         background: var(--cp-primary);
    //       }
    //       img {
    //         width: 80px;
    //         height: 70px;
    //         border-radius: 2px;
    //         overflow: hidden;
    //       }
    //       .price {
    //         font-size: 16px;
    //         color: #eb5757;
    //       }
    //     }
    //   }
    //   .item-bom {
    //     width: 100%;
    //     height: 26px;
    //     border-radius: 5px;
    //     background-color: var(--cp-bg);
    //     color: var(--cp-tag);
    //     line-height: 26px;
    //     padding-left: 10px;
    //     margin: 15px 0;
    //   }
    // }
  }
  .redd {
    font-size: 12px;
    color: var(--cp-tag);
    padding: 0 15px;
    margin-bottom: 30px;
    &::before {
      content: '*';
      color: var(--cp-orange);
      font-size: 14px;
    }
  }
  .check {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 60px;
    .text {
      color: var(--cp-primary);
    }
  }
  .flexd {
    .van-submit-bar {
      align-items: center;
      :deep(.van-button) {
        width: 200px;
      }
    }
  }
}
</style>
