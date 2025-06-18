//const express = require("express")
import express from "express";
import dotenv from "dotenv";
import { sql, createPool } from '@vercel/postgres';
import rateLimit from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js"
import job from "./config/cron.js";
dotenv.config();

const pool = createPool({ connectionString: process.env.DATABASE_URL });
const app = express()

if(process.env.NODE_ENV === "production") job.start();
//middleware
app.use(rateLimit)
app.use(express.json())
const PORT = process.env.PORT || 5001

app.get("/api/health", (req,res) => {
    res.status(200).json({status:"ok"})
})

async function initDB(){
    try{
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;
        
        console.log("Database initialized successfully"); 
    } catch(error){
        console.log("Error initializing DB", error);
        process.exit(1) // 1 is for failure and 0 means success
    }
}

app.use("/api/transactions", transactionsRoute)

initDB().then(() => {
    app.listen(PORT, () =>{
        console.log("Server is up and running on port:",PORT)  
    });
});
