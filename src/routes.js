import { Router } from 'express';
import User from './app/models/User';

const routes = Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Felipe Rocha',
    email: 'felieo.rocha@hotmail.com',
    password_hash: '23232323',
  });

  return res.json(user);
});

export default routes;
