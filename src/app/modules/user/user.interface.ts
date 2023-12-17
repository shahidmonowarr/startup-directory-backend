import { Model, ObjectId } from "mongoose";

export type IUser = {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
};

export type UserModel = {
  isUserExist(email: string): Promise<IUser>;

  isPasswordMatched(
    givenPassword: string,
    savedPassword: String
  ): Promise<boolean>;
} & Model<IUser>;
