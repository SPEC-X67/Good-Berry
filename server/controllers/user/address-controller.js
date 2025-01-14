const mongoose = require('mongoose');
const Address = require('../../models/Address');

const addressController = {
    getAllAddresses: async (req, res) => {
        try {
            const addresses = await Address.find({ userId: req.user.id });
            res.json(addresses);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching addresses' });
        }
    },

    addAddress: async (req, res) => {
        try {
            const {street, city, state, zip, country, name, type, mobile, isDefault} = req.body;
            
            if(isDefault) {
                await Address.updateMany(
                    {userId: req.user.id}, 
                    {$set: {isDefault: false}}
                );
            }

            const newAddress = new Address({
                userId: req.user.id,
                street,
                city,
                state,
                zip,
                country,
                name,
                type,
                mobile,
                isDefault
            });

            const savedAddress = await newAddress.save();
            console.log(savedAddress);

            res.status(201).json(savedAddress);

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error adding address' });   
        }
    },

    setDefaultAddress: async (req, res) => {
        try {
            const { id } = req.params;
            await Address.updateMany(
                { userId: req.user.id },
                { $set: { isDefault: false } }
            );
            const updatedAddress = await Address.findOneAndUpdate(
                { userId: req.user.id, _id: id },
                { $set: { isDefault: true } },
                { new: true }
            );
            if (!updatedAddress) {
                return res.status(404).json({ message: 'Address not found' });
            }
            res.json(updatedAddress);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateAddress: async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;
    
            if (updates.isDefault) {
                await Address.updateMany(
                    { userId: req.user.id },
                    { $set: { isDefault: false } }
                );
            }
    
            const updatedAddress = await Address.findOneAndUpdate(
                { userId: req.user.id, _id: id },
                updates,
                { new: true }
            );
    
            res.json(updatedAddress);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },    

    deleteAddress: async (req, res) => {
        try {
            const {id} = req.params;
            const deletedAddress = await Address.findOneAndDelete({
                _id: id,
                userId: req.user.id
            });
            if (!deletedAddress) {
                return res.status(404).json({ message: 'Address not found' });
            }
        
            res.json({ message: 'Address deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
}

module.exports = addressController;