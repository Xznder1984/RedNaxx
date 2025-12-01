const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// In-memory storage (replace with database in production)
const users = [];
const videos = [];

// Multer configuration for video uploads (using memory storage for Vercel)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for Vercel
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|avi|mov|mkv|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only video files are allowed!'));
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };
    
    users.push(user);
    
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '7d'
    });
    
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ success: true, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '7d'
    });
    
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ success: true, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

// Check auth status
app.get('/api/auth/check', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  res.json({ authenticated: true, user: { id: user.id, username: user.username, email: user.email } });
});

// Upload video (storing as base64 in memory for Vercel)
app.post('/api/upload', authenticateToken, upload.single('video'), (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }
    
    // Convert buffer to base64 for storage
    const videoBase64 = req.file.buffer.toString('base64');
    
    const video = {
      id: videos.length + 1,
      title: title || 'Untitled Video',
      description: description || '',
      videoData: videoBase64,
      mimeType: req.file.mimetype,
      userId: req.user.id,
      username: req.user.username,
      views: 0,
      uploadedAt: new Date()
    };
    
    videos.push(video);
    res.json({ success: true, video: { id: video.id, title: video.title } });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get all videos
app.get('/api/videos', (req, res) => {
  const videosWithoutData = videos.map(v => ({
    id: v.id,
    title: v.title,
    description: v.description,
    username: v.username,
    views: v.views,
    uploadedAt: v.uploadedAt,
    mimeType: v.mimeType
  }));
  res.json(videosWithoutData);
});

// Get single video
app.get('/api/videos/:id', (req, res) => {
  const video = videos.find(v => v.id === parseInt(req.params.id));
  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }
  
  video.views++;
  
  res.json({
    id: video.id,
    title: video.title,
    description: video.description,
    username: video.username,
    views: video.views,
    uploadedAt: video.uploadedAt,
    videoData: video.videoData,
    mimeType: video.mimeType
  });
});

module.exports = app;
