import express from "express";
import { zodRequestValidationHandler } from "./../../middlewares/zod.middleware";
import { DoctorController } from "./doctor.controller";
import { DoctorZodValidation } from "./doctor.zodValidation";
const router = express.Router();

router.route("/").get(DoctorController.getAllDoctor);
router
  .route("/update/:id")
  .patch(
    zodRequestValidationHandler(DoctorZodValidation.updateDoctorZodSchema),
    DoctorController.updateDoctor
  );
router.route("/:id").delete(DoctorController.deleteDoctor);
router.route("/:id").get(DoctorController.getSingleDoctor);

export const DoctorRoutes = router;
