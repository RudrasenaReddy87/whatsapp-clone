// src/models/ProcessedMessage.js
import mongoose from "mongoose";

const processedMessageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },  // message id
    wa_id: { type: String },                             // WhatsApp user ID
    name: { type: String, default: "Unknown" },         // user name
    text: { type: String, default: "" },                 // message text body
    timestamp: { type: Number },                         // message timestamp (as number)
    status: { type: String, default: "sent" },          // status: sent/delivered/read
    direction: { type: String, enum: ["in", "out"], default: "in" }, // in for incoming, out for outgoing
    meta_msg_id: { type: String },                       // optional meta message id if any
    from: { type: String },                              // sender phone number/id
    messaging_product: { type: String },                 // e.g. "whatsapp"
    phone_number_id: { type: String },                   // from metadata.phone_number_id
    display_phone_number: { type: String },              // from metadata.display_phone_number
  },
  {
    collection: "processed_messages",
    timestamps: true, // adds createdAt and updatedAt fields automatically
  }
);

const ProcessedMessage = mongoose.model("ProcessedMessage", processedMessageSchema);

export default ProcessedMessage;
