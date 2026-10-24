import mongoose from "mongoose";
import userRepository from "../repositories/userRepository.js";

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/socialmedia";
    await mongoose.connect(mongoUri);
    console.log("MongoDB conectado");
    await userRepository.createTestUser();
};

export default connectDB;
