<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  getPatientList,
  addPatient,
  updatePatient,
  delPatient
} from '../../services/patient'
import type { PatientType } from '../../types/user.d'
import { showToast } from 'vant'
import Validator from 'id-validator'
import { showConfirmDialog } from 'vant'
let DataList = ref()
const PatientList = async () => {
  const res = await getPatientList()
  DataList.value = res.data
}
PatientList()
const show = ref(false)
const add = () => {
  show.value = true
}
const backPopup = (item?: PatientType) => {
  if (item) {
    show.value = true
    const { id, gender, name, idCard, defaultFlag } = item
    patient.value = { id, gender, name, idCard, defaultFlag }
  } else {
    patient.value = { ...initPatient }
    show.value = false
  }
}
const options = [
  {
    label: '男',
    value: 1
  },
  {
    label: '女',
    value: 0
  }
]
const initPatient: PatientType = {
  name: '',
  idCard: '',
  defaultFlag: 0,
  gender: 0
}
const patient = ref<PatientType>({ ...initPatient })
const submit = async () => {
  if (!patient.value.name) return showToast('请输入真实姓名')
  if (!patient.value.idCard) return showToast('请输入身份证号')
  const validator = new Validator()
  if (!validator.isValid(patient.value.idCard)) return showToast('身份格式错误')
  const { sex } = validator.getInfo(patient.value.idCard)
  if (patient.value.gender !== sex) return showToast('性别不符')
  patient.value.id
    ? await updatePatient(patient.value)
    : await addPatient(patient.value)
  console.log(patient.value.id)
  showToast(patient.value.id ? '编辑成功' : '添加成功')
  PatientList()
  show.value = false
}
const defaultFlag = computed({
  get() {
    return patient.value.defaultFlag === 1 ? true : false
  },
  set(value) {
    patient.value.defaultFlag = value ? 1 : 0
  }
})
// 删除
const remove = async () => {
  if (patient.value.id) {
    await showConfirmDialog({
      title: '温馨提示',
      message: `您确认要删除 ${patient.value.name} 患者信息吗 `
    })
    await delPatient(patient.value.id)
    show.value = false
    PatientList()
    showToast('删除成功')
  }
}
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
      <div class="list-right" @click="backPopup(item)">
        <cp-icon name="user-edit"></cp-icon>
      </div>
    </div>
    <div class="patient-page-add" @click="add">
      <cp-icon name="user-add"></cp-icon>
      <p>添加患者</p>
    </div>
    <p class="bomm">最多可添加6人</p>
    <van-popup
      v-model:show="show"
      position="right"
      :style="{ width: '100%', height: '100%' }"
    >
      <cp-nav-bar
        :bock="backPopup"
        title="添加患者"
        rightText="保存"
        @click-right="submit"
      ></cp-nav-bar>
      <van-form>
        <van-field
          v-model="patient.name"
          label="真实姓名"
          placeholder="请输入真实姓名"
        />
        <van-field
          v-model="patient.idCard"
          label="身份证号"
          placeholder="请输入身份证号"
        />
        <van-field v-model="patient.age" center clearable label="性别">
          <template #input>
            <cp-radio-btn
              :options="options"
              v-model="patient.gender"
            ></cp-radio-btn>
          </template>
        </van-field>
        <van-field label="默认就诊人">
          <template #input>
            <van-checkbox round v-model="defaultFlag" />
          </template>
        </van-field>
      </van-form>
      <van-action-bar>
        <van-action-bar-button @click="remove">删除</van-action-bar-button>
      </van-action-bar>
    </van-popup>
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
  ::v-deep() {
    .van-form {
      padding-top: 46px;
    }
  }
  .van-action-bar {
    padding: 0 10px;
    margin-bottom: 10px;
    .van-button {
      color: var(--cp-price);
      background-color: var(--cp-bg);
    }
  }
}
</style>
