import { IUser } from "../user/user.interface";

export type ILoginRegisterResponse = {
  user: Partial<IUser>;
  accessToken: string;
  refreshToken?: string;
};

export type ILoginUser = {
  email: string;
  password: string;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};
