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
exports.AuthController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const auth_service_1 = require("./auth.service");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = __rest(req.body, []);
        const result = yield auth_service_1.AuthService.createUser(userData);
        const { refreshToken } = result, otherResult = __rest(result, ["refreshToken"]);
        // set refresh token
        const cookieOptions = {
            secure: config_1.default.env === "production",
            httpOnly: true,
        };
        res.cookie("refreshToken", refreshToken, cookieOptions);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Successfully registered",
            data: otherResult,
        });
    }
    catch (error) {
        next(error);
    }
});
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = __rest(req.body, []);
        if (!userData.email) {
            throw new ApiError_1.default(400, "Email required");
        }
        if (!userData.password) {
            throw new ApiError_1.default(400, "Password required");
        }
        const result = yield auth_service_1.AuthService.loginUser(userData);
        const { refreshToken } = result, otherResult = __rest(result, ["refreshToken"]);
        // set refresh token
        const cookieOptions = {
            secure: config_1.default.env === "production",
            httpOnly: true,
        };
        res.cookie("refreshToken", refreshToken, cookieOptions);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Successfully logged in",
            data: otherResult,
        });
    }
    catch (error) {
        next(error);
    }
});
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.cookies;
        const result = yield auth_service_1.AuthService.refreshToken(refreshToken);
        // set refresh token into cookie
        const cookieOptions = {
            secure: config_1.default.env === "production",
            httpOnly: true,
        };
        res.cookie("refreshToken", refreshToken, cookieOptions);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "User logged in successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getCurrentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield auth_service_1.AuthService.getCurrentUser(req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "User retrieved successfully",
            data: {
                user: result,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
const logoutUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("refreshToken");
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "User retrieved successfully",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.AuthController = {
    createUser,
    loginUser,
    refreshToken,
    getCurrentUser,
    logoutUser,
};
