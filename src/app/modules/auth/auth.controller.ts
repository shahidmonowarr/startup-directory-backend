import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import sendResponse from "../../../shared/sendResponse";
import {
  ILoginRegisterResponse,
  IRefreshTokenResponse,
} from "./auth.interface";
import { AuthService } from "./auth.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ...userData } = req.body;
    const result = await AuthService.createUser(userData);

    const { refreshToken, ...otherResult } = result;

    // set refresh token
    const cookieOptions = {
      secure: config.env === "production",
      httpOnly: true,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    sendResponse<ILoginRegisterResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully registered",
      data: otherResult,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ...userData } = req.body;

    if (!userData.email) {
      throw new ApiError(400, "Email required");
    }
    if (!userData.password) {
      throw new ApiError(400, "Password required");
    }

    const result = await AuthService.loginUser(userData);

    const { refreshToken, ...otherResult } = result;

    // set refresh token
    const cookieOptions = {
      secure: config.env === "production",
      httpOnly: true,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    sendResponse<ILoginRegisterResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully logged in",
      data: otherResult,
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.cookies;

    const result = await AuthService.refreshToken(refreshToken);

    // set refresh token into cookie
    const cookieOptions = {
      secure: config.env === "production",
      httpOnly: true,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    sendResponse<IRefreshTokenResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AuthService.getCurrentUser(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User retrieved successfully",
      data: {
        user: result,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("refreshToken");

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User retrieved successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const AuthController = {
  createUser,
  loginUser,
  refreshToken,
  getCurrentUser,
  logoutUser,
};
