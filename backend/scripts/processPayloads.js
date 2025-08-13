// scripts/processPayloads.js
// Usage: node scripts/processPayloads.js <payloads_folder>

import fs from 'fs';
import path from 'path';
import axios from 'axios';

const payloadsDir = process.argv[2] || './sample_payloads';
const backendUrl = 'http://localhost:3000/webhook/messages'; // Change port if needed

async function processPayloads() {
  const files = fs.readdirSync(payloadsDir).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const filePath = path.join(payloadsDir, file);
    const payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    try {
      const res = await axios.post(backendUrl, payload);
      console.log(`Processed ${file}:`, res.data);
    } catch (err) {
      console.error(`Error processing ${file}:`, err.response?.data || err.message);
    }
  }
}

processPayloads();
