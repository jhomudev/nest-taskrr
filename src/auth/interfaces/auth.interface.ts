export interface AuthLoginReponse {
  accessToken: string;
  user: string;
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
