import { NextFunction, Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import { User } from "../modules/user/user.model";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }

    // verify token
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const { userId, email } = verifiedUser;

    const user = await User.findOne({ _id: userId, email: email });

    if (!user?.email) {
      throw new ApiError(httpStatus.NOT_FOUND, "Your does not found");
    }

    req.body.user = user._id;

    next();
  } catch (error) {
    next(error);
  }
};

export default auth;
