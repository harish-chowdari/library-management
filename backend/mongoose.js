const mongoose = require("mongoose");
mongoose.set('strictQuery', true);


mongoose.connect(process.env.mongodb_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db=mongoose.connection;

db.on("error",(error)=> console.log(error));
db.once("open",()=>console.log("connected to database"));