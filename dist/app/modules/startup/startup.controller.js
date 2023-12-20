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
exports.StartupController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const startup_constant_1 = require("./startup.constant");
const startup_service_1 = require("./startup.service");
const createStartup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const startupData = __rest(req.body, []);
        const result = yield startup_service_1.StartupService.createStartup(startupData);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Successfully created startup",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getSingleStartup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield startup_service_1.StartupService.getSingleStartup(id);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Successfully retrieved startup",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllStartups = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, startup_constant_1.startupFilterableFields);
        const result = yield startup_service_1.StartupService.getAllStartups(filters);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Successfully retrieved all Startups",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getMyStartups = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req === null || req === void 0 ? void 0 : req.body.user;
        const result = yield startup_service_1.StartupService.myStartups(user);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Successfully retrieved the startups",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateStartup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: startupId } = req.params;
        const _a = req === null || req === void 0 ? void 0 : req.body, { user } = _a, payload = __rest(_a, ["user"]);
        const result = yield startup_service_1.StartupService.updateStartup({
            startupId,
            payload,
            user,
        });
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Successfully updated the startup",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteStartup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: startupId } = req.params;
        const user = req === null || req === void 0 ? void 0 : req.body.user;
        const result = yield startup_service_1.StartupService.deleteStartup({ startupId, user });
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Successfully deleted the startup",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.StartupController = {
    createStartup,
    getSingleStartup,
    getAllStartups,
    getMyStartups,
    updateStartup,
    deleteStartup,
};
