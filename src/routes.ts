import express from "express";

import authMiddleware from "./middlewares/authMiddleware";

import PingController from "./modules/ping/ping-controller";
import AuthController from "./modules/auth/auth-controller";
//import UserController from './modules/usuario/user-controller';
import JournalistController from "./modules/journalist/journalist-controller";
import IncidenceOfWordsController from "./modules/incidence-of-words/incidence-of-words-controller";
import DashboardController from "./modules/dashboard/dashboard-controller";
import TweetController from "./modules/tweets/tweet-controller";
import WordController from "./modules/word/word-controller";

const routes = express.Router();
const pingController = new PingController();
const authController = new AuthController();
// const usuarioController = new UserController();
const journalistController = new JournalistController();
const incidenceOfWordsController = new IncidenceOfWordsController();
const dashboardController = new DashboardController();
const tweetController = new TweetController();
const wordController  = new WordController();

routes.get("/", pingController.ping);
routes.post("/authenticate", authController.authenticate);

// routes.get('/user', authMiddleware, usuarioController.find);
// routes.get('/user/:id', authMiddleware, usuarioController.findOne);
// routes.post('/user', authMiddleware,  usuarioController.create);
// routes.put('/user/:id', authMiddleware, usuarioController.upsert);

routes.post("/journalist/import", authMiddleware, journalistController.import);
routes.get("/journalist", authMiddleware, journalistController.find);

routes.post("/tweet/import", authMiddleware, tweetController.import);

routes.post(
  "/incidence-of-words/import",
  authMiddleware,
  incidenceOfWordsController.import
);

routes.post(
  "/dashboard/incidence-of-words-per-journalists",
  authMiddleware,
  dashboardController.incidenceOfWordsPerJournalists
);

routes.get(
  "/dashboard/tweet-statistics",
  authMiddleware,
  dashboardController.tweetStatistics
);

routes.get(
  "/dashboard/tweet-per-month",
  authMiddleware,
  dashboardController.tweetPerMonth
);

routes.get(
  "/word",
  authMiddleware,
  wordController.find
);

export default routes;
