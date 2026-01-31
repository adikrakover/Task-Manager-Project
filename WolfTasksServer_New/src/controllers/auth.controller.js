import bcrypt from 'bcryptjs';
import db from '../db.js';
import { signToken } from '../middleware/auth.js';

export function register(req, res) {
  const { name, email, password } = req.body || {};
  console.log('Register attempt for:', email); // לוג לבדיקה בשרת

  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  const hash = bcrypt.hashSync(password, 10);
  
  try {
    const info = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?,?,?)').run(name, email, hash);
    
    // שליפה מחדש של המשתמש כדי לוודא שהוא נוצר
    const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(info.lastInsertRowid);
    
    if (!user) {
      console.error('User creation failed - user not found after insert');
      return res.status(500).json({ error: 'Failed to create user' });
    }

    const token = signToken(user);
    console.log('User created successfully, sending token');
    res.status(201).json({ user, token }); // כאן נשלח האובייקט שהאנגולר מחפש
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(409).json({ error: 'Email already exists or DB error' });
  }
}

export function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email, password required' });
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken(user);
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
}

export function me(req, res) {
  const row = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(req.user.id);
  if (!row) return res.status(404).json({ error: 'User not found' });
  res.json(row);
}
