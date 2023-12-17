import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { startupFilterableFields } from "./startup.constant";
import { IStartup } from "./startup.interface";
import { StartupService } from "./startup.service";

const createStartup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ...startupData } = req.body;
    const result = await StartupService.createStartup(startupData);

    sendResponse<IStartup>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully created startup",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleStartup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await StartupService.getSingleStartup(id);

    sendResponse<IStartup>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully retrieved startup",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllStartups = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = pick(req.query, startupFilterableFields);
    const result = await StartupService.getAllStartups(filters);

    sendResponse<IStartup[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully retrieved all Startups",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMyStartups = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req?.body.user;

    const result = await StartupService.myStartups(user);

    sendResponse<IStartup[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully retrieved the startups",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateStartup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: startupId } = req.params;
    const { user, ...payload } = req?.body;

    const result = await StartupService.updateStartup({
      startupId,
      payload,
      user,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully updated the startup",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteStartup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: startupId } = req.params;
    const user = req?.body.user;

    const result = await StartupService.deleteStartup({ startupId, user });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully deleted the startup",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const StartupController = {
  createStartup,
  getSingleStartup,
  getAllStartups,
  getMyStartups,
  updateStartup,
  deleteStartup,
};
