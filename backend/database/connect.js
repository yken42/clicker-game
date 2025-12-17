import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectdb = async () => {
    try {
        await mongoose.connect(process.env.DB_ATLAS_URL, {
            dbName: 'clicker_game'
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default connectdb;