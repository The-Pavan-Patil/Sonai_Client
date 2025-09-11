import mongoose from 'mongoose';


const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://thepavanpatilofficial_db_user:sonai_5555@cluster0.vmdbdf9.mongodb.net/sonai?retryWrites=true&w=majority&appName=Cluster0");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error).message}`);
    process.exit(1);
  }
};

export default connectDB;
