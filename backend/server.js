const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs/promises');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.HOST || '0.0.0.0';
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-env';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '*';
const CONTENT_FILE_PATH = path.join(__dirname, 'content.json');

app.use(cors({ origin: FRONTEND_ORIGIN === '*' ? true : FRONTEND_ORIGIN }));
app.use(express.json({ limit: '2mb' }));

const sanitizeContent = (payload) => {
  if (!payload || typeof payload !== 'object') return null;
  return payload;
};

const readContent = async () => {
  const raw = await fs.readFile(CONTENT_FILE_PATH, 'utf-8');
  return JSON.parse(raw);
};

const writeContent = async (content) => {
  await fs.writeFile(CONTENT_FILE_PATH, JSON.stringify(content, null, 2), 'utf-8');
};

const comparePassword = async (password) => {
  if (ADMIN_PASSWORD_HASH) {
    return bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  }
  return password === ADMIN_PASSWORD;
};

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return res.status(401).json({ error: 'Brak tokenu autoryzacji.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token jest nieprawidłowy lub wygasł.' });
  }
};

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Brak loginu lub hasła.' });
  }

  if (username !== ADMIN_USERNAME) {
    return res.status(401).json({ error: 'Nieprawidłowe dane logowania.' });
  }

  const passwordIsValid = await comparePassword(password);
  if (!passwordIsValid) {
    return res.status(401).json({ error: 'Nieprawidłowe dane logowania.' });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return res.json({ token });
});

app.get('/api/content', async (_req, res) => {
  try {
    const content = await readContent();
    return res.json(content);
  } catch (error) {
    return res.status(500).json({ error: 'Nie udało się odczytać treści CMS.' });
  }
});

app.put('/api/content', authMiddleware, async (req, res) => {
  const nextContent = sanitizeContent(req.body);
  if (!nextContent) {
    return res.status(400).json({ error: 'Nieprawidłowy format treści CMS.' });
  }

  try {
    await writeContent(nextContent);
    return res.json(nextContent);
  } catch (error) {
    return res.status(500).json({ error: 'Nie udało się zapisać treści CMS.' });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`CMS backend listening on http://${HOST}:${PORT}`);
});
