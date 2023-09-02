import request from '@/utils/request'
import type { KnowledgeParams } from './types/consult'
import type {
  PageParams,
  KnowledgePage,
  DoctorPage,
  LikeParams,
  DepList,
  Image,
  ConsultOrderPreParams,
  ConsultOrderPreData
} from '@/types/consult'
import type { PatientType } from '@/types/user'
// 首页关注
export const getUserInfo = (data: KnowledgeParams) => {
  return request<KnowledgePage>('/patient/home/knowledge', 'get', data)
}
// 首页关注列表
export const getPageDoc = (data: PageParams) => {
  return request<DoctorPage>('/home/page/doc', 'get', data)
}
// 关注
export const getlike = (data: LikeParams) => {
  return request('/like', 'post', data)
}
// 查询所有科室-层级
export const getAllDep = () => {
  return request<DepList>('/dep/all', 'GET')
}
// 上传
export const uploadImage = (file: File) => {
  const fd = new FormData()
  fd.append('file', file)
  return request<Image>('/upload', 'POST', fd)
}
// 拉取预支付订单信息
export const getConsultOrderPre = (OrderPreParams: ConsultOrderPreParams) => {
  return request<ConsultOrderPreData>(
    '/patient/consult/order/pre',
    'GET',
    OrderPreParams
  )
}
// 获取患者信息
export const getPatientInfo = (id: string) => {
  return request<PatientType>(`/patient/info/${id}`, 'GET')
}
