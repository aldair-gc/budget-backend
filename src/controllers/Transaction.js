import Transaction from '../models/Transaction';

class TransactionController {
  async store(req, res) {
    try {
      const newTransaction = await Transaction.create(req.body);
      const { id, name, email } = newTransaction;
      return res.json({ id, name, email });
    } catch (err) {
      if (err.errors) return res.status(400).json({ errors: err.errors.map((e) => e.message) });
      return res.status(400).send(err);
    }
  }

  async index(req, res) {
    try {
      const users = await Transaction.findAll({ attributes: ['id', 'name', 'email'] });
      return res.json(users);
    } catch (err) {
      if (err.errors) return res.status(400).json({ errors: err.errors.map((e) => e.message) });
      return res.status(400).send(err);
    }
  }

  async show(req, res) {
    try {
      const user = await Transaction.findByPk(req.userId);
      const { id, name, email } = user;
      return res.json({ id, name, email });
    } catch (err) {
      if (err.errors) return res.status(400).json({ errors: err.errors.map((e) => e.message) });
      return res.status(400).send(err);
    }
  }

  async update(req, res) {
    try {
      const user = await Transaction.findByPk(req.userId);

      if (!user) {
        return res.status(400).json({
          errors: ['This user does not exist'],
        });
      }
      const updatedUser = await user.update(req.body);
      const { id, name, email } = updatedUser;

      return res.json({ id, name, email });
    } catch (err) {
      if (err.errors) return res.status(400).json({ errors: err.errors.map((e) => e.message) });
      return res.status(400).send(err);
    }
  }

  async delete(req, res) {
    try {
      const user = await Transaction.findByPk(req.userId);

      if (!user) {
        return res.status(400).json({
          errors: ['This user does not exist'],
        });
      }

      await user.destroy();
      return res.json({ userDeleted: true });
    } catch (err) {
      if (err.errors) return res.status(400).json({ errors: err.errors.map((e) => e.message) });
      return res.status(400).send(err);
    }
  }
}

export default new TransactionController();
