// require('dotenv').config( {path: './env'})
import 'dotenv/config';



import connectDB from "./db/conn.js";

import { app } from "./app.js";

// dotenv.config({
//     path: './env'
// }) 


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is Running at PORT ${process.env.PORT || 8000}`);
        
    });
})
.catch((error)=> {
    console.log("MONGO DB Connection failed;",error);
    
})



/*
import express from "express";
const app=express();

;(  async ( ) => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error", (error)=> {
            console.log(("error: ", error));
            throw error
            
        })
    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw error;
        
    }
}) ( )
    */
   
