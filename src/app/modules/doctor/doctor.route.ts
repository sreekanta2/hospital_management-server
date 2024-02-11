import express from "express";
import { DoctorController } from "./doctor.controller";
const router = express.Router();

router.route("/").get(DoctorController.getAllDoctor);
router.route("/update/:id").patch(DoctorController.updateDoctor);
export const DoctorRoutes = router;
