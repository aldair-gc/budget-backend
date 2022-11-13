import Transaction from '../models/Transaction';

class TransactionController {
  // first repeat send as "0-1-'total'" and others as "id-'this'-'total'".
  async store(req, res) {
    const { type, description, value, expiration_day, status, year, month, repeat } = req.body;
    const { repeatId, repeatThis, repeatEnd } = repeat.split('-').map(x => Number(x));
    console.log(repeatId, repeatThis, repeatEnd);

    // try {
    //   for (repeatThis; repeatThis <= repeatEnd; repeatThis++) {
    //     const thisRepeat = `${repeatId}-${repeatThis}-${repeatEnd}`;
    //     const newTransaction = await Transaction.create(type, description, value, expirationDay, status, year, month, thisRepeat);
    //     const { id, type, description, value, expirationDay, status, year, month } = newTransaction;
    //     if (repeatThis === 1) repeatId = newId;
    //     if (repeatThis === repeatEnd) {
    //       returnRepeat = `0-1-${repeatEnd}`
    //       return res.json({ repeatId, type, description, value, expirationDay, status, year, month, returnRepeat });
    //     }
    //   }
    // } catch (err) {
    //   if (err.errors) return res.status(400).json({ errors: err.errors.map((e) => e.message) });
    //   return res.status(400).send(err);
    // }
  }

  // async index(req, res) {}

  async show(req, res) {
    try {
      const transaction = await Transaction.findByPk(req.transactionId);
      const { id, type, description, value, expirationDay, status, year, month, repeat } = transaction;
      return res.json({ type, description, value, expirationDay, status, year, month, repeat });
    } catch (err) {
      if (err.errors) return res.status(400).json({ errors: err.errors.map((e) => e.message) });
      return res.status(400).send(err);
    }
  }

  async update(req, res) {
    try {
      const transaction = await Transaction.findByPk(req.transactionId);

      if (!transaction) {
        return res.status(400).json({
          errors: ['This transaction does not exist'],
        });
      }
      const updatedTransaction = await transaction.update(req.body);
      const { type, description, value, expirationDay, status, year, month, repeat } = updatedTransaction;

      return res.json({ type, description, value, expirationDay, status, year, month, repeat });
    } catch (err) {
      if (err.errors) return res.status(400).json({ errors: err.errors.map((e) => e.message) });
      return res.status(400).send(err);
    }
  }

  async delete(req, res) {
    try {
      const transaction = await Transaction.findByPk(req.transactionId);

      if (!transaction) {
        return res.status(400).json({
          errors: ['This transaction does not exist'],
        });
      }

      await transaction.destroy();
      return res.json({ transactionDeleted: true });
    } catch (err) {
      if (err.errors) return res.status(400).json({ errors: err.errors.map((e) => e.message) });
      return res.status(400).send(err);
    }
  }
}

export default new TransactionController();
