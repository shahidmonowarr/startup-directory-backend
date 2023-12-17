import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { ILoginRegisterResponse, ILoginUser } from "./auth.interface";

const createUser = async (payload: IUser): Promise<ILoginRegisterResponse> => {
  const existUser = await User.findOne({ email: payload.email });

  if (existUser) {
    throw new ApiError(httpStatus.CONFLICT, "User Already Exist");
  }

  const newUser = await User.create(payload);

  if (!newUser) {
    throw new ApiError(400, "Failed to create user");
  }

  // access token & refresh token
  const { _id, email } = newUser;

  const accessToken = jwtHelpers.createToken(
    { userId: _id, email },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId: _id, email },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    user: newUser,
    accessToken,
    refreshToken,
  };
};

const loginUser = async (
  payload: ILoginUser
): Promise<ILoginRegisterResponse> => {
  const { email, password } = payload;

  const isUserExist = await User.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not Exist");
  }

  // Match password
  const isPasswordMatched =
    isUserExist.password &&
    (await User.isPasswordMatched(password, isUserExist?.password));

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email or password incorrect");
  }

  // access token & refresh token
  const { _id, email: userEmail } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { userId: _id, email: userEmail },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId: _id, email: userEmail },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  const user = {
    email: isUserExist.email,
    name: isUserExist.name,
  };

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  // verify token
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid Refresh Token");
  }

  const { email } = verifiedToken;
  const isUserExist = await User.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  const newAccessToken = jwtHelpers.createToken(
    {
      userId: isUserExist?._id,
      email: isUserExist?.email,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return { accessToken: newAccessToken };
};

const getCurrentUser = async (payload: { user: string }) => {
  const user = await User.findById(payload.user);

  return { name: user?.name, email: user?.email };
};

export const AuthService = {
  createUser,
  loginUser,
  refreshToken,
  getCurrentUser,
};
