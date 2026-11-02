import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas database using Mongoose
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.warn('⚠️  MONGODB_URI is not defined in .env file.');
      console.warn('⚠️  Please add your MongoDB connection string to .env to connect to the database.');
      return;
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Do not exit process in development so server can still serve info
  }
};

export default connectDB;
