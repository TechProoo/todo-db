import dotenv from "dotenv"
dotenv.config()
import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.HOST,
    port: process.env.DB_PORT
})

export default pool