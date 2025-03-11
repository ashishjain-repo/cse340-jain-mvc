import { Router } from "express";
import { deleteGame } from "../../models/index.js";

const router = Router();

router.post('/delete/:id', async (req, res) => {
    const referer = req.get('Referer') || '/';
    console.log(referer);
    await deleteGame(req.params.id || null);
    res.redirect(referer);
});

export default router;