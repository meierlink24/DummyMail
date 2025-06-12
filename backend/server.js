const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// 1secMail configuration
const API_BASE = 'https://www.1secmail.com/api/v1/';
const VALID_DOMAINS = ['1secmail.com', '1secmail.net', '1secmail.org'];

// In-memory store for tracking emails
const activeEmails = new Map();

// Generate REAL functional email
async function createRealEmail(ttlMinutes = 60) {
  try {
    // Generate random address
    const username = Math.random().toString(36).substring(2, 12);
    const domain = VALID_DOMAINS[Math.floor(Math.random() * VALID_DOMAINS.length)];
    const email = `${username}@${domain}`;
    
    // Store with expiration without verification
    const id = uuidv4();
    const expiresAt = Date.now() + ttlMinutes * 60 * 1000;
    
    activeEmails.set(id, {
      id,
      email,
      username,
      domain,
      expiresAt,
      createdAt: Date.now()
    });

    return { id, email, expiresAt };
  } catch (error) {
    console.error('Failed to create email:', error);
    throw new Error('Failed to create email address');
  }
}

// Check inbox for an email with retry logic
async function fetchInbox(email, retries = 3) {
  try {
    const [username, domain] = email.split('@');
    const response = await axios.get(`${API_BASE}?action=getMessages&login=${username}&domain=${domain}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    return response.data;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchInbox(email, retries - 1);
    }
    console.error('Failed to fetch inbox after retries:', error);
    return [];
  }
}

// Get specific email content with retry logic
async function fetchEmailContent(email, mailId, retries = 3) {
  try {
    const [username, domain] = email.split('@');
    const response = await axios.get(`${API_BASE}?action=readMessage&login=${username}&domain=${domain}&id=${mailId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    return response.data;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchEmailContent(email, mailId, retries - 1);
    }
    console.error('Failed to fetch email after retries:', error);
    return null;
  }
}

// API Endpoints
app.post('/generate', async (req, res) => {
  try {
    const { ttlMinutes = 60 } = req.body;
    const emailData = await createRealEmail(ttlMinutes);
    res.status(201).json(emailData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/inbox/:email', async (req, res) => {
  try {
    const messages = await fetchInbox(req.params.email);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inbox' });
  }
});

app.get('/email/:email/:id', async (req, res) => {
  try {
    const content = await fetchEmailContent(req.params.email, req.params.id);
    if (content) {
      res.json(content);
    } else {
      res.status(404).json({ error: 'Email not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch email' });
  }
});

// New endpoint to get all active emails
app.get('/emails', (req, res) => {
  const emails = Array.from(activeEmails.values()).map(email => ({
    id: email.id,
    email: email.email,
    expiresAt: email.expiresAt
  }));
  res.json(emails);
});

// Cleanup job
setInterval(() => {
  const now = Date.now();
  for (const [id, email] of activeEmails.entries()) {
    if (email.expiresAt <= now) {
      activeEmails.delete(id);
      console.log(`Expired email removed: ${email.email}`);
    }
  }
}, 60 * 1000); // Run every minute

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});