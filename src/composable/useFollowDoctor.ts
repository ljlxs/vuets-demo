import type { LikeParams, FollowType } from '@/types/consult'
import { ref } from 'vue'
import { getlike } from '../services/consult'
export default function useFollowDoctor() {
  const loading = ref(false)
  const followDoctor = async (
    item: { id: string; likeFlag: 0 | 1 },
    type: FollowType = 'doc'
  ) => {
    loading.value = true
    try {
      await getlike({ id: item.id, type })
      item.likeFlag = item.likeFlag === 1 ? 0 : 1
    } finally {
      loading.value = false
    }
  }
  return {
    followDoctor,
    loading
  }
}
