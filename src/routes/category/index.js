import { Router } from "express";
import { getGamesByClassification, getClassifications, getGameById, deleteGame } from "../../models/index.js";
import { addNewGame } from "../../models/category.js";
import path from "path";
import fs from 'fs';

const router = Router();

// Helper function to verify and move uploaded game image
const getVerifiedGameImage = (images = []) => {
    // Exit early if no valid images array provided
    if (!images || images.length === 0) {
        return '';
    }
 
    // Process first image (assuming single image upload)
    const image = images[0];
    const imagePath = path.join(process.cwd(), `public/images/games/${image.newFilename}`);
 
    // Move uploaded file from temp location to permanent storage
    fs.renameSync(image.filepath, imagePath);
 
    // Cleanup by removing any remaining temporary files
    images.forEach(image => {
        if (fs.existsSync(image.filepath)) {
            fs.unlinkSync(image.filepath);
        }
    });
 
    // Return the new frontend image path for storage in the database
    return `/images/games/${image.newFilename}`;
};

router.get('/view/:id', async (req, res, next) => {
    const games = await getGamesByClassification(req.params.id);
    const title = `${games[0]?.classification_name || ''} Games`.trim();

    if (games.length <= 0) {
        // If the game is missing an image use a placeholder
        for (let i = 0; i < games.length; i++) {
            if (games[i].image_path == '') {
                games[i].image_path = 'https://placehold.co/300x300/jpg'
            }
        }
        const title = 'Category Not Found';
        const error = new Error(title);
        error.title = title;
        error.status = 404;
        next(error);
        return;
    }

    res.render('category/index', { title, games });
});

// Add game route 
router.get('/add', async (req, res) => {
    const classifications = await getClassifications();
    res.render('category/add', { title: 'Add New Game', classifications });
});

// Add route to accept new game information
router.post('/add', async (req, res) => {
    const { game_name, game_description, classification_id } = req.body;
    const image_path = getVerifiedGameImage(req.files?.image);
    await addNewGame(game_name, game_description, classification_id, image_path);
    res.redirect(`/category/view/${classification_id}`);
});

// Edit game route
router.get('/edit/:id', async (req, res) => {
    const classifications = await getClassifications();
    const game = await getGameById(req.params.id);
    res.render('category/edit', { title: 'Edit Game', classifications, game });
});

// Edit route to accept updated game information
router.post('/edit/:id', async (req, res) => {
    // Get existing game data to handle image replacement
    const oldGameData = await getGameById(req.params.id);
 
    // Extract form data and process any uploaded image
    const { game_name, game_description, classification_id } = req.body;
    const image_path = getVerifiedGameImage(req.files?.image);
 
    // Update game details in database
    await updateGame(req.params.id, game_name, game_description, classification_id, image_path);
 
    // Clean up old image file if a new one was uploaded
    if (image_path && image_path !== oldGameData.image_path) {
        const oldImagePath = path.join(process.cwd(), `public${oldGameData.image_path}`);
        if (fs.existsSync(oldImagePath) && fs.lstatSync(oldImagePath).isFile()) {
            fs.unlinkSync(oldImagePath);
        }
    }
 
    // Return to game category view page
    res.redirect(`/category/view/${classification_id}`);
});

export default router;