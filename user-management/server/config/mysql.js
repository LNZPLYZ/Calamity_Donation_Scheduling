
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const mysqlConnection = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "calamity_donation_db",
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
});

export default mysqlConnection;
