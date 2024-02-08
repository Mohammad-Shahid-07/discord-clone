import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.MONGO_URI) {
    return console.log("MONGO_URI must be defined");
  }
  if (isConnected) {
    console.log("=> using existing database connection");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "discord",
    });
    isConnected = true;
    console.log("MongoDB connection is Made!");
    return true;
  } catch (error) {
    console.log("=> error while connecting to database:", error);
  }
};
