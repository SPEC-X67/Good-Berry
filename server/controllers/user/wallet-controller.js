const Wallet = require('../../models/Wallet');

const walletController = {
  getWallet: async (req, res) => {
    try {
      const wallet = await Wallet.findOne({ userId: req.user.id });
      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
      }
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching wallet', error: error.message });
    }
  },

  addMoney: async (req, res) => {
    try {
      const { amount, description } = req.body;
      let wallet = await Wallet.findOne({ userId: req.user.id });

      if (!wallet) {
        wallet = new Wallet({ userId: req.user.id, balance: 0, transactions: [] });
      }

      const parsedAmount = parseFloat(amount);
      wallet.balance += parsedAmount;
      wallet.transactions.push({ type: 'credit', amount: parsedAmount, description });

      await wallet.save();
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ message: 'Error adding money to wallet', error: error.message });
    }
  },

  getTransactions: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const wallet = await Wallet.findOne({ userId: req.user.id });
      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
      }

      const transactions = wallet.transactions.slice((page - 1) * limit, page * limit);
      const totalTransactions = wallet.transactions.length;

      res.json({
        transactions,
        totalPages: Math.ceil(totalTransactions / limit),
        currentPage: parseInt(page),
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching transactions', error: error.message });
    }
  }
};

module.exports = walletController;
