// scripts/createAdmin.js
import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createDefaultAdmin = async () => {
  try {
    await mongoose.connect("mongodb+srv://thepavanpatilofficial_db_user:sonai_5555@cluster0.vmdbdf9.mongodb.net/sonai?retryWrites=true&w=majority&appName=Cluster0");
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }
    
    // Create default admin
    const admin = new User({
      username: 'admin',
      email: 'admin@company.com',
      password: 'admin123', // Will be hashed by the pre-save hook
      role: 'admin'
    });
    
    await admin.save();
    console.log('Default admin user created successfully');
    console.log('Username: admin');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
  }
};

createDefaultAdmin();
