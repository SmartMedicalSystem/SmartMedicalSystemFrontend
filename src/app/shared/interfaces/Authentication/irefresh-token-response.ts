export interface IRefreshTokenResponse {
  isSuccess: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  expiration: string;
}