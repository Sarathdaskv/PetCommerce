const express=require('express');
const session=require('express-session')
const mongoose=require('mongoose')
const nocache=require('nocache')
const dotenv=require('dotenv')
const morgan=require('morgan')
const path=require('path')
const dbConnect=require('./dbconnection')
const app= express();


dotenv.config({path:'config.env'});

dbConnect()//data base connection




app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(nocache());


const PORT=process.env.PORT||8080;


 app.set("view engine","ejs");
 app.use(express.static(path.join(__dirname, "public")))
 app.use(morgan('tiny')); 
app.use( 
    session(
    {
    secret: process.env.SESSION_SECRET_KEY, 
    resave:false,
    saveUninitialized:false
   
}) 
);


//app.set('views', path.join(__dirname, 'views'))
//app.set('layout','./views/layout/layout.ejs')

app.use('/admin',require('./routes/adminRoutes'))
app.use('/',require('./routes/userRouter'));

app.use('*',(req,res)=>{
    res.render('user/pageNotFound',{userData:0})
})

app.listen(PORT,()=>{
    console.log(` Server listening at ${PORT}`);
})
