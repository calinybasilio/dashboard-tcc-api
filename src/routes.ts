import express from 'express';

import authMiddleware from './middlewares/authMiddleware';

import PingController from './modules/ping/ping-controller';
import AuthController from './modules/auth/auth-controller';
import UserController from './modules/usuario/user-controller';
import JournalistController from './modules/journalist/journalist-controller';
import IncidenceOfWordsController from './modules/incidence-of-words/incidence-of-words-controller';

const routes = express.Router();
const pingController = new PingController();
const authController = new AuthController();
// const usuarioController = new UserController();
const journalistController = new JournalistController();
const incidenceOfWordsController = new IncidenceOfWordsController();

routes.get('/', pingController.ping);
routes.post('/authenticate', authController.authenticate);

// routes.get('/user', authMiddleware, usuarioController.find);
// routes.get('/user/:id', authMiddleware, usuarioController.findOne);
// routes.post('/user', authMiddleware,  usuarioController.create);
// routes.put('/user/:id', authMiddleware, usuarioController.upsert);

routes.post('/journalist/import', authMiddleware,  journalistController.import);
routes.get('/journalist', authMiddleware,  journalistController.find);

routes.post('/incidence-of-words/import', authMiddleware,  incidenceOfWordsController.import);

export default routes;