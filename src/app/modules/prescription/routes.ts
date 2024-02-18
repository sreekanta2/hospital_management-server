import express from "express";
import { verifyJwt } from "../../middlewares/auth.middleware";
import { zodRequestValidationHandler } from "../../middlewares/zod.middleware";
import { PrescriptionController } from "./controller";
import { PrescriptionZodValidation } from "./zodValidation";

const router = express.Router();
router
  .route("/create-prescription")
  .post(
    verifyJwt,
    zodRequestValidationHandler(PrescriptionZodValidation.PrescriptionSchema),
    PrescriptionController.createPrescription
  );
router
  .route("/update/:id")
  .patch(verifyJwt, PrescriptionController.updatePrescription);

router.route("/:id").get(PrescriptionController.getPatientAllPrescription);

router.route("/:id").delete(PrescriptionController.deletePrescription);

export const PrescriptionRoutes = router;
