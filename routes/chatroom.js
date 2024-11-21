import express from 'express';
import Chat from '../models/chatroom.js';

const router = express.Router();

// Get messages for a channel
router.get('/:channel', async (req, res) => {
  const messages = await Chat.find({ channel: req.params.channel });
  res.json(messages);
});

export default router;
