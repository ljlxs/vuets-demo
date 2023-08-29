import request from '@/utils/request'
import type { PatientType } from '@/types/user'
export const getPatientList = () => {
  return request<PatientType>('/patient/mylist', 'get')
}
