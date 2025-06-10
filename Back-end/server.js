require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const connectDB = require('./db');

const authRoutes = require('./routes/authRoutes');
const catRoutes  = require('./routes/cats');
const categoryRoutes = require('./routes/categories');
const eventRoutes = require("./routes/events");

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

/* ─────────────────── РОУТИ ─────────────────── */
app.use('/user',     authRoutes);  // POST /user/login
app.use('/api/cats', catRoutes);   // POST /api/cats, GET /api/cats
app.use('/api/categories', categoryRoutes); 
app.use("/api/events", eventRoutes);
/* Тестовий ендпойнт */
app.get('/', (_, res) => res.send('Сервер працює!'));

/* ───────────── Mongo + старт сервера ────────── */
connectDB().then(() => {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});

