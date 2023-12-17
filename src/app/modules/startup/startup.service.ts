import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { startupSearchableFields } from "./startup.constant";
import { IStartup, IStartupFilters } from "./startup.interface";
import { Startup } from "./startup.model";

const createStartup = async (payload: IStartup): Promise<IStartup> => {
  const newStartup = await Startup.create(payload);

  if (!newStartup) {
    throw new ApiError(400, "Startup could not be created");
  }

  return newStartup;
};

const getSingleStartup = async (id: string): Promise<IStartup> => {
  const startup = await Startup.findById({ _id: id });

  if (!startup) {
    throw new ApiError(400, "Startup does not exist");
  }

  return startup;
};

const getAllStartups = async (
  filters: IStartupFilters
): Promise<IStartup[]> => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: startupSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => {
        if (field === "category") {
          return { category: { $in: value } };
        }

        return { [field]: value };
      }),
    });
  }

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const startups = await Startup.find(whereCondition)
    .populate("user")
    .sort({ createdAt: "desc" });

  return startups;
};

const myStartups = async (payload: string) => {
  const result = await Startup.find({ user: payload }).sort({
    createdAt: "desc",
  });

  return result;
};

interface IStartupUpdate {
  startupId: string;
  payload: Partial<IStartup>;
  user: string;
}

const updateStartup = async ({ startupId, payload, user }: IStartupUpdate) => {
  const isExistStartup = await Startup.findById(startupId);

  if (!isExistStartup) {
    throw new ApiError(httpStatus.NOT_FOUND, "Startup does not found");
  }

  const isThisUserCreated = await Startup.findOne({
    user: user,
    _id: startupId,
  });

  if (!isThisUserCreated) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You can not update this Startup"
    );
  }

  const result = await Startup.findOneAndUpdate(
    { user: user, _id: startupId },
    payload,
    { new: true }
  );

  return result;
};

const deleteStartup = async (payload: { startupId: string; user: string }) => {
  const { startupId, user } = payload;

  const startup = await Startup.findOne({ user: user, _id: startupId });

  if (!startup) {
    throw new ApiError(httpStatus.NOT_FOUND, "Startup does not found");
  }

  if (user.toString() !== startup?.user.toString()) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You cannot delete the startup"
    );
  }

  const result = await Startup.findOneAndDelete({ _id: startupId, user: user });

  return result;
};

export const StartupService = {
  createStartup,
  getSingleStartup,
  getAllStartups,
  myStartups,
  updateStartup,
  deleteStartup,
};
