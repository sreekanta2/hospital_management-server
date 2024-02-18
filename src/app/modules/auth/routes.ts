import express from "express";
import { zodRequestValidationHandler } from "../../middlewares/zod.middleware";

import { verifyJwt } from "../../middlewares/auth.middleware";
import { AuthController } from "./controller";
import { AuthValidation } from "./zodValidation";
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
router
  .route("/forgat-password")
  .post(
    zodRequestValidationHandler(AuthValidation.forgatPasswordZodValidation),
    AuthController.forgatPassword
  );
router
  .route("/reset-password/:token")
  .patch(
    zodRequestValidationHandler(AuthValidation.resetPasswordZodValidation),
    AuthController.resetPassword
  );

export const AuthRoutes = router;
