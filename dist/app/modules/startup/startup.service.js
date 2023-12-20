"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartupService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const startup_constant_1 = require("./startup.constant");
const startup_model_1 = require("./startup.model");
const createStartup = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newStartup = yield startup_model_1.Startup.create(payload);
    if (!newStartup) {
        throw new ApiError_1.default(400, "Startup could not be created");
    }
    return newStartup;
});
const getSingleStartup = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const startup = yield startup_model_1.Startup.findById({ _id: id });
    if (!startup) {
        throw new ApiError_1.default(400, "Startup does not exist");
    }
    return startup;
});
const getAllStartups = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: startup_constant_1.startupSearchableFields.map((field) => ({
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
    const whereCondition = andConditions.length > 0 ? { $and: andConditions } : {};
    const startups = yield startup_model_1.Startup.find(whereCondition)
        .populate("user")
        .sort({ createdAt: "desc" });
    return startups;
});
const myStartups = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield startup_model_1.Startup.find({ user: payload }).sort({
        createdAt: "desc",
    });
    return result;
});
const updateStartup = ({ startupId, payload, user }) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistStartup = yield startup_model_1.Startup.findById(startupId);
    if (!isExistStartup) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Startup does not found");
    }
    const isThisUserCreated = yield startup_model_1.Startup.findOne({
        user: user,
        _id: startupId,
    });
    if (!isThisUserCreated) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You can not update this Startup");
    }
    const result = yield startup_model_1.Startup.findOneAndUpdate({ user: user, _id: startupId }, payload, { new: true });
    return result;
});
const deleteStartup = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { startupId, user } = payload;
    const startup = yield startup_model_1.Startup.findOne({ user: user, _id: startupId });
    if (!startup) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Startup does not found");
    }
    if (user.toString() !== (startup === null || startup === void 0 ? void 0 : startup.user.toString())) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You cannot delete the startup");
    }
    const result = yield startup_model_1.Startup.findOneAndDelete({ _id: startupId, user: user });
    return result;
});
exports.StartupService = {
    createStartup,
    getSingleStartup,
    getAllStartups,
    myStartups,
    updateStartup,
    deleteStartup,
};
