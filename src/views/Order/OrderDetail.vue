<script setup lang="ts">
import { useMedicineOrderDetail } from '@/composable'
import OrderMedical from './components/OrderMedical.vue'
import { useRoute } from 'vue-router'
import { OrderType } from '@/enum'
const route = useRoute()
const { item } = useMedicineOrderDetail(route.params.id as string)
</script>
<template>
  <div class="OrderDetail">
    <cp-nav-bar title="药品订单详情"></cp-nav-bar>
    <div class="header" @click="$router.push(`/order/logistics/${item?.id}`)">
      <div class="top-bom">
        <div class="doc">
          <p>快件到达【上海徐汇网点】</p>
          <p>2023-09-08 08:01:14</p>
        </div>
        <cp-icon name="user-arrow" />
      </div>
    </div>
    <div class="div">
      <OrderMedical :MedicineInfoList="item!"></OrderMedical>
    </div>
    <van-cell-group>
      <van-cell title="药品金额" :value="`￥${item?.payment}`" />
      <van-cell title="运费" :value="`￥${item?.expressFee}`" />
      <van-cell title="优惠卷" :value="`-￥${item?.couponDeduction}`" />
      <van-cell title="实付款" :value="`￥${item?.actualPayment}`" />
      <van-cell title="订单编号" :value="`${item?.orderNo}`" />
      <van-cell title="创建时间" :value="`${item?.createTime}`" />
      <template
        v-if="
          item?.status === OrderType.MedicineSend ||
          item?.status === OrderType.MedicineTake ||
          item?.status === OrderType.MedicineComplete
        "
      >
        <van-cell title="支付时间" :value="item?.payTime" />
        <van-cell
          title="支付方式"
          :value="item?.paymentMethod === 0 ? '微信' : '支付宝'"
        />
      </template>
    </van-cell-group>
    <!-- 已取消 -->
    <van-action-bar v-if="item?.status === OrderType.MedicineCancel">
      <van-action-bar-icon icon="delete-o" text="删除" />
      <van-action-bar-button type="primary" text="沟通记录" />
    </van-action-bar>
    <!-- 待收货 -->
    <van-action-bar v-if="item?.status === OrderType.MedicineTake">
      <van-action-bar-button type="primary" text="确认收货" />
    </van-action-bar>
    <!-- 待发货 -->
    <van-action-bar v-if="item?.status === OrderType.MedicineSend">
      <van-action-bar-button type="primary" text="提醒发货" />
    </van-action-bar>
    <!-- 待支付 -->
    <van-action-bar v-if="item?.status === OrderType.MedicinePay">
      <p class="price">
        需要支付：<span>￥ {{ item.actualPayment }}</span>
      </p>
      <van-action-bar-button color="#bbb" text="取消问诊" />
      <van-action-bar-button type="primary" text="继续支付" />
    </van-action-bar>
    <!-- 已完成 -->
    <van-action-bar v-if="item?.status === OrderType.MedicineComplete">
      <van-action-bar-icon icon="delete-o" text="删除" />
      <van-action-bar-button type="primary" text="再次购买" />
    </van-action-bar>
  </div>
</template>
<style lang="scss" scoped>
.OrderDetail {
  padding-top: 46px;
  .header {
    padding: 15px;
    position: relative;
    ::before {
      z-index: -1;
      width: 100%;
      height: 80px;
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
  .van-cell-group {
    margin-bottom: 50px;
  }
}
</style>
