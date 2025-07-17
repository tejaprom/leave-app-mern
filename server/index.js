// server/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
// app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true
// }));

const allowedOrigins = [
  "http://localhost:5173",
  "https://leave-app-mern.vercel.app",
  "https://leave-app-mern-client.onrender.com",
];

app.use(  
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const leaveRoutes = require("./routes/leaveRoutes");
app.use("/api/leaves", leaveRoutes);

//upload file
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Leave App backend running!");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from the backend 👋" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
