const mongoose = require('mongoose');
const MONGO_URI="mongodb+srv://lakshaysatija14_db_user:Lakshay123@cluster0.cjwqarp.mongodb.net/smartdesk?retryWrites=true&w=majority&appName=Cluster0"

const connectDB = async() => {
    try {
        await mongoose.connect(MONGO_URI,{});
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}
module.exports = connectDB;
