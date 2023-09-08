import { showImagePreview, showToast } from 'vant'
import { deleteOrder, getPrescriptionPic } from '@/services/consult'
import type { ConsultOrderItem } from '@/types/consult'
import { getMedicalOrderDetail } from '@/services/order'
import { ref } from 'vue'
import type { OrderDetailResponseType } from '@/types/order'
export default function useShowPrescription() {
  const showPrescription = async (val: string | number) => {
    const res = await getPrescriptionPic(val)
    if (res.data.id) {
      showImagePreview([res.data.url])
    }
  }
  return {
    showPrescription
  }
}
// 删除
export function useDeleteOrder(cd: (id: string | number) => void) {
  const dele = async (val: ConsultOrderItem) => {
    try {
      await deleteOrder(val.id)
      cd && cd(val.id)
      // emits('on-delte', val.id)
      showToast('删除成功')
    } catch {
      showToast('删除失败')
    }
  }
  return {
    dele
  }
}
// 取消
export function useCancelOrder() {}
// 获取药品订单详情
export function useMedicineOrderDetail(id: string) {
  const item = ref<OrderDetailResponseType>()
  const MedicalOrderDetail = async () => {
    console.log('index', id)
    const res = await getMedicalOrderDetail(id)
    item.value = res.data
  }
  MedicalOrderDetail()
  return {
    item,
    MedicalOrderDetail
  }
}
