import { Model, ObjectId, Types } from "mongoose";
import { IUser } from "../user/user.interface";

export type IStartup = {
  _id?: ObjectId;
  name: string;
  city: string;
  startingYear: string;
  founders: string[];
  noOfEmployees: number;
  fundingAmount: number;
  industry: string;
  user: Types.ObjectId | IUser;
};

export type StartupModel = {
  isStartupExist(email: string): Promise<IStartup>;
} & Model<IStartup>;

export type IStartupFilters = {
  searchTerm?: string;
  industry?: string;
};
