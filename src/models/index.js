import dbPromise from "../database/index.js";

const getClassifications = async () => {
    const db = await dbPromise;
    return await db.all('SELECT * FROM classification');
};

const getGamesByClassification = async (classificationId) => {
    const db = await dbPromise;
    return await db.all('SELECT * FROM game WHERE classification_id = ?', [classificationId]);
};

export { getClassifications, getGamesByClassification }