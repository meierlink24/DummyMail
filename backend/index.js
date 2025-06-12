const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;
const EMAIL_TTL_MS = 5 * 60 * 1000;
const JWT_SECRET = 'your-secret-key'; // Hey dummy: Change and secure in env vars!

app.use(express.json());

// MongoDB
mongoose.connect('mongodb://localhost:27017/dummyEmailDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  passwordHash: String,
});
const User = mongoose.model('User', userSchema);


const emailSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  email: String,
  expiresAt: Number,
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
const Email = mongoose.model('Email', emailSchema);


const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing token' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};


app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Missing username or password' });

  const existingUser = await User.findOne({ username });
  if (existingUser)
    return res.status(400).json({ message: 'Username already exists' });

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = new User({ username, passwordHash });
  await newUser.save();

  res.json({ message: 'User registered successfully' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword)
    return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
});


app.post('/generate', authenticate, async (req, res) => {
  const id = uuidv4();
  const username = Math.random().toString(36).substring(2, 10);
  const email = `${username}@example.com`;
  const expiresAt = Date.now() + EMAIL_TTL_MS;

  const newEmail = new Email({ id, email, expiresAt, ownerId: req.user.id });
  await newEmail.save();

  res.json({ id, email, expiresAt });
});

app.get('/emails', authenticate, async (req, res) => {
  const now = Date.now();
  const activeEmails = await Email.find({
    ownerId: req.user.id,
    expiresAt: { $gt: now },
  });
  res.json(activeEmails);
});

// Get details of a single email
app.get('/emails/:id', authenticate, async (req, res) => {
  const email = await Email.findOne({ id: req.params.id, ownerId: req.user.id });
  if (email && email.expiresAt > Date.now()) {
    return res.json(email);
  }
  res.status(404).json({ message: 'Email not found or expired' });
});

// Delete email by ID
app.delete('/emails/:id', authenticate, async (req, res) => {
  const deleted = await Email.deleteOne({ id: req.params.id, ownerId: req.user.id });
  if (deleted.deletedCount > 0) {
    return res.json({ message: 'Email deleted' });
  }
  res.status(404).json({ message: 'Email not found' });
});

// Periodic cleanup of expired emails, yeah sure buddy
setInterval(async () => {
  const now = Date.now();
  await Email.deleteMany({ expiresAt: { $lte: now } });
}, 60 * 1000);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

