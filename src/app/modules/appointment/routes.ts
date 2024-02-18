import express from "express";
import { verifyJwt } from "../../middlewares/auth.middleware";
import { zodRequestValidationHandler } from "../../middlewares/zod.middleware";
import { AppointmentController } from "./controller";
import { AppointmentZodSchema } from "./zodValidation";

const router = express.Router();

router.route("/create-appointment").post(
  verifyJwt,

  zodRequestValidationHandler(AppointmentZodSchema.createAppointmentSchema),
  AppointmentController.createAppointment
);
router.route("/update/:id").patch(
  verifyJwt,

  zodRequestValidationHandler(AppointmentZodSchema.updateZodSchema),
  AppointmentController.updateAppointment
);
router.route("/:id").get(AppointmentController.getSingleAppointment);
router.route("/:id").delete(AppointmentController.deleteAppointment);
// router.route("/").get(DoctorController.getAllDoctor);

export const AppointmentRoutes = router;
