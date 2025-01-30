const User = require('../../models/User');
const crypto = require('crypto');

const referralController = {
  applyReferralCode: async (req, res) => {
    try {
      const { referralCode } = req.body;

      if (!referralCode) {
        return res.status(400).json({ message: 'Referral code is required' });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.referredBy) {
        return res.status(400).json({ message: 'Referral code has already been applied' });
      }

      if (user.referralCode === referralCode) {
        return res.status(400).json({ message: 'You cannot use your own referral code' });
      }

      const referrer = await User.findOne({ referralCode });
      if (!referrer) {
        return res.status(404).json({ message: 'Invalid referral code' });
      }

      user.referredBy = referralCode;
      await user.save();

      res.status(200).json({ success: true, message: 'Referral code applied successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error applying referral code', error: error.message });
    }
  },

  getReferralCode: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!user.referralCode) {
        user.referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
        await user.save();
      }

      res.status(200).json({ referralCode: user.referralCode, appliedCode: user.referredBy });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching referral code', error: error.message });
    }
  },

  getReferredCount: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const referredCount = await User.countDocuments({ referredBy: user.referralCode });

      res.status(200).json({ referredCount });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching referred count', error: error.message });
    }
  }
};

module.exports = referralController;
