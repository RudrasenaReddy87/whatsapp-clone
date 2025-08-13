import fs from "fs";
import path from "path";
import url from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fetch from "node-fetch";

// Load environment variables from .env file
dotenv.config();

console.log("DEBUG: MONGO_URI =", process.env.MONGO_URI);

const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";
const WEBHOOK_URL = `${SERVER_URL}/webhook`;

// Resolve __dirname for ES modules
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to sample payloads folder
const PAYLOADS_DIR = path.join(__dirname, "../../sample_payloads");

// Connect to MongoDB
async function connectDB() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not defined in environment variables.");
    }
    // Specify database name explicitly
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "whatsapp",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

// Define Mongoose schema and model for processed_messages
const processedMessageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    wa_id: String,
    name: String,
    text: String,
    timestamp: Number,
    status: String,
    meta_msg_id: String,
  },
  { collection: "processed_messages" }
);

const ProcessedMessage = mongoose.model(
  "ProcessedMessage",
  processedMessageSchema
);

// Insert or update messages/status in MongoDB
async function processPayloadInDB(payload) {
  if (payload.messages) {
    for (const message of payload.messages) {
      try {
        await ProcessedMessage.updateOne(
          { id: message.id },
          {
            $setOnInsert: {
              id: message.id,
              wa_id: payload.contacts?.[0]?.wa_id || null,
              name: payload.contacts?.[0]?.profile?.name || "Unknown",
              text: message.text?.body || "",
              timestamp: message.timestamp,
              status: "sent",
            },
          },
          { upsert: true }
        );
        console.log(`📝 Inserted message ID: ${message.id}`);
      } catch (err) {
        console.error(`❌ Error inserting message ID ${message.id}:`, err);
      }
    }
  }

  if (payload.statuses) {
    for (const statusUpdate of payload.statuses) {
      try {
        const filter = statusUpdate.id
          ? { id: statusUpdate.id }
          : statusUpdate.meta_msg_id
          ? { id: statusUpdate.meta_msg_id }
          : null;
        if (!filter) {
          console.warn("⚠️ No valid id or meta_msg_id found in status update");
          continue;
        }

        const res = await ProcessedMessage.updateOne(filter, {
          $set: { status: statusUpdate.status },
        });

        if (res.matchedCount > 0) {
          console.log(
            `✅ Updated status for message ID: ${filter.id} to '${statusUpdate.status}'`
          );
        } else {
          console.warn(
            `⚠️ No message found with ID: ${filter.id} to update`
          );
        }
      } catch (err) {
        console.error(`❌ Error updating status:`, err);
      }
    }
  }
}

// Send payload to webhook endpoint
async function sendPayload(payload) {
  console.log(`📤 Sending payload to ${WEBHOOK_URL}`);
  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`❌ Server responded with status ${res.status}`);
  }
  console.log(`✅ Payload processed by webhook: ${await res.text()}`);
}

// Load payload JSON file
function loadPayload(fileName) {
  const filePath = path.join(PAYLOADS_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Payload file not found: ${fileName}`);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

// Utility delay function
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const arg = process.argv[2];
  if (!arg) {
    console.error("❌ Please provide a payload file name or 'all'");
    process.exit(1);
  }

  await connectDB();

  if (arg === "all") {
    const files = fs
      .readdirSync(PAYLOADS_DIR)
      .filter((f) => f.endsWith(".json"))
      .sort();

    for (const file of files) {
      console.log(`\n📂 Processing file: ${file}`);
      const payload = loadPayload(file);

      await processPayloadInDB(payload);
      await sendPayload(payload);
      await delay(1000);
    }
  } else {
    const payload = loadPayload(arg);
    await processPayloadInDB(payload);
    await sendPayload(payload);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("❌ Fatal error:", err);
  mongoose.disconnect();
  process.exit(1);
});
