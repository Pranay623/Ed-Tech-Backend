import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the user
    userName: { type: String, required: true },  // Username of the user
    message: { type: String, required: true },  // The actual message
    field: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now },  // Timestamp when the message is created
  });

  const Message = mongoose.model('Message', messageSchema);

  export default Message;