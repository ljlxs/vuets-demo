export type User = {
  /* token令牌 */
  token: string
  /* 用户ID */
  id: number | string
  /* 用户名称 */
  account: string
  /* 手机号 */
  mobile: number | string
  /* 头像 */
  avatar: string
}
// 匹配出非token字段的类型
type OmitUser = Omit<User, 'token'>

export type UserInfo = OmitUser & {
  collectionNumber: number
  likeNumber: number
  score: number
  couponNumber: number
  orderInfo: {
    paidNumber: number
    receivedNumber: number
    shippedNumber: number
    finishedNumber: number
  }
}
type PatientType = {
  name: string //患者姓名
  idCard: string //患者身份证号
  defaultFlag: 0 | 1 //必需是否设置为默认患者 0不是默认 1是默认患者
  gender?: 0 | 1 //性别 1男 0女可选
  genderValue: string //性别值必需
  age?: number //年龄可选
  id: string
}
export type PatientList = PatientType[]
