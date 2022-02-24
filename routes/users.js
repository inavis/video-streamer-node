import express, { response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

import { getAllUsers,addUser,getUserByEmail,genPassword } from "../helper.js";

const router = express.Router();

router.get("/",async(request,response)=>{
    let result = await getAllUsers();
    response.send(result);
})

router.post("/register",async(request,response)=>{
    let user = request.body;
    console.log(user)
    user.password =await genPassword(user.password);
    let userfromdb = await getUserByEmail(user.email);
    if(userfromdb){
            response.send({"message":"User with this email already exists."})
    }else{
        let result = await addUser(user);
        response.send(result);
    }
})

router.post("/login", async (request, response) => {
    let user = request.body;
    //console.log(user);
    const userfromdb = await getUserByEmail(user.email)
    //console.log(userfromdb)

    if(!userfromdb){
        response.status(400).send({message:"Invalid credentials"})
        return
    }

    const isPasswordmatch = await bcrypt.compare(user.password,userfromdb.password)
    //console.log(isPasswordmatch);

    if(isPasswordmatch){
        const token = jwt.sign({id:userfromdb._id},process.env.SECRET_KEY,{expiresIn:'10h'});
        //console.log(token)
        response.status(200).send({message:"successful login",name:userfromdb.firstname+" "+userfromdb.lastname
        ,token:token})
    }else{
        response.status(400).send({message:"Invalid credentials"})
    }
});

export const usersRouter = router;
