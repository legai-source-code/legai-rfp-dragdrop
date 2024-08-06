import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

let mongooseConnected = false;
let client;

// MongoDB URI
const uri = process.env.MONGODB_URI; // Ensure this environment variable is correctly set

// Function to connect using Mongoose and MongoDB client
const connectDB = async () => {
    if (!mongooseConnected) {
        try {
            mongoose.set('strictQuery', true);
            await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            mongooseConnected = true;
            console.log('Mongoose connected...');
        } catch (error) {
            console.error('Error connecting with Mongoose:', error);
            throw error;
        }
    }

    if (!client) {
        try {
            client = new MongoClient(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            await client.connect();
            console.log('MongoClient connected...');
        } catch (error) {
            console.error('Error connecting MongoClient:', error);
            throw error;
        }
    }

    return client;
};

export default connectDB;