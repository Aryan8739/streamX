// require('dotenv').config( {path: './env'})
import 'dotenv/config';


import connectDB from "./db/conn.js";

// dotenv.config({
//     path: './env'
// }) 


connectDB()


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
   