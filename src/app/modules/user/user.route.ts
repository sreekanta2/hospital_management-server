import express from "express";

import { zodRequestValidationHandler } from "../../middlewares/zod.middleware";
import { UserController } from "./user.controller";
import { UserZodValidation } from "./user.zodValidation";
const router = express.Router();
router
  .route("/doctor-register")
  .post(
    zodRequestValidationHandler(UserZodValidation.createUserZodSchema),
    UserController.registerDoctor
  );
router
  .route("/patient-register")
  .post(
    zodRequestValidationHandler(UserZodValidation.createUserZodSchema),
    UserController.registerPatient
  );

export const UserRoutes = router;
