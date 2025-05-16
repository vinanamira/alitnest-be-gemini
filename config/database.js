import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false, 
    serverSelectionTimeoutMS: 10000, 
})
    .then(() => {
        console.log('DB Successfully Connected');
    })
    .catch((err) => console.log(err));

export default mongoose;