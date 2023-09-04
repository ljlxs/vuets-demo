<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { FormConsult, Image } from '@/types/consult'
import type {
  UploaderAfterRead,
  UploaderFileListItem
} from 'vant/lib/uploader/types'
import { uploadImage } from '@/services/consult'
import { showConfirmDialog, showToast } from 'vant'
import { useConsultStore } from '@/stores/consult'
import { useRouter } from 'vue-router'
import { IllnessTime, ConsultFlag } from '@/enum'
const store = useConsultStore()
const router = useRouter()
onMounted(async () => {
  if (!store.consult.illnessDesc) return
  await showConfirmDialog({
    title: '温馨提示',
    message: '是否恢复您之前填写的病情信息呢？',
    confirmButtonColor: 'var(--cp-primary)',
    closeOnPopstate: false
  })
  const { illnessDesc, illnessTime, consultFlag, pictures } = store.consult
  form.value = { illnessDesc, illnessTime, consultFlag, pictures }
  fileList.value = pictures || []
  console.log(form.value)
})
// 保存的是上传的图片
const fileList = ref<Image[]>([])
const timeOptions = [
  { label: '一周内', value: IllnessTime.Week },
  { label: '一月内', value: IllnessTime.Month },
  { label: '半年内', value: IllnessTime.HalfYear },
  { label: '大于半年', value: IllnessTime.More }
]

const flagOptions = [
  { label: '就诊过', value: ConsultFlag.isFlag },
  { label: '没就诊过', value: ConsultFlag.noFlag }
]
const form = ref<FormConsult>({
  illnessDesc: '',
  illnessTime: undefined,
  consultFlag: undefined,
  pictures: []
})
const disabledStatus = computed(() => {
  return (
    !form.value.illnessDesc ||
    form.value.illnessTime === undefined ||
    form.value.consultFlag === undefined
  )
})
const afterRead: UploaderAfterRead = async (item: any) => {
  if (!item.file) return
  item.status = 'uploading'
  item.message = '上传中...'
  try {
    const res = await uploadImage(item.file)
    form.value.pictures?.push(res.data)
    item.url = res.data.url
    item.status = 'done'
    item.message = ''
  } catch {
    item.status = 'failed'
    item.message = '上传失败'
  }
}
const onDeleteImg = (item: UploaderFileListItem) => {
  form.value.pictures = form.value.pictures?.filter((el) => el.url != item.url)
}
// 下一步
const next = () => {
  if (!form.value.illnessDesc) return showToast('请输入病情描述')
  if (form.value.illnessTime == undefined)
    return showToast('请选择症状持续时间')
  if (form.value.consultFlag == undefined)
    return showToast('请选择是否已经就诊')
  console.log(form.value)
  // 将病情描述数据存储到pinia
  store.setIllness(form.value)
  // 跳转到选择患者页面
  router.push('/user/patient?isChange=1')
}
</script>
<template>
  <div class="illness-page">
    <cp-nav-bar title="图文问诊"></cp-nav-bar>
    <div class="header van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <div class="info">
        <p class="tit">在线医生</p>
        <p class="tip">
          请描述你的疾病或症状、是否用药、就诊经历，需要我听过什么样的帮助
        </p>
        <p class="safe">
          <cp-icon name="consult-safe" /><span>内容仅医生可见</span>
        </p>
      </div>
    </div>
    <div class="illness-page-box">
      <van-field
        type="textarea"
        rows="3"
        placeholder="请详细描述您的病情，病情描述不能为空"
        v-model="form.illnessDesc"
      ></van-field>
      <div class="item">
        <p>本次患病多久了？</p>
        <cp-radio-btn
          :options="timeOptions"
          v-model="form.illnessTime"
        ></cp-radio-btn>
      </div>
      <div class="item">
        <p>此次病情是否去医院就诊过？</p>
        <cp-radio-btn
          :options="flagOptions"
          v-model="form.consultFlag"
        ></cp-radio-btn>
      </div>
      <div class="upImg">
        <van-uploader
          :max-size="5 * 1024 * 1024"
          max-count="9"
          upload-icon="photo-o"
          upload-text="上传图片"
          v-model="fileList"
          :after-read="afterRead"
          @delete="onDeleteImg"
        />
        <div class="tip" v-if="fileList.length <= 0">
          上传内容仅医生可见,最多9张图,最大5MB
        </div>
      </div>
    </div>
    <div class="bomm">
      <van-button
        @click="next"
        :class="{ disabled: disabledStatus }"
        round
        type="primary"
        >下一步</van-button
      >
    </div>
  </div>
</template>
<style lang="scss" scoped>
.illness-page {
  padding-top: 46px;
  .header {
    display: flex;
    padding: 15px;
    .img {
      width: 52px;
      height: 52px;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 10px;
    }
    .info {
      flex: 1;
      margin-left: 10px;
      .tit {
        font-size: 16px;
        margin-bottom: 5px;
      }
      .tip {
        border-radius: 3px;
        font-size: 12px;
        color: var(--cp-text3);
        background-color: var(--cp-bg);
        padding: 10px;
        margin-bottom: 5px;
      }
      .safe {
        font-size: 12px;
        color: var(--cp-text3);
        display: flex;
        ::v-deep() {
          .cp-icon {
            font-size: 12px;
            margin-right: 2px;
          }
        }
      }
    }
  }
  &-box {
    padding: 15px;
    .upImg {
      display: flex;
      align-items: center;
      .tip {
        font-size: 12px;
        color: var(--cp-tip);
      }
      ::v-deep() {
        .van-uploader {
          &__preview {
            &-delete {
              left: -6px;
              top: -6px;
              border-radius: 50%;
              background-color: var(--cp-primary);
              width: 20px;
              height: 20px;
              &-icon {
                transform: scale(0.9) translate(-22%, 22%);
              }
            }
            &-image {
              border-radius: 8px;
              overflow: hidden;
            }
          }
          &__upload {
            border-radius: 8px;
          }
          &__upload-icon {
            color: var(--cp-text3);
          }
        }
      }
    }

    .van-field {
      padding: 0;
      &::after {
        border-bottom: none;
      }
    }
    .item {
      > p {
        color: var(--cp-text3);
        padding: 15px 0;
      }
    }
    .van-uploader {
      padding-top: 10px;
    }
  }
  .bomm {
    width: 100%;
    padding: 0 15px;
    margin-top: 20px;
    box-sizing: border-box;
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
}
</style>
