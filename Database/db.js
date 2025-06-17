const mysql = require('mysql2');
const dotenv = require('dotenv')
dotenv.config()

const db = mysql.createPool({
    host:'localhost',
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:'userinfo',
    multipleStatements: true
})

db.getConnection((err,connection)=>{
    if(err){
        console.error("error occurred while connecting to the database:", err);
    }
    else{
        console.log("Connected to the database successfully!");
       
    }
    const createtable = `CREATE TABLE IF NOT EXISTS user(userid INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;
    connection.query(createtable,(err,result)=>{
        if(err){
            console.log("table not created",err)
        }
        else{
            console.log("table created")
        }
        
    })
    
})

module.exports = db;