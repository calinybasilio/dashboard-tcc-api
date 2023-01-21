import express from 'express';
import authMiddleware from './middlewares/authMiddleware';
import PingController from './modules/ping/ping-controller';
import AuthController from './modules/auth/auth-controller';
import UserController from './modules/usuario/user-controller';

const routes = express.Router();
const pingController = new PingController();
const authController = new AuthController();
const usuarioController = new UserController();

routes.get('/', pingController.ping);
routes.post('/authenticate', authController.authenticate);

// routes.get('/usuario', authMiddleware, usuarioController.find);
// routes.get('/usuario/:id', authMiddleware, usuarioController.findOne);
// routes.post('/usuario', usuarioController.create);
// routes.put('/usuario/:id', authMiddleware, usuarioController.upsert);
// routes.put('/usuario/ativar/:id', authMiddleware, usuarioController.ativacaoOuDesativacao);
// routes.put('/usuario/desativar/:id', authMiddleware, usuarioController.ativacaoOuDesativacao);

export default routes;