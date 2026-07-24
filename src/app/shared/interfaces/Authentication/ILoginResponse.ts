export interface ILoginResponse {
  isSuccess: boolean,
  message: string,
  accessToken: string,
  expiration: string,
  refreshToken: string
}
