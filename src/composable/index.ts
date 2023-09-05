import { showImagePreview, showToast } from 'vant'
import { deleteOrder, getPrescriptionPic } from '@/services/consult'
import type { ConsultOrderItem } from '@/types/consult'
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
