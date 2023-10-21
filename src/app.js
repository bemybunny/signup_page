require('dotenv').config();
const express = require('express');
const app = express();
const path=require('path');
require('./db/conn');
const Register = require('./models/registers');
const {json} = require('express');
const hbs = require('hbs');
 const bcrypt=require('bcryptjs');
const port = process.env.PORT || 3000;
const static_path = path.join(__dirname,"../public");
const template_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");

app.use(express.json ());
app.use(express.urlencoded({extended:false}));
// console.log(path.join(__dirname,"../public")); 
app.use(express.static(static_path));
app.set('view engine','hbs');
app.set('views',template_path);cld
hbs.registerPartials(partials_path);

console.log(process.env.SECRET_KEY); 
app.get('/',(req,res)=>{
    res.render('index');
});
app.get('/register',(req,res)=>{
    res.render('register');
})
//create a new user in our database 
app.post('/register',async (req,res)=>{
    try{
        const password = req.body.password;
        const cpassword = req.body.password;
        if(password===cpassword){
            const registerEmployee = new Register({
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                email : req.body.email,
                gender : req.body.gender,
                phone : req.body.phone,
                age : req.body.age,
                password : password,
                confirmpassword : cpassword 
            })
            console.log(registerEmployee);
        const token=await registerEmployee.generateAuthToken();
        console.log(token);
        const registered = await registerEmployee.save();
            res.status(201).render("index") ;
        }else{
            res.send('password are not match')
        }
  
    }catch(err){
        res.status(404).send(err);
    }
   // res.render('register')
})
app.get('/login',(req,res)=>{
    res.render('login');
})
// app.post('/login',async(req,res)=>{

//     try{
//         const email=req.body.email;
//         const password=req.body.password;
       
//         const useremail=await Register.findOne({email:email});
//         app.get('/login',(req,res)=>{
//     res.render('login');
// })
app.post('/login',async(req,res)=>{

    try{
        const email=req.body.email;
        const password=req.body.password;
       
        const useremail=await Register.findOne({email:email});
        const isMatch = await bcrypt.compare(password,useremail.password);
        const token=await useremail.generateAuthToken();
        console.log('the token part is' + token);
        // const registered = await useremail.save();

        if (!useremail) {
            res.status(404).send('Invalid email');
            return;
        }
        if(isMatch){
            res.render('index');
        }else{
            res.send('password are not match');
        }
    }catch(err){
        res.status(404).send('invalid email');
    }
})

//         if(useremail.password===password){
//             res.status(201).render('index');
//         }else{
//             res.send('password are not match');
//         }
//     }catch(err){
//         res.status(404).send('invalid email');
//     }
// })

// const bcrypt = require('bcryptjs');
// const securePassword=async(password)=>{
//     const passwordHash = await  bcrypt.hash(password,10);
//     console.log(passwordHash);
//     const passwordmatch = await bcrypt.compare('thapa@13,passwordHash');
// }
// securePassword("thapa@123");

const jwt = require('jsonwebtoken');
const createtoken=async()=>{
    const token = await jwt.sign({_id:"653347038b1d0f026b958f52"},"mynameisleenagyptaandyourschamanchutiye",
   { expiresIn:"2 seconds"});
   //console.log(token);
    const userVer=await jwt.verify(token,"mynameisleenagyptaandyourschamanchutiye");
    //console.log(userVer);
}
createtoken();
app.listen(port,()=>{
    console.log(`server is running at port number ${port}`);
})
//Hash is a one way algorithm