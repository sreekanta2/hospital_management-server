import express from "express";
import { UserRoutes } from "../modules/user/user.route";

const router = express.Router();

const modulesRoute = [
  {
    path: "/users",
    route: UserRoutes,
  },
];
modulesRoute.forEach((route) => router.use(route.path, route.route));

export default router;
