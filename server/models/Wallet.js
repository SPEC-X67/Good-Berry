const mongoose = require('mongoose');

const WalletTransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String
  }
});

const WalletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0
  },
  transactions: [WalletTransactionSchema]
});

WalletSchema.methods.refund = async function(amount, description) {
  this.balance += amount;
  this.transactions.push({
    type: 'credit',
    amount,
    description,
    date: new Date()
  });
  await this.save();
};

module.exports = mongoose.model('Wallet', WalletSchema);
