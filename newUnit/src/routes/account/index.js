import { Router } from 'express';
import { registerUser, verifyUser } from '../../models/account/index.js';
import {body, validationResult} from 'express-validator';
import { requireAuth } from '../../utils/index.js';

const router = Router();


// Build an array of validation checks for the registration route
const registrationValidation = [
    body("email")
        .isEmail()
        .withMessage("Invalid email format."),
    body("password")
        .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
        .withMessage("Password must be at least 8 characters long, include one uppercase letter, one number, and one symbol.")
];

router.get('/register', async(req, res) => {
    res.render('account/register', {title: 'Register User'});
    res.locals.scripts.push("<script src='/js/registration.js'></script>");
});

router.post('/register', registrationValidation, async(req, res) => {
    // Check if there are any validation errors
    const results = validationResult(req);
    if (results.errors.length > 0) {
        results.errors.forEach((error) => {
            req.flash('error', error.msg);
        });
        res.redirect('/account/register');
        return;
    }
    const { email, password, confirm_password } = req.body;
    if(password != confirm_password){
        req.flash("error", "Password do not match");
        res.redirect('/account/register');
    }else if(!password || !confirm_password || !email){
        req.flash("error", "Required fields must not be empty.")
        res.redirect('/account/register');
    }else{
        registerUser(email, password);
        req.flash("success", "Registration successful! Please log in.");
        res.redirect('/account/login');
    }
});

router.get('/login', async(req, res) => {
    res.render('/account/login', {title: 'User Login'});
});

router.post('/login', async(req, res) => {
    const {email, password} = req.body;
    if(verifyUser(email, password)){
        req.session.user = true;
        res.redirect('/account');
    };
});

router.get('/', requireAuth, async(req, res) => {
    res.render('/account/index', {title: "Account Home"});
});
export default router;