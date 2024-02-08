import express from "express";
import { zodRequestValidationHandler } from "./../../middlewares/zod.middleware";

import { verifyJwt } from "../../middlewares/auth.middleware";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.zodValidation";
const router = express.Router();
router
  .route("/login")
  .post(
    zodRequestValidationHandler(AuthValidation.createLoginZodSchema),
    AuthController.login
  );
router.route("/logout").post(verifyJwt, AuthController.logout);
router
  .route("/change-password")
  .post(
    zodRequestValidationHandler(AuthValidation.createChangePasswordZodSchema),
    verifyJwt,
    AuthController.changePassword
  );

export const AuthRoutes = router;
