import { Router } from "express";
import { registerUser, verifyUser} from "../../models/account/index.js";

const router = Router();

router.get('/register', async (req, res) => {
    res.render('account/register', {title: "Register User"});
});

router.post('/register', async (req, res) => {
    const userDetails = req.body
    if(registerUser(userDetails.email, userDetails.password)){
        res.redirect('/account/login');
    }else{
        res.redirect('/account/register')
    }
});

router.get('/login', async (req, res) => {
    res.render('account/login', {title:"User Login"})
})

router.post('/login', async (req, res) => {
    const auth = req.body;
    if(verifyUser(auth.email, auth.password)){
        res.redirect('/account')
    }
})

router.get('/', async(req, res) => {
    res.render('account/index', {title:"Account Home"})
})
export default router;