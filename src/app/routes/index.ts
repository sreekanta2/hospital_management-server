import express from "express";
import { AppointmentRoutes } from "../modules/appointment/appointment.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { DoctorRoutes } from "../modules/doctor/doctor.route";
import { PatientRoutes } from "../modules/patient/patient.route";
import { ReviewRoutes } from "../modules/review/routes";
import { UserRoutes } from "../modules/user/user.route";

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
];
modulesRoute.forEach((route) => router.use(route.path, route.route));

export default router;
