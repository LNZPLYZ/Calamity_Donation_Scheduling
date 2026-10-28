
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import mysqlConnection from "./config/mysql.js";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;
const DATABASE_NAME = "calamity_donation_db";

const tables = [
    "users",
    "calamities",
    "donation_categories",
    "donations",
    "donation_items",
    "pickups",
    "donation_receipts",
    "receipt_items"
];

const mongoClient = new MongoClient(MONGODB_URL);

async function migrateData() {
    try {
        if (!MONGODB_URL) {
            throw new Error("MONGODB_URL is missing from .env");
        }

        // Connect to MongoDB Atlas
        await mongoClient.connect();

        const database = mongoClient.db(DATABASE_NAME);

        console.log("Connected to MongoDB Atlas.");
        console.log("Checking destination collections...");

        // Check for existing destination collections first
        const existingCollections = await database
            .listCollections({}, { nameOnly: true })
            .toArray();

        const existingNames = existingCollections.map(
            collection => collection.name
        );

        const conflicts = tables.filter(
            table => existingNames.includes(table)
        );

        if (conflicts.length > 0) {
            throw new Error(
                "Migration stopped to protect existing data. " +
                "These collections already exist: " +
                conflicts.join(", ")
            );
        }

        // Read all SQL tables before writing to MongoDB
        const tableData = {};

        for (const table of tables) {
            const [rows] = await mysqlConnection.query(
                `SELECT * FROM \`${table}\``
            );

            tableData[table] = rows;

            console.log(`${table}: ${rows.length} records ready`);
        }

        console.log("\nStarting migration...");

        // Transfer records while preserving original SQL fields and IDs
        for (const table of tables) {
            const rows = tableData[table];

            if (rows.length === 0) {
                console.log(`${table}: no records; skipped`);
                continue;
            }

            await database.collection(table).insertMany(rows);

            console.log(`${table}: ${rows.length} records imported`);
        }

        console.log("\nMigration completed successfully!");
        console.log("All 8 SQL tables have been processed.");
        console.log("Existing calamitydatabaseDB was not modified.");

    } catch (error) {
        console.error("\nMigration stopped:", error.message);
        process.exitCode = 1;

    } finally {
        await mysqlConnection.end();
        await mongoClient.close();
    }
}

await migrateData();
