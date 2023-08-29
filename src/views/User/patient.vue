<script setup lang="ts">
import { ref } from 'vue'
import { getPatientList } from '@/services/patient'
let DataList = ref()
const PatientList = async () => {
  const res = await getPatientList()
  DataList.value = res.data
}
PatientList()
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar title="家庭档案"></cp-nav-bar>
    <div
      class="patient-page-list"
      v-for="(item, index) in DataList"
      :key="index"
    >
      <div class="list-left">
        <div class="left-top">
          <p class="name">{{ item.name }}</p>
          <p class="flex">
            {{ item.idCard.replace(/^(.{6})(?:\d+)(.{4})$/, '\$1******\$2') }}
          </p>
          <div class="biaoq" v-if="item.defaultFlag == 1">默认</div>
        </div>
        <div class="left-bom">
          <span class="gender">{{ item.gender == 1 ? '男' : '女' }}</span>
          <span>{{ item.age }}岁</span>
        </div>
      </div>
      <div class="list-right">
        <cp-icon name="user-edit"></cp-icon>
      </div>
    </div>
    <div class="patient-page-add">
      <cp-icon name="user-add"></cp-icon>
      <p>添加患者</p>
    </div>
    <p class="bomm">最多可添加6人</p>
  </div>
</template>
<style lang="scss" scoped>
.patient-page {
  padding: 46px 0 80px;
  &-list {
    display: flex;
    margin: 15px;
    padding: 15px;
    background: var(--cp-bg);
    border-radius: 5px;
    justify-content: space-between;
    .list-left {
      width: 90%;
      .left-top {
        display: flex;
        align-items: center;
        padding-right: 15px;
        .name {
          width: 60px;
          font-size: 16px;
          color: var(--cp-text1);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .flex {
          flex: 1;
        }
        .biaoq {
          width: 30px;
          background: var(--cp-primary);
          color: white;
          border-radius: 3px;
          font-size: 12px;
          text-align: center;
        }
      }
      .left-bom {
        color: var(--cp-tip);
        margin-top: 15px;
        .gender {
          margin-right: 15px;
        }
      }
    }
    .list-right {
      display: flex;
      align-items: center;
      color: var(--cp-tip);
    }
  }
  &-add {
    margin: 15px;
    padding: 15px;
    background: var(--cp-bg);
    border-radius: 5px;
    text-align: center;
    color: var(--cp-primary);
    ::v-deep() {
      .cp-icon {
        font-size: 24px;
      }
    }
  }
  .bomm {
    margin-left: 10px;
    color: #a2a2a2;
  }
}
</style>
