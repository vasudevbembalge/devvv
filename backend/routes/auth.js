const express= require("express");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");

const router= express.Router();

const User= require("../models/user");

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if ( !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPwd = await bcrypt.hash(password, 10); // Hash the password

    const newUser = new User({
      email,
      passwordHash: hashedPwd, // save hashed password
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.passwordHash) {
      return res.status(500).json({ message: "User password not set correctly" });
    }

    const isPwdValid = await user.comparePassword(password);


    if (!isPwdValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in .env");
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { email: user.email },
    });
  } catch (err) {
    console.error("Login route error:", err); // Log full error
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports=router;