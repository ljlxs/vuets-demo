export type User =
  | {
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
  | undefined
