const mongoose = require('mongoose');
const MONGO_URI="mongodb+srv://lakhanamdhari2005_db_user:6pqjJHsTQ4kmdZD7@cluster0.tpskgwv.mongodb.net/smartdesk?appName=Cluster0"

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