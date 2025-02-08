const mongoose = require('mongoose');
const User = require('../../models/User');
const bcrypt = require("bcryptjs");

const accountController = {
    getDetails: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    updateDetails: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            user.username = req.body.username;
            user.phone = req.body.phone;
            await user.save();
            res.status(200).json({ success: true,message: 'User details updated successfully', data:user });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    changePassword: async (req, res) => {

        const { newPassword, currentPassword } = req.body;

        if(!newPassword || !currentPassword) {
            return res.json({ sussess: false, message: 'Missing required fields' });
        }
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.json({ sussess: false, message: 'User not found' });
            }

            
            const passwordMatch = await bcrypt.compare(currentPassword, user.password);
            if (!passwordMatch) {
                return res.json({ sussess: false, message: 'Current password is incorrect' });
            }
            
            const checkOld = await bcrypt.compare(newPassword, user.password);
            if(checkOld) {
                return res.json({ sussess: false, message: 'New password cannot be same as old password' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 12);
            user.password = hashedPassword;
            await user.save();

            res.status(200).json({ success: true, message: 'Password changed successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};

module.exports = accountController;