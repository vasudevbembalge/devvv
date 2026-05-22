require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ✅ Import JWT Auth Middleware
const auth = require("./middleware/auth");
const fs = require('fs');

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const authRoutes = require('./routes/auth');
const agentRoutes = require('./routes/agents');
const uploadRoutes = require('./routes/upload');
const distributionRoutes = require('./routes/distributions');

// ✅ Initialize App
const app = express();

// Health check endpoint for K8s
app.get('/', (req, res) => res.status(200).send('OK'));

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
const userRoutes = require("./routes/auth");

app.use('/user/auth', authRoutes);
app.use('/user/agents', agentRoutes);
app.use('/user/upload', uploadRoutes);
app.use('/user/distributions', distributionRoutes);

// ✅ Protected Route (Dashboard Example)
app.get("/dashboard", auth, async (req, res) => {
  res.json({ message: `Welcome ${req.user.email} to your dashboard!` });
});

// ✅ MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://ks3409192_db_user:XPksZDWEXS3gp5V7@machinetest.qhyuma8.mongodb.net/?appName=Machinetest";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB successfully"))
  .catch((err) => console.error("❌ Error connecting to MongoDB:", err));

// ✅ Server Listen
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
