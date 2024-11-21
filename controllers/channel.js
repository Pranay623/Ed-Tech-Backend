import express from 'express';
import mongoose from "mongoose";
import Message from "../models/channel.js";
import userModel from "../models/user.js";  // Corrected import to match variable name
import bodyParser from 'body-parser';

const router = express.Router();  // Using router instead of app

// Middleware for parsing JSON body
router.use(bodyParser.json());

// Post route to save messages
router.post('/api/messages', async (req, res) => {
    const { userId, userName, message ,field} = req.body;

    try {
        // Check if user exists
        const user = await userModel.findById(userId);  // Make sure userModel is used here
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Create a new message
        const newMessage = new Message({
            userId,  
            userName,  
            message,  
            field,

        });

        // Save the message to the database
        await newMessage.save();

        // Respond with success
        res.json({ success: true, message: 'Message saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to save message', error });
    }
});

// GET route to fetch messages by userId
router.get('/api/messages/:field', async (req, res) => {
    const { userId } = req.params;
    const {field} =req.params;

    try {
        // Fetch messages from the database where userId matches
        const messages = await Message.find({ field });

        // Check if messages exist
        if (messages.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No messages found for this user',
            });
        }

        // Respond with the messages
        res.json({
            success: true,
            messages,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages',
            error,
        });
    }
});



export default router;  // Export router to be used in other parts of the application
