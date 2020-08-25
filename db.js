require('dotenv').config()
const pg = require('pg');
const { Pool } = require('pg')
const isProduction = process.env.NODE_ENV === 'production'

console.log('DB_USER', process.env.DB_USER);
console.log('isProduction', isProduction);


const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl: { rejectUnauthorized: false }
})

// let pool = new pg.Client({
//     user: process.env.DB_USER,
//     password: process.env.DATABASE_PASSWORD,
//     database: process.env.DB_DATABASE,
//     port: process.env.DB_PORT,
//     host: process.env.DB_HOST,
//     ssl: { rejectUnauthorized: false }
// });
// console.log('Connecting to db - start')
// pool.connect();
// console.log('Connecting to db - end')
module.exports =  pool ;