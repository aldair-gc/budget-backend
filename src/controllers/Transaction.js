import { Op, Sequelize } from 'sequelize';
import Transaction from '../models/Transaction';

class TransactionController {
  // first repeat send as "0-1-'total'" and others as "id-'this'-'total'".
  async store(req, res) {

    try {
      const { type, description, value, expiration_day, status, year, month, repeat } = req.body;
      let [ repeatId, repeatThis, repeatEnd ] = repeat.split('-').map(x => Number(x));
      let _month = month;
      let _year = year;
      for (repeatThis; repeatThis <= repeatEnd; repeatThis++) {
        const thisRepeat = `${repeatId}-${repeatThis}-${repeatEnd}`;
        const newtrasac = await Transaction.create({ type, description, value, expiration_day, status, year: _year, month: _month, repeat: thisRepeat, user_id: req.userId });
        const { id } = newtrasac;
        if (_month < 12) {
          _month++
        } else {
          _month = 1;
          _year++;
        }
        if (repeatThis === 1) repeatId = id;
        if (repeatThis === repeatEnd) {
          const returnRepeat = `0-1-${repeatEnd}`
          return res.json({
            id: repeatId,
            type: newtrasac.type,
            description: newtrasac.description,
            value: newtrasac.value,
            expiration_day: newtrasac.expiration_day,
            status: newtrasac.status,
            year: newtrasac.year,
            month: newtrasac.month,
            repeat: returnRepeat });
        }
      }
    } catch (err) {
      if (err.errors) return res.status(400).json({ errors: err.errors.map((e) => e.message) });
      return res.status(400).send(err);
    }
  }

  async index(req, res) {
    try {
      const { year, month } = req.params;
      const thisMonth = await Transaction.findAll({ where: { user_id: req.userId, year, month } });
      return res.json(thisMonth);
    } catch (err) {
      if (err.errors) return res.status(400).json({ errors: err.errors.map((e) => e.message) });
      return res.status(400).send(err);
    }
  }

  async summary(req, res) {

    function previousDate(date) {
      const previousYear = date.month === 1 ? date.year - 1 : date.year;
      const previousMonth = date.month === 1 ? 12 : date.month - 1;
      return {year: previousYear, month: previousMonth};
    }

    try {
      const { year, month } = req.params;
      const summaryList = [];
      const prevDateToQuery = previousDate({ year, month });
      do {
        const monthTotals = await Transaction.findAll({
          where: { user_id: req.userId, year: prevDateToQuery.year, month: prevDateToQuery.month },
          attributes: ["year", "month", "type", [Sequelize.fn("sum", Sequelize.col("value")), "total"]],
          group: "type",
        });
        console.log(monthTotals);
        if (monthTotals.length !== 0) {
          summaryList.unshift(monthTotals);
          const newDate = previousDate(prevDateToQuery);
          prevDateToQuery.year = newDate.year;
          prevDateToQuery.month = newDate.month;
        } else {
          prevDateToQuery.year = 0;
        }
      } while (prevDateToQuery.year !== 0);
      return res.json(summaryList);
    } catch (err) {
      if (err.errors) return res.status(400).json({ errors: err.errors.map((e) => e.message) });
      return res.status(400).send(err);
    }
  }

  async show(req, res) {
    try {
      const transaction = await Transaction.findByPk(req.params.id);
      if (transaction.user_id !== req.userId) return res.status(401).json({ errors: ['Request denied for security reasons']});

      const fatherTransaction = transaction.repeat.split("-")[0] === "0" ? req.params.id : transaction.repeat.split("-")[0];

      const repeatitions = await Transaction.findAll({
        where: {
          user_id: req.userId,
          [Op.or]: [
            { id: fatherTransaction },
            { repeat: { [Op.startsWith]: `${fatherTransaction}-` }},
          ]
        }
      })

      return res.json(repeatitions);
    } catch (err) {
      if (err.errors) return res.status(400).json({ errors: err.errors.map((e) => e.message) });
      return res.status(400).send(err);
    }
  }

  async update(req, res) {
    try {
      const transaction = await Transaction.findByPk(req.params.id);
      if (!transaction) return res.status(400).json({ errors: ['This transaction does not exist'] });
      if (transaction.user_id !== req.userId) return res.status(401).json({ errors: ['Request denied for security reasons']});

      const updatedTransaction = await transaction.update(req.body);

      return res.json(updatedTransaction);
    } catch (err) {
      if (err.errors) return res.status(400).json({ errors: err.errors.map((e) => e.message) });
      return res.status(400).send(err);
    }
  }

  async delete(req, res) {
    try {
      const transaction = await Transaction.findByPk(req.params.id);

      if (!transaction) return res.status(400).json({ errors: ['This transaction does not exist'] });
      if (transaction.user_id !== req.userId) return res.status(401).json({ errors: ['Request denied for security reasons']});

      await transaction.destroy();
      return res.json({ transactionDeleted: true });
    } catch (err) {
      if (err.errors) return res.status(400).json({ errors: err.errors.map((e) => e.message) });
      return res.status(400).send(err);
    }
  }
}

export default new TransactionController();
