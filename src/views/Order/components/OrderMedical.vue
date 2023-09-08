<script setup lang="ts">
import type {
  MedicineResponseType,
  OrderDetailResponseType
} from '@/types/order.d.ts'
defineProps<{
  MedicineInfoList: OrderDetailResponseType | MedicineResponseType
}>()
</script>
<template>
  <div class="OrderMedical">
    <div class="top">
      <p>优医药房</p>
      <span>优医质保 假一赔十</span>
    </div>
    <div class="item van-hairline--top">
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
        <div class="item-bom van-ellipsis">用法用量: {{ item.usageDosag }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.OrderMedical {
  box-sizing: border-box;
  padding: 0 15px;
  .top {
    display: flex;
    padding: 15px 0;
    align-items: flex-end;
    > p {
      margin-right: 15px;
      font-size: 17px;
    }
    > span {
      font-size: 14px;
      color: var(--cp-tag);
    }
  }
  .item {
    .item-top {
      padding-top: 15px;
      .item-bo {
        display: flex;
        flex: 1;
        margin-left: 15px;
        .item-box {
          > h3 {
            margin-bottom: 5px;
            font-weight: normal;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .item-box-cont {
            margin-bottom: 10px;
            display: flex;
            > .sp {
              margin-left: 10px;
              font-size: 14px;
              color: var(--cp-tag);
            }
          }
        }
        .van-tag--primary {
          background: var(--cp-primary);
        }
        img {
          width: 80px;
          height: 70px;
          border-radius: 2px;
          overflow: hidden;
        }
        .price {
          font-size: 16px;
          color: #eb5757;
        }
      }
    }
    .item-bom {
      width: 100%;
      height: 26px;
      border-radius: 5px;
      background-color: var(--cp-bg);
      color: var(--cp-tag);
      line-height: 26px;
      padding-left: 10px;
      margin: 15px 0;
    }
  }
}
</style>
