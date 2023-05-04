const { default: mongoose } = require('mongoose');
const url = "mongodb+srv://zeeshan1406:Pluto1234@microservice.iw3isuo.mongodb.net/test";

const connectDB = async () =>{
    try{
        const connect = await mongoose.connect(url) 
        console.log("Database Connected:", connect.connection.host, connect.connection.name);

       
    }
    catch (error) {
        console.log(error);
        process.exit(1);
        
    }
}


module.exports = connectDB;