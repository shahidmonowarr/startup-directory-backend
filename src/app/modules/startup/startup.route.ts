import express from "express";
import auth from "../../middlewares/auth";
import { StartupController } from "./startup.controller";
const router = express.Router();

router.post("/", auth, StartupController.createStartup);

router.get("/my-startups", auth, StartupController.getMyStartups);
router.get("/:id", StartupController.getSingleStartup);
router.get("/", StartupController.getAllStartups);

router.patch("/:id", auth, StartupController.updateStartup);

router.delete("/:id", auth, StartupController.deleteStartup);

export const StartupRoute = router;
