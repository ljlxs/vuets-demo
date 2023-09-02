<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  getPatientList,
  addPatient,
  updatePatient,
  delPatient
} from '@/services/patient'
import type { PatientList, PatientType } from '@/types/user.d'
import { showToast } from 'vant'
import Validator from 'id-validator'
import { showConfirmDialog } from 'vant'
import { useRoute } from 'vue-router'
import { useConsultStore } from '@/stores/consult'
import router from '@/router'
const route = useRoute()
const store = useConsultStore()
const isChange = computed(() => {
  return route.query.isChange
})
const DataList = ref<PatientList>()
const tientList = async () => {
  const res = await getPatientList()
  DataList.value = res.data

  if (isChange.value && DataList.value.length) {
    const defPatient = DataList.value.find((item) => item.defaultFlag === 1)
    if (defPatient) {
      itemId.value = defPatient.id as string
    } else {
      itemId.value = DataList.value[0].id as string
    }
  }
}
tientList()
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
  tientList()
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
    tientList()
    showToast('删除成功')
  }
}
const itemId = ref<string>('')
const cssBor = (val: PatientType) => {
  if (isChange.value) {
    itemId.value = val.id as string
  }
}
const next = () => {
  if (!itemId.value) return showToast('请选就诊择患者')
  store.setPatientId(itemId.value)
  router.push('/consult/pay')
}
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar :title="isChange ? '选择患者' : '家庭档案'"></cp-nav-bar>
    <div v-if="isChange" class="information">
      <h3>请选择患者信息</h3>
      <p>以便医生给出更准确的治疗，信息仅医生可见</p>
    </div>
    <div
      class="patient-page-list"
      @click="cssBor(item)"
      :class="{ selected: item.id === itemId }"
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
    <!-- 底部按钮 -->
    <div v-if="isChange" class="bomBtn">
      <van-button @click="next" round type="primary">下一步</van-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.patient-page {
  padding: 46px 0 80px;
  .information {
    padding: 15px;
    > h3 {
      font-weight: normal;
      margin-bottom: 5px;
    }
    > p {
      color: var(--cp-text3);
    }
  }
  &-list {
    display: flex;
    margin: 15px;
    padding: 15px;
    background: var(--cp-bg);
    border-radius: 5px;
    justify-content: space-between;
    border: 1px solid var(--cp-bg);
    &.selected {
      border-color: var(--cp-primary);
      background-color: var(--cp-plain);
    }
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
  .bomBtn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0 15px;
    margin-top: 20px;
    box-sizing: border-box;
    background: #fff;
    .van-button {
      font-size: 16px;
      margin-top: 13px;
      width: 100%;
    }
    .disabled {
      opacity: 1;
      background: #fafafa;
      color: #d9dbde;
      border: #fafafa;
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
