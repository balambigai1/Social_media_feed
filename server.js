import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" })); // This is crucial for parsing JSON bodies
app.use(express.urlencoded({ extended: true , limit: '50mb' })); 

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Bala@2002",
    database:"social_media_feed"
})

db.query("SET SQL_SAFE_UPDATES = 0;", (err) => {
  if (err) {
    console.error("Error disabling safe update mode:", err);
  }
});
app.get("/", (req, res) => {
  db.query("USE social_media_feed", (err) => {
    if (err) return res.json({ message: err.message });

    const sql = "SELECT * FROM users";
    db.query(sql, (err, result) => {
      if (err) return res.json({ message: err.message });
      return res.json(result);
    });
  });
});
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
    console.log("register", req);
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.promise().query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [users] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret');
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post routes
app.post("/api/posts", authenticateToken, async (req, res) => {
  try {
    const { content, image } = req.body;
    const userId = req.user.id;

    // Validate image size if present
    if (image) {
      // Remove the data:image/[type];base64, prefix to get actual base64 string
      const base64Data = image.split(";base64,").pop();

      // Calculate image size in MB
      const sizeInMb = (base64Data.length * 0.75) / 1024 / 1024;

      // Check if image is too large (e.g., > 10MB)
      if (sizeInMb > 10) {
        return res.status(400).json({
          error: "Image too large. Please upload an image smaller than 10MB",
        });
      }
    }

    const [result] = await db
      .promise()
      .query(
        "INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)",
        [userId, content, image]
      );

    res.status(201).json({
      message: "Post created successfully",
      postId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      error: "Failed to create post",
      details: error.message,
    });
  }
});


app.get('/api/posts', authenticateToken, async (req, res) => {
  try {
    const [posts] = await db.promise().query(`
      SELECT 
        p.*,
        u.username,
        COUNT(DISTINCT l.id) as likes_count,
        COUNT(DISTINCT c.id) as comments_count,
        EXISTS(SELECT 1 FROM likes WHERE user_id = ? AND post_id = p.id) as is_liked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      LEFT JOIN comments c ON p.id = c.post_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `, [req.user.id]);
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like routes
app.post("/api/posts/:postId/like", authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // First check if like exists
    const [existingLike] = await db
      .promise()
      .query("SELECT id FROM likes WHERE user_id = ? AND post_id = ?", [
        userId,
        postId,
      ]);

    if (existingLike.length > 0) {
      // Unlike - delete using primary key
      await db
        .promise()
        .query("DELETE FROM likes WHERE id = ?", [existingLike[0].id]);
      return res.json({ message: "Post unliked successfully" });
    } else {
      // Like
      await db
        .promise()
        .query("INSERT INTO likes (user_id, post_id) VALUES (?, ?)", [
          userId,
          postId,
        ]);
      return res.json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.error("Error handling like:", error);
    res.status(500).json({
      error: "Failed to process like/unlike",
      details: error.message,
    });
  }
});


// Comment routes
app.post('/api/posts/:postId/comments', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    
    await db.promise().query(
      'INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)',
      [userId, postId, content]
    );
    
    res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.listen(8081,()=>{
    console.log("Server is running on port 8081")})