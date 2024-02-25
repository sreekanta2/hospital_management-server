import express from "express";
import { AppointmentRoutes } from "../modules/appointment/routes";
import { AuthRoutes } from "../modules/auth/routes";
import { ConversationRoutes } from "../modules/conversation/routes";
import { DoctorRoutes } from "../modules/doctor/routes";
import { MedicalRecordRoutes } from "../modules/medical-reocrds/routes";
import { MessagesRoutes } from "../modules/messages/routes";
import { PatientRoutes } from "../modules/patient/routes";
import { PrescriptionRoutes } from "../modules/prescription/routes";
import { ReviewRoutes } from "../modules/review/routes";
import { UserRoutes } from "../modules/user/routes";

const router = express.Router();

const modulesRoute = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/doctor",
    route: DoctorRoutes,
  },
  {
    path: "/patient",
    route: PatientRoutes,
  },
  {
    path: "/appointment",
    route: AppointmentRoutes,
  },
  {
    path: "/review",
    route: ReviewRoutes,
  },
  {
    path: "/prescription",
    route: PrescriptionRoutes,
  },
  {
    path: "/medical-record",
    route: MedicalRecordRoutes,
  },
  {
    path: "/message",
    route: MessagesRoutes,
  },
  {
    path: "/conversation",
    route: ConversationRoutes,
  },
];
modulesRoute.forEach((route) => router.use(route.path, route.route));

export default router;
