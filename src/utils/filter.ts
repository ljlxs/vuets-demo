import { ConsultFlag, IllnessTime } from '@/enum'
export const getIllnessTimeText = (val: string | number) => {
  const timeOptions = [
    { label: '一周内', value: IllnessTime.Week },
    { label: '一月内', value: IllnessTime.Month },
    { label: '半年内', value: IllnessTime.HalfYear },
    { label: '大于半年', value: IllnessTime.More }
  ]
  const data = timeOptions.find((item) => item.value === val)
  return data?.label
}
export const getConsultFlagText = (val: string | number) => {
  const timeOptions = [
    { label: '就诊过', value: ConsultFlag.isFlag },
    { label: '没就诊过', value: ConsultFlag.noFlag }
  ]
  const data = timeOptions.find((item) => item.value === val)
  return data?.label
}
