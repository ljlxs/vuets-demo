import request from '@/utils/request'
import type { PatientList, PatientType } from '@/types/user'
// 查询患者
export const getPatientList = () => {
  return request<PatientList>('/patient/mylist', 'get')
}
// 添加患者
export const addPatient = (data: PatientType) => {
  return request('/patient/add', 'post', data)
}
// 编辑患者信息
export const updatePatient = (data: PatientType) => {
  return request('/patient/update', 'put', data)
}
// 删除患者信息
export const delPatient = (id: number | string) => {
  return request(`/patient/del/${id}`, 'DELETE')
}
