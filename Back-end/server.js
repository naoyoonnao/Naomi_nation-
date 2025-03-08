require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// Підключення до бази даних
connectDB();

// Роутинг
app.use("/user", authRoutes);

// Запуск сервера
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

app.get("/", (req, res) => {
    res.send("Сервер працює!");
  });

