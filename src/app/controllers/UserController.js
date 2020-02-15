import User from '../models/User';

class UserController {
  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'Users already exists.' });
    }

    const {
      id,
      name,
      email,
      password_hash,
      provider,
    } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      password_hash,
      provider,
    });
  }
}

export default new UserController();
