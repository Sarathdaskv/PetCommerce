const mongoose=require('mongoose')

function dbConnect(){
    mongoose.connect(process.env.CONNECTION_STRING,{
        useNewUrlParser:true,
         useUnifiedTopology:true
    })
    .then(()=>{
        console.log("connected to the database");
    })
    .catch(e=>{
        console.log(e);
    })
}

module.exports=dbConnect;