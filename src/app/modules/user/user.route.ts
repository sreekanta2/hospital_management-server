import express from "express";

import { zodRequestValidationHandler } from "../../middlewares/zod.middleware";
import { UserController } from "./user.controller";
import { UserZodValidation } from "./user.zodValidation";
const router = express.Router();
router
  .route("/register")
  .post(
    zodRequestValidationHandler(UserZodValidation.createUserZodSchema),
    UserController.register
  );

export const UserRoutes = router;
