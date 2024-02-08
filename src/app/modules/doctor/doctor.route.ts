import express from "express";
import { DoctorController } from "./doctor.controller";
const router = express.Router();

router.route("/:id").get(DoctorController.getSingleDoctor);
export const DoctorRoutes = router;
