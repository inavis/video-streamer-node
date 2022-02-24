import { app, client } from "./index.js";
import bcrypt from "bcrypt";

//users
export async function getAllUsers(){
    return await client.db("video-streamer-app").collection("users").find({}).toArray();
}

export async function getUserByEmail(email){
    return await client.db("video-streamer-app").collection("users").findOne({email:email});
}

export async function addUser(user){
    return await client.db("video-streamer-app").collection("users").insertOne(user);
}

//general
export async function genPassword(password){
    const salt =await bcrypt.genSalt(10);
    const hashedpassword =await bcrypt.hash(password,salt)
    console.log(password,salt,hashedpassword);
    return hashedpassword
  }