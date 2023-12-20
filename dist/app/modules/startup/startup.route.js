"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartupRoute = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const startup_controller_1 = require("./startup.controller");
const router = express_1.default.Router();
router.post("/", auth_1.default, startup_controller_1.StartupController.createStartup);
router.get("/my-startups", auth_1.default, startup_controller_1.StartupController.getMyStartups);
router.get("/:id", startup_controller_1.StartupController.getSingleStartup);
router.get("/", startup_controller_1.StartupController.getAllStartups);
router.patch("/:id", auth_1.default, startup_controller_1.StartupController.updateStartup);
router.delete("/:id", auth_1.default, startup_controller_1.StartupController.deleteStartup);
exports.StartupRoute = router;
