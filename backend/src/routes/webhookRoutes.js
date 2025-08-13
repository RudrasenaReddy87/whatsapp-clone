import express from "express";
import ProcessedMessage from "../models/ProcessedMessage.js";

const router = express.Router();

router.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

router.post("/messages", async (req, res) => {
  const { text, wa_id, id, timestamp } = req.body;

  try {
    const newMessage = new ProcessedMessage({
      id,
      wa_id,
      name: "Me", // Or derive from a user session
      text,
      timestamp,
      status: "sent",
      direction: "out",
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error saving outgoing message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

router.post("/", async (req, res) => {
  const payload = req.body;

  try {
    // Extract messages and contacts from nested payload structure
    const changes = payload.metaData?.entry?.[0]?.changes;
    const messageChange = changes?.find(c => c.field === "messages");
    const value = messageChange?.value;

    const messages = value?.messages || [];
    const contacts = value?.contacts || [];

    if (messages.length > 0) {
      const contact = contacts[0];
      for (const msg of messages) {
        await ProcessedMessage.updateOne(
          { id: msg.id },
          {
            $setOnInsert: {
              id: msg.id,
              wa_id: contact?.wa_id,
              name: contact?.profile?.name || "Unknown",
              text: msg.text?.body || "",
              timestamp: Number(msg.timestamp),
              status: "sent",
            },
          },
          { upsert: true }
        );
      }
    }

    // Handle status updates
    const statuses = value?.statuses || [];
    for (const status of statuses) {
      await ProcessedMessage.updateOne(
        { id: status.id },
        { $set: { status: status.status } }
      );
    }

    res.json({ message: "Payload processed" });
  } catch (error) {
    console.error("Error in webhook:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all conversations grouped by wa_id
router.get("/conversations", async (req, res) => {
  try {
    const conversations = await ProcessedMessage.aggregate([
      {
        $group: {
          _id: "$wa_id",
          name: { $first: "$name" },
          number: { $first: "$wa_id" },
          lastMessage: { $last: "$text" },
          lastTimestamp: { $last: "$timestamp" }
        }
      },
      { $sort: { lastTimestamp: -1 } }
    ]);
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

// Get all messages for a specific wa_id
router.get("/messages/:wa_id", async (req, res) => {
  try {
    const wa_id = req.params.wa_id;
    const messages = await ProcessedMessage.find({ wa_id }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

export default router;