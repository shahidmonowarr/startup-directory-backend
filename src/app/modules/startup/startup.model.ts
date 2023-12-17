import mongoose, { Schema, Types } from "mongoose";
import { IStartup, StartupModel } from "./startup.interface";

const startupSchema = new Schema<IStartup, StartupModel>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    startingYear: {
      type: String,
      required: [true, "Starting Year is required"],
    },
    founders: {
      type: [String],
      required: [true, "Founders is required"],
    },
    noOfEmployees: {
      type: Number,
      required: [true, "Number of Employees is required"],
    },
    fundingAmount: {
      type: Number,
      required: [true, "Funding Amount is required"],
    },
    industry: {
      type: String,
      required: [true, "Industry is required"],
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

startupSchema.statics.isStartupExist = async function (
  id: string
): Promise<IStartup | null> {
  const startup = await Startup.findOne({ _id: id });

  return startup;
};

export const Startup = mongoose.model<IStartup, StartupModel>(
  "Startup",
  startupSchema
);
