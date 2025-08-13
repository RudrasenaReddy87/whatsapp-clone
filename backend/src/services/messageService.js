import { getDB } from "../config/db.js";

export async function insertMessage(msg) {
  const collection = getDB().collection("processed_messages");
  await collection.insertOne(msg);
}

export async function updateMessageStatus(messageId, status) {
  const collection = getDB().collection("processed_messages");
  await collection.updateOne(
    { message_id: messageId },
    { $set: { status } }
  );
}
