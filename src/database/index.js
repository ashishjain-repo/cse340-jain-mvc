import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs'

const dbPromise = (async () => {
    return await open({
        filename: './src/database/db.sqlite',
        driver: sqlite3.Database
    })
})();

export const setupDatabase = async () => {
    const sql = fs.readFileSync('./src/database/setup.sql', 'utf-8');
    const db = await dbPromise;
    await db.exec(sql);
};

export default dbPromise;