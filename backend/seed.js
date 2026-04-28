// seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const email = 'admin@example.com';
  const password = 'Admin@123'; // change after seed

  const exists = await User.findOne({ email });
  if(exists){
    console.log('Admin already exists:', email);
    process.exit(0);
  }
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  await User.create({ email, passwordHash });
  console.log('Admin created:', email, 'password:', password);
  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
