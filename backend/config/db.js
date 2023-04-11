import mongoose from "mongoose";

const connectDB =async ()=>{

    try {
        const conn = await mongoose.connect("mongodb+srv://Gopi2301:Gopi123@cluster0.qoaszln.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log(`MongoDB Connected : ${conn.connection.host}`)
    } catch (error) {
        console.log(`error:${error.message}`)
        process.exit()
    }
}

export default  connectDB;