import express from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
const router = express.Router();

router.post("/register", AuthController.createUser);
router.post("/login", AuthController.loginUser);
router.post("/refresh-token", AuthController.refreshToken);
router.get("/current-user", auth, AuthController.getCurrentUser);
router.get("/logout", AuthController.getCurrentUser);

export const AuthRoute = router;
