import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs'

const dbPromise = (async () => {
    const db = await open({
        filename: './src/database/db.sqlite',
        driver: sqlite3.Database
    });

    const sql = fs.readFileSync('./src/database/setup.sql', 'utf-8');
    return db;
}) ();

export default dbPromise;