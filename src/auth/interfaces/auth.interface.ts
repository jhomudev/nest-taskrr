export interface AuthLoginReponse {
  user: string;
  accessToken: string;
  refreshToken: string;
}

export interface AuthTokenResult {
  sub: string;
  username: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface IUseToken {
  sub: string;
  username: string;
  email: string;
  role: string;
  isExpired: boolean;
}
